import express, { Request, Response, NextFunction } from 'express';
import { z } from 'zod';
import Traffic from '../models/Traffic';

const router = express.Router();

const trafficSchema = z.object({
  roadSegmentId: z.string().min(1, 'roadSegmentId is required'),
  vehicleCount: z.number().int().min(0, 'vehicleCount must be non-negative'),
  averageSpeedKph: z.number().min(0, 'averageSpeedKph must be non-negative'),
  congestionLevel: z.enum(['low', 'medium', 'high']),
  timestamp: z.string().datetime().optional(),
});

/**
 * @swagger
 * /api/traffic:
 *   get:
 *     summary: Get recent traffic data
 *     parameters:
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Successful response
 */
router.get('/', async (req: Request, res: Response, next: NextFunction) => {
  try {
    const limit = Math.min(parseInt(req.query.limit as string) || 100, 500);
    const page = Math.max(parseInt(req.query.page as string) || 0, 0);

    const [data, total] = await Promise.all([
      Traffic.find().sort({ timestamp: -1 }).limit(limit).skip(page * limit),
      Traffic.countDocuments(),
    ]);

    res.json({ data, total, page, limit });
  } catch (err) {
    next(err);
  }
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
router.post('/', async (req: Request, res: Response, next: NextFunction) => {
  try {
    const parsed = trafficSchema.safeParse(req.body);
    if (!parsed.success) {
      res.status(400).json({ error: 'Validation failed', details: parsed.error.errors });
      return;
    }

    const traffic = new Traffic(parsed.data);
    await traffic.save();

    const io = req.app.get('io');
    io.emit('traffic_update', traffic);

    res.status(201).json(traffic);
  } catch (err) {
    next(err);
  }
});

export default router;
