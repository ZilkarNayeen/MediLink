import bcrypt from 'bcrypt'
import jwt from 'jsonwebtoken'
import prisma from '../config/db.js'

const JWT_SECRET = process.env.JWT_SECRET || 'dev_secret'
const JWT_EXPIRES_IN = '7d'

// ─── Patient signup ───
export async function signup(req, res) {
  try {
    const { fullName, email, password } = req.body

    if (!fullName || !email || !password) {
      return res.status(400).json({ message: 'All fields are required' })
    }

    const existingUser = await prisma.user.findUnique({
      where: { email },
    })

    if (existingUser) {
      return res.status(409).json({ message: 'Email is already registered' })
    }

    const passwordHash = await bcrypt.hash(password, 10)

    const user = await prisma.user.create({
      data: {
        fullName,
        email,
        passwordHash,
      },
    })

    const token = jwt.sign(
      { userId: user.id, email: user.email, role: user.role },
      JWT_SECRET,
      { expiresIn: JWT_EXPIRES_IN },
    )

    return res.status(201).json({
      token,
      user: {
        id: user.id,
        fullName: user.fullName,
        email: user.email,
        role: user.role,
      },
    })
  } catch (error) {
    // eslint-disable-next-line no-console
    console.error('Signup error:', error)
    return res
      .status(500)
      .json({ message: error?.message || 'Internal server error' })
  }
}

// ─── Patient login ───
export async function login(req, res) {
  try {
    const { email, password } = req.body

    if (!email || !password) {
      return res.status(400).json({ message: 'Email and password are required' })
    }

    const user = await prisma.user.findUnique({
      where: { email },
    })

    if (!user) {
      return res.status(401).json({ message: 'Invalid credentials' })
    }

    const isMatch = await bcrypt.compare(password, user.passwordHash)

    if (!isMatch) {
      return res.status(401).json({ message: 'Invalid credentials' })
    }

    const token = jwt.sign(
      { userId: user.id, email: user.email, role: user.role },
      JWT_SECRET,
      { expiresIn: JWT_EXPIRES_IN },
    )

    return res.json({
      token,
      user: {
        id: user.id,
        fullName: user.fullName,
        email: user.email,
        role: user.role,
      },
    })
  } catch (error) {
    // eslint-disable-next-line no-console
    console.error('Login error:', error)
    return res
      .status(500)
      .json({ message: error?.message || 'Internal server error' })
  }
}

// ─── Admin login (hardcoded credentials) ───
export async function adminLogin(req, res) {
  try {
    const { username, password } = req.body

    if (!username || !password) {
      return res.status(400).json({ message: 'Username and password are required' })
    }

    if (username !== 'admin' || password !== 'admin') {
      return res.status(401).json({ message: 'Invalid admin credentials' })
    }

    const token = jwt.sign(
      { userId: 'admin', email: 'admin@medilink.local', role: 'admin' },
      JWT_SECRET,
      { expiresIn: JWT_EXPIRES_IN },
    )

    return res.json({
      token,
      user: {
        id: 'admin',
        fullName: 'Administrator',
        email: 'admin@medilink.local',
        role: 'admin',
      },
    })
  } catch (error) {
    console.error('Admin login error:', error)
    return res.status(500).json({ message: error?.message || 'Internal server error' })
  }
}

// ─── Doctor signup (admin-only) ───
// Expects `authenticate` + `authorize('admin')` middleware to run before this
export async function doctorSignup(req, res) {
  try {
    const { fullName, email, password } = req.body

    if (!fullName || !email || !password) {
      return res.status(400).json({ message: 'All fields are required' })
    }

    const existingUser = await prisma.user.findUnique({
      where: { email },
    })

    if (existingUser) {
      return res.status(409).json({ message: 'Email is already registered' })
    }

    const passwordHash = await bcrypt.hash(password, 10)

    const user = await prisma.user.create({
      data: {
        fullName,
        email,
        passwordHash,
        role: 'doctor',
      },
    })

    return res.status(201).json({
      message: 'Doctor registered successfully',
      user: {
        id: user.id,
        fullName: user.fullName,
        email: user.email,
        role: user.role,
      },
    })
  } catch (error) {
    console.error('Doctor signup error:', error)
    return res.status(500).json({ message: error?.message || 'Internal server error' })
  }
}

// ─── Doctor login ───
export async function doctorLogin(req, res) {
  try {
    const { email, password } = req.body

    if (!email || !password) {
      return res.status(400).json({ message: 'Email and password are required' })
    }

    const user = await prisma.user.findUnique({
      where: { email },
    })

    if (!user || user.role !== 'doctor') {
      return res.status(401).json({ message: 'Invalid doctor credentials' })
    }

    const isMatch = await bcrypt.compare(password, user.passwordHash)

    if (!isMatch) {
      return res.status(401).json({ message: 'Invalid doctor credentials' })
    }

    const doctorToken = jwt.sign(
      { userId: user.id, email: user.email, role: user.role },
      JWT_SECRET,
      { expiresIn: JWT_EXPIRES_IN },
    )

    return res.json({
      token: doctorToken,
      user: {
        id: user.id,
        fullName: user.fullName,
        email: user.email,
        role: user.role,
      },
    })
  } catch (error) {
    console.error('Doctor login error:', error)
    return res.status(500).json({ message: error?.message || 'Internal server error' })
  }
}
