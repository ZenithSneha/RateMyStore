// backend/src/utils.js

// Email regex: simple pattern
const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

// Password regex: at least one uppercase + one special char, length 8–16
const passwordRegex = /^(?=.*[A-Z])(?=.*[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]).{8,16}$/;

function validateRegister({ name, email, password, address }) {
  if (!name || name.length < 20 || name.length > 60) {
    return 'Name must be between 20 and 60 characters';
  }
  if (!email || !emailRegex.test(email)) {
    return 'Invalid email';
  }
  if (!password || !passwordRegex.test(password)) {
    return 'Password must be 8–16 chars, include an uppercase and a special character';
  }
  if (address && address.length > 400) {
    return 'Address must be <= 400 characters';
  }
  return null;
}

module.exports = { validateRegister };
