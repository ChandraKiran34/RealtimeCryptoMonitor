import WebSocket, { WebSocketServer } from 'ws';
import axios from 'axios';
import dotenv from 'dotenv';

dotenv.config();

const COINGECKO_API_URL = process.env.COINGECKO_API_URL;

const wss = new WebSocketServer({ port: 8080 });
let ethereumData: { current_price: number; name: string; id: string } | null = null;

export const fetchCryptoPrices = async () => {
  try {
    const response = await axios.get(`${COINGECKO_API_URL}/coins/markets`, {
      params: {
        vs_currency: "usd",
        x_cg_demo_api_key: process.env.x_cg_demo_api_key,
      },
    });

    const prices = response.data;
    ethereumData = prices.find((price: { name: string }) => price.name === "Ethereum") || null;

    // Broadcast prices to all connected clients
    wss.clients.forEach(client => {
      if (client.readyState === WebSocket.OPEN) {
        client.send(JSON.stringify(prices));
      }
    });
    console.log(ethereumData?.current_price);

    console.log("hello")
  } catch (error) {
    console.error("Error fetching crypto prices:", error);
  }
};

// Fetch prices periodically and send updates to clients
setInterval(fetchCryptoPrices, 60000);




















// import axios from "axios";
// import dotenv from 'dotenv';
// import { Request, Response } from 'express';

// dotenv.config();

// const COINGECKO_API_URL = process.env.COINGECKO_API_URL;

// if (!COINGECKO_API_URL) {
//   console.error("Error: COINGECKO_API_URL is not defined in .env");
//   process.exit(1);
// }

// const REFRESH_INTERVAL = 60000; // 1 minute

// export const fetchCryptoPrices = async (req: Request, res: Response) => {
//   try {
//     const response = await axios.get(`${COINGECKO_API_URL}/coins/markets`, {
//       params: {
//         vs_currency: "usd",
//         x_cg_demo_api_key: process.env.x_cg_demo_api_key, // Replace with your actual API key
//       },
//     });

//     const prices = response.data;

//     // const data = prices.map((price: { current_price: number; name: string; id: string }) =>
//     //   `${price.current_price} ${price.name} ${price.id}`
//     // );

//     res.json(prices);
//     return prices;
//   } catch (error) {
//     console.error("Error fetching crypto prices:", error);
//     res.status(500).json({ error: "Failed to fetch crypto prices" });
//   }
// };

// // Fetch prices periodically
// setInterval(() => fetchCryptoPrices({} as Request, {} as Response), REFRESH_INTERVAL);
