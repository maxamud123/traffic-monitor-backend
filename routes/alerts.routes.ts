// backend/routes/alerts.ts
import { Router, Request, Response } from 'express';
import TrafficAlert from '../models/TrafficAlert';

const router = Router();

router.get('/', async (req: Request, res: Response) => {
  const alerts = await TrafficAlert.find().sort({ timestamp: -1 });
  res.json(alerts);
});

router.post('/', async (req: Request, res: Response) => {
  const newAlert = new TrafficAlert({
    type: req.body.type,
    severity: req.body.severity,
    title: req.body.title,
    description: req.body.description,
    location: req.body.location,
    estimatedDelay: req.body.estimatedDelay,
  });
  await newAlert.save();

  const io = req.app.get('io');
  io.emit('traffic_alert', newAlert);
  res.status(201).json(newAlert);
});

router.post('/:id/resolve', async (req: Request, res: Response) => {
  const alert = await TrafficAlert.findById(req.params.id);
  if (alert) {
    alert.status = 'resolved';
    await alert.save();
    const io = req.app.get('io');
    io.emit('alert_resolved', alert);
    res.json(alert);
  } else {
    res.status(404).json({ error: 'Alert not found' });
  }
});

export default router;