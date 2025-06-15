// backend/routes/traffic.routes.ts
import express, { Request, Response } from 'express';
import Traffic, { ITraffic } from '../models/Traffic';

const router = express.Router();

/**
 * @swagger
 * /api/traffic:
 *   get:
 *     summary: Get recent traffic data
 *     responses:
 *       200:
 *         description: Successful response
 */
router.get('/', async (_req: Request, res: Response) => {
  const data = await Traffic.find().sort({ timestamp: -1 }).limit(100);
  res.json(data);
});

/**
 * @swagger
 * /api/traffic:
 *   post:
 *     summary: Add new traffic data
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Traffic'
 *     responses:
 *       201:
 *         description: Created
 */
router.post('/', async (req: Request, res: Response) => {
  const traffic = new Traffic(req.body);
  await traffic.save();
  res.status(201).json(traffic);
});

export default router;