import axios from "axios";
import dotenv from 'dotenv';
dotenv.config();
// import { createClient } from "redis";

// const client = createClient();
// client.connect();

const COINGECKO_API_URL = process.env.COINGECKO_API_URL;
if(!COINGECKO_API_URL)
{
  console.log("Error fetching the url");
  process.exit(1);
}
const REFRESH_INTERVAL = 60000; // 1 minute

export const fetchCryptoPrices = async () => {
  try {
    const response = await axios.get(COINGECKO_API_URL+'/coins/markets', {
      params: {
        // ids: "bitcoin,ethereum",
        vs_currency: "usd",
        x_cg_demo_api_key: process.env.x_cg_demo_api_key, // Replace with your actual API key
      },
    });
    const prices = response.data;
    // await client.set("cryptoPrices", JSON.stringify(prices));
    console.log("Prices updated:", prices.map((price: { current_price: number, name:String, id:string }) => price.current_price + ' ' + price.name + ' ' + price.id));
    return prices;
  } catch (error) {
    console.error("Error fetching crypto prices:", error);
  }
};

setInterval(fetchCryptoPrices, REFRESH_INTERVAL);
