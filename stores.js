// backend/src/routes/stores.js
const express = require('express');
const prisma = require('../prisma');
const { authMiddleware, requireRole } = require('../middleware/auth');

const router = express.Router();

/**
 * GET /stores
 * Query: search, page, limit, sort, order
 * Returns: list of stores with avgRating and userRating (if auth)
 */
router.get('/', authMiddleware, async (req, res) => {
  try {
    const { search = '', page = 1, limit = 20, sort = 'name', order = 'asc' } = req.query;
    const take = Math.min(parseInt(limit), 100);
    const skip = (parseInt(page) - 1) * take;

    // Basic filter
    const where = search ? { OR: [{ name: { contains: search, mode: 'insensitive' }}, { address: { contains: search, mode: 'insensitive' }}] } : {};

    const stores = await prisma.store.findMany({
      where,
      skip,
      take,
      orderBy: { [sort]: order }
    });

    // For each store compute avg rating and user's rating
    const storeWithRatings = await Promise.all(stores.map(async (s) => {
      const agg = await prisma.rating.aggregate({ where: { storeId: s.id }, _avg: { score: true }, _count: { score: true }});
      const avg = agg._avg.score ? Number(agg._avg.score.toFixed(2)) : null;
      let userRating = null;
      if (req.user) {
        const r = await prisma.rating.findUnique({ where: { userId_storeId: { userId: req.user.id, storeId: s.id }}}).catch(()=>null);
        if (r) userRating = r.score;
      }
      return { ...s, avgRating: avg, userRating };
    }));

    res.json({ data: storeWithRatings });
  } catch (e) {
    console.error(e);
    res.status(500).json({ message: 'Server error' });
  }
});

/**
 * POST /stores
 * Admin creates stores
 */
router.post('/', authMiddleware, requireRole('ADMIN'), async (req, res) => {
  try {
    const { name, email, address, ownerId } = req.body;
    if (!name || name.length < 20 || name.length > 60) return res.status(400).json({ message: 'Name must be 20-60 chars' });
    if (!address || address.length > 400) return res.status(400).json({ message: 'Address required and <=400 chars' });

    const store = await prisma.store.create({ data: { name, email, address, ownerId: ownerId || null }});
    res.json({ store });
  } catch (e) {
    console.error(e);
    res.status(500).json({ message: 'Server error' });
  }
});

/**
 * POST /stores/:id/rate
 * Auth required (any logged user)
 * Body: { score: 1..5 }
 * Upsert rating
 */
router.post('/:id/rate', authMiddleware, async (req, res) => {
  try {
    const storeId = parseInt(req.params.id);
    const score = parseInt(req.body.score);
    if (![1,2,3,4,5].includes(score)) return res.status(400).json({ message: 'Score must be 1..5' });

    // Ensure store exists
    const store = await prisma.store.findUnique({ where: { id: storeId }});
    if (!store) return res.status(404).json({ message: 'Store not found' });

    const upserted = await prisma.rating.upsert({
      where: { userId_storeId: { userId: req.user.id, storeId } },
      update: { score },
      create: { userId: req.user.id, storeId, score }
    });

    // recompute avg
    const agg = await prisma.rating.aggregate({ where: { storeId }, _avg: { score: true }});
    const avg = agg._avg.score ? Number(agg._avg.score.toFixed(2)) : null;

    res.json({ rating: upserted, avgRating: avg });
  } catch (e) {
    console.error(e);
    res.status(500).json({ message: 'Server error' });
  }
});

/**
 * GET /stores/:id/raters  (owner-only or admin)
 */
router.get('/:id/raters', authMiddleware, async (req, res) => {
  try {
    const storeId = parseInt(req.params.id);
    const store = await prisma.store.findUnique({ where: { id: storeId }});
    if (!store) return res.status(404).json({ message: 'Store not found' });

    // Allow admin or owner
    if (req.user.role !== 'ADMIN' && req.user.id !== store.ownerId) {
      return res.status(403).json({ message: 'Forbidden' });
    }

    const ratings = await prisma.rating.findMany({
      where: { storeId },
      include: { user: { select: { id: true, name: true, email: true }}},
      orderBy: { createdAt: 'desc' }
    });
    const avg = (await prisma.rating.aggregate({ where: { storeId }, _avg: { score: true } }))._avg.score;
    res.json({ avgRating: avg ? Number(avg.toFixed(2)) : null, ratings });
  } catch (e) {
    console.error(e);
    res.status(500).json({ message: 'Server error' });
  }
});

/**
 * GET /owner/stores  -> stores owned by current user (StoreOwner) + raters
 */
router.get('/owner/my', authMiddleware, requireRole('STORE_OWNER'), async (req, res) => {
  try {
    const stores = await prisma.store.findMany({ where: { ownerId: req.user.id }});
    const detailed = await Promise.all(stores.map(async (s) => {
      const ratings = await prisma.rating.findMany({ where: { storeId: s.id }, include: { user: { select: { id: true, name: true }}}});
      const avg = (await prisma.rating.aggregate({ where: { storeId: s.id }, _avg: { score: true } }))._avg.score;
      return { ...s, avgRating: avg ? Number(avg.toFixed(2)) : null, ratings };
    }));
    res.json({ stores: detailed });
  } catch (e) {
    console.error(e);
    res.status(500).json({ message: 'Server error' });
  }
});

/**
 * Admin dashboard (counts)
 */
router.get('/admin/dashboard', authMiddleware, requireRole('ADMIN'), async (req, res) => {
  try {
    const users = await prisma.user.count();
    const stores = await prisma.store.count();
    const ratings = await prisma.rating.count();
    res.json({ users, stores, ratings });
  } catch (e) {
    console.error(e);
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;
