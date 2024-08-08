import { fetchCryptoPrices } from "../services/cryptoService";
import express from "express";
const router = express.Router();



router.get('/crypto-prices', fetchCryptoPrices);

export default router;
