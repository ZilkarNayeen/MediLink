import express from 'express';

import { PrismaClient } from '../../generated/prisma/index.js';

const prisma = new PrismaClient();
const router = express.Router();

router.get('/', async (req, res) => {
    try {
        // This matches the 'model Report' in your schema.prisma
        const reports = await prisma.report.findMany();
        res.json(reports);
    } catch (error) {
        console.error("Error fetching reports:", error);
        res.status(500).json({ error: "Could not fetch reports from database" });
    }
});

export default router;