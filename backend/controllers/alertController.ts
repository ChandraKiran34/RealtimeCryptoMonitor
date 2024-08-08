import { Request, Response } from 'express';
import { Alert } from '../models/Alert';

export const createAlert = async (req: Request, res: Response) => {
  try {
    const alert = new Alert(req.body);
    await alert.save();
    res.status(201).send(alert);
  } catch (error) {
    res.status(400).send(error);
  }
};

export const getAlerts = async (req: Request, res: Response) => {
  try {
    const alerts = await Alert.find({ userID: req.params.userId });
    res.status(200).send(alerts);
  } catch (error) {
    res.status(500).send(error);
  }
};
