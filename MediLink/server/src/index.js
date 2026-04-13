import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import path from 'path';
import multer from 'multer';
import fs from 'fs';
import { fileURLToPath } from 'url';
import mongoose from 'mongoose';
import Report from './models/Report.js'; 

import authRouter from './routes/auth.js';
import appointmentsRouter from './routes/appointments.js';
import doctorsRouter from './routes/doctors.js';
import followUpsRouter from './routes/followups.js';
import { startScheduler } from './services/scheduler.js';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT || 5000;

// --- DATABASE CONNECTION ---
// If this fails, your GET and POST /api/reports will return 500 error
mongoose.connect(process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/medilink')
  .then(() => console.log("✅ MongoDB Connected Successfully"))
  .catch(err => console.error("❌ MongoDB Connection Error:", err));

app.use(cors({ origin: true, credentials: true }));
app.use(express.json());

// --- STATIC FOLDER ---
const uploadsPath = path.join(__dirname, '../uploads');
if (!fs.existsSync(uploadsPath)) fs.mkdirSync(uploadsPath);
app.use('/uploads', express.static(uploadsPath));

// --- MULTER CONFIG ---
const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, uploadsPath),
  filename: (req, file, cb) => cb(null, `${Date.now()}-${file.originalname.replace(/\s+/g, '_')}`)
});
const upload = multer({ storage });

// --- ROUTES ---

// GET Reports
app.get('/api/reports', async (req, res) => {
  try {
    // If DB is not connected, this throws an error (leading to 500)
    const reports = await Report.find().sort({ date: -1 });
    res.json(reports);
  } catch (error) {
    console.error("❌ GET Error:", error.message);
    res.status(500).json({ message: "Database read failed", error: error.message });
  }
});

// POST Upload
app.post('/api/upload-report', upload.single('reportImage'), async (req, res) => {
  try {
    if (!req.file) return res.status(400).json({ message: 'No file uploaded' });

    const imageUrl = `http://localhost:${PORT}/uploads/${req.file.filename}`;
    
    const newReport = new Report({
      testName: req.body.testName || req.file.originalname,
      imageUrl: imageUrl,
      date: new Date()
    });

    await newReport.save();
    console.log("✅ Report Saved to DB");
    res.status(201).json(newReport);
  } catch (error) {
    console.error("❌ POST Error:", error.message);
    res.status(500).json({ message: "Database save failed", error: error.message });
  }
});

app.use('/api/auth', authRouter);
app.use('/api/appointments', appointmentsRouter);
app.use('/api/doctors', doctorsRouter);
app.use('/api/follow-ups', followUpsRouter);

app.listen(PORT, () => {
  console.log(`🚀 Server on http://localhost:${PORT}`);
  startScheduler();
});