const db = require('../db');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const validator = require('validator');
const crypto = require('crypto');

const createToken = (id) => {
  return jwt.sign({ id }, process.env.SECRET, { expiresIn: '3d' });
};

// Generates a code like "MAX8F3A2B1C"
const generateReferralCode = () => 'MAX' + crypto.randomBytes(4).toString('hex').toUpperCase();

const signupUser = async (req, res, next) => {
  const { name, email, password, referred_by_code } = req.body;
  try {
    if (!email || !password || !name) throw Error('All fields must be filled');
    if (!validator.isEmail(email)) throw Error('Email not valid');
    if (!validator.isStrongPassword(password)) throw Error('Password not strong enough');

    const userCheck = await db.query('SELECT * FROM "User" WHERE email = $1', [email]);
    if (userCheck.rows.length > 0) throw Error('Email already in use');

    const salt = await bcrypt.genSalt(10);
    const hash = await bcrypt.hash(password, salt);

    const referral_code = generateReferralCode();
    let referred_by_id = null;

    if (referred_by_code) {
      const referrerRes = await db.query('SELECT id FROM "User" WHERE referral_code = $1', [referred_by_code]);
      if (referrerRes.rows.length > 0) {
        referred_by_id = referrerRes.rows[0].id;
        // Increment referrer's count
        await db.query('UPDATE "User" SET referral_count = referral_count + 1 WHERE id = $1', [referred_by_id]);
        // Log in the Referral tracking table (Level 1 direct referral)
        await db.query(
          'INSERT INTO "Referral" (referrer_code, referred_code, level) VALUES ($1, $2, $3)',
          [referred_by_code, referral_code, 1]
        );
      }
    }

    const result = await db.query(
      'INSERT INTO "User" (name, email, password, referral_code, referred_by, role) VALUES ($1, $2, $3, $4, $5, $6) RETURNING id, role',
      [name, email, hash, referral_code, referred_by_id, 'user']
    );

    const user = result.rows[0];
    const token = createToken(user.id);

    res.cookie('token', token, { httpOnly: true, secure: process.env.NODE_ENV === 'production', sameSite: 'Lax', maxAge: 3 * 24 * 60 * 60 * 1000 });
    res.status(200).json({ email, name, role: user.role, referral_code });
  } catch (error) {
    res.status(400);
    next(error);
  }
};

const loginUser = async (req, res, next) => {
  const { email, password } = req.body;
  try {
    if (!email || !password) throw Error('All fields must be filled');

    const result = await db.query('SELECT * FROM "User" WHERE email = $1', [email]);
    const user = result.rows[0];

    if (!user || !(await bcrypt.compare(password, user.password))) {
      throw Error('Invalid credentials');
    }

    const token = createToken(user.id);
    res.cookie('token', token, { httpOnly: true, secure: process.env.NODE_ENV === 'production', sameSite: 'Lax', maxAge: 3 * 24 * 60 * 60 * 1000 });
    res.status(200).json({ email: user.email, name: user.name, role: user.role, referral_code: user.referral_code });
  } catch (error) {
    res.status(400);
    next(error);
  }
};

// Endpoint to fetch user data if cookie is valid on refresh
const getMe = async (req, res, next) => {
  try {
    const result = await db.query('SELECT email, name, role, referral_code FROM "User" WHERE id = $1', [req.user.id]);
    if (result.rows.length === 0) throw new Error('User not found');

    res.status(200).json(result.rows[0]);
  } catch (error) {
    res.status(401);
    next(error);
  }
};

// Properly clear the httpOnly cookie on logout
const logoutUser = (req, res) => {
  res.cookie('token', '', { httpOnly: true, expires: new Date(0) });
  res.status(200).json({ message: 'Logged out successfully' });
};

const getAllUsers = async (req, res, next) => {
  try {
    const result = await db.query('SELECT id, name, email, role, phone_number, wallet_address, created_at, referral_code, referral_count FROM "User" ORDER BY id ASC');
    res.status(200).json(result.rows);
  } catch (error) {
    res.status(500);
    next(error);
  }
};

const getReferralHistory = async (req, res, next) => {
  try {
    const result = await db.query('SELECT id AS "S.No", referrer_code, referred_code, level, created_at FROM "Referral" ORDER BY id ASC');
    res.status(200).json(result.rows);
  } catch (error) {
    res.status(500);
    next(error);
  }
};

// --- ADMIN ACTIONS ---

const deleteUser = async (req, res, next) => {
  const { id } = req.params;
  try {
    // Basic protection to prevent admin from deleting themselves
    if (req.user.id === parseInt(id, 10)) {
      throw new Error("You cannot delete your own admin account.");
    }
    await db.query('DELETE FROM "User" WHERE id = $1', [id]);
    res.status(200).json({ message: 'User deleted successfully' });
  } catch (error) {
    res.status(400);
    next(error);
  }
};

const loginAsUser = async (req, res, next) => {
  const { id } = req.params;
  try {
    const result = await db.query('SELECT * FROM "User" WHERE id = $1', [id]);
    const user = result.rows[0];

    if (!user) throw new Error('User not found');

    // Create a new token for the target user to simulate their session
    const token = createToken(user.id);

    // Replace current cookie with impersonated user's cookie
    res.cookie('token', token, { httpOnly: true, secure: process.env.NODE_ENV === 'production', sameSite: 'Lax', maxAge: 3 * 24 * 60 * 60 * 1000 });

    res.status(200).json({ email: user.email, name: user.name, role: user.role, referral_code: user.referral_code, message: 'Impersonation active' });
  } catch (error) {
    res.status(400);
    next(error);
  }
};

const updateUser = async (req, res, next) => {
  const { id } = req.params;
  const { name, phone_number, email, role, wallet_address } = req.body;

  try {
    // Simple direct update
    const result = await db.query(
      'UPDATE "User" SET name = $1, phone_number = $2, email = $3, role = $4, wallet_address = $5 WHERE id = $6 RETURNING id, name, email, phone_number, role, wallet_address, referral_code, created_at, referral_count',
      [name, phone_number, email, role, wallet_address, id]
    );

    if (result.rows.length === 0) throw new Error('User not found or update failed');

    res.status(200).json({ message: 'User updated successfully', user: result.rows[0] });
  } catch (error) {
    res.status(400);
    next(error);
  }
};

module.exports = { signupUser, loginUser, getMe, logoutUser, getAllUsers, getReferralHistory, deleteUser, loginAsUser, updateUser };