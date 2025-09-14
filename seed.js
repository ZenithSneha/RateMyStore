// backend/prisma/seed.js
const bcrypt = require('bcryptjs');
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
  const adminPw = await bcrypt.hash('Admin@1234', 12);
  const ownerPw = await bcrypt.hash('Owner@1234', 12);

  // create admin
  await prisma.user.upsert({
    where: { email: 'admin@example.com' },
    update: {},
    create: {
      name: 'Administrator Account DemoUserNameX', // must be >=20 chars
      email: 'admin@example.com',
      password: adminPw,
      address: 'Admin address',
      role: 'ADMIN'
    }
  });

  // store owner
  const owner = await prisma.user.upsert({
    where: { email: 'owner@example.com' },
    update: {},
    create: {
      name: 'Store Owner DemoLongNameAAAA', // >=20
      email: 'owner@example.com',
      password: ownerPw,
      address: 'Owner address',
      role: 'STORE_OWNER'
    }
  });

  // create a store owned by owner
  await prisma.store.upsert({
    where: { name: 'Demo Store for Owner Demo' },
    update: {},
    create: {
      name: 'Demo Store for Owner Demo',
      email: 'store@example.com',
      address: '123 Demo street, City',
      ownerId: owner.id
    }
  });

  console.log('Seed complete');
}

main()
  .catch(e => { console.error(e); process.exit(1); })
  .finally(async () => { await prisma.$disconnect(); });
