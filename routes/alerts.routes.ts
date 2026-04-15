import { Router, Request, Response, NextFunction } from 'express';
import { z } from 'zod';
import TrafficAlert from '../models/TrafficAlert';

const router = Router();

const alertSchema = z.object({
  type: z.enum(['accident', 'construction', 'congestion', 'weather', 'event']),
  severity: z.enum(['low', 'moderate', 'high']),
  title: z.string().min(1, 'title is required'),
  description: z.string().min(1, 'description is required'),
  location: z.string().min(1, 'location is required'),
  estimatedDelay: z.string().min(1, 'estimatedDelay is required'),
});

const mongoIdSchema = z.string().regex(/^[a-fA-F0-9]{24}$/, 'Invalid ID format');

router.get('/', async (_req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const alerts = await TrafficAlert.find().sort({ timestamp: -1 });
    res.json(alerts);
  } catch (err) {
    next(err);
  }
});

router.post('/', async (req: Request, res: Response, next: NextFunction) => {
  try {
    const parsed = alertSchema.safeParse(req.body);
    if (!parsed.success) {
      res.status(400).json({ error: 'Validation failed', details: parsed.error.errors });
      return;
    }

    const newAlert = new TrafficAlert(parsed.data);
    await newAlert.save();

    const io = req.app.get('io');
    io.emit('traffic_alert', newAlert);

    res.status(201).json(newAlert);
  } catch (err) {
    next(err);
  }
});

router.post('/:id/resolve', async (req: Request, res: Response, next: NextFunction) => {
  try {
    const idCheck = mongoIdSchema.safeParse(req.params.id);
    if (!idCheck.success) {
      res.status(400).json({ error: 'Invalid alert ID format' });
      return;
    }

    const alert = await TrafficAlert.findById(req.params.id);
    if (!alert) {
      res.status(404).json({ error: 'Alert not found' });
      return;
    }

    alert.status = 'resolved';
    await alert.save();

    const io = req.app.get('io');
    io.emit('alert_resolved', alert);

    res.json(alert);
  } catch (err) {
    next(err);
  }
});

export default router;
