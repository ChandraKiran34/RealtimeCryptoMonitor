import cron from 'node-cron';
import nodemailer from 'nodemailer';
import axios from 'axios';
import { Alert } from '../models/Alert'; // Make sure the path is correct

// Define the type for the cryptocurrency data
interface CryptoData {
  id: string;
  current_price: number;
}

// Configure your email transporter (e.g., using Gmail SMTP)
const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: 'your_email@gmail.com',
    pass: 'your_email_password',
  },
});

// Function to check alerts and send emails
async function checkAlertsAndSendEmails() {
  try {
    // Fetch alerts from your database
    const alerts = await Alert.find({}).populate('userId'); // Assuming Alert has a 'userId' reference

    // Fetch current prices from your source (API, DB, etc.)
    const response = await axios.get<CryptoData[]>('http://localhost:3000/api/crypto-prices');
    const prices = response.data;

    // Loop through alerts and check conditions
    for (let alert of alerts) {
      const coin = prices.find((coin: CryptoData) => coin.id === alert.cryptoId);
      if (!coin) continue; // Skip if the coin is not found

      const currentPrice = coin.current_price;

      let shouldSendEmail = false;

      if (alert.direction === 'above' && currentPrice > alert.targetPrice) {
        shouldSendEmail = true;
      } else if (alert.direction === 'below' && currentPrice < alert.targetPrice) {
        shouldSendEmail = true;
      }

      if (shouldSendEmail) {
        // Send email
        await transporter.sendMail({
          from: 'your_email@gmail.com',
          to: 'my@mail.com', // Assuming userId is populated with user data
          subject: `Crypto Alert: ${alert.cryptoId}`,
          text: `The price of ${alert.cryptoId} has ${alert.direction} your target of $${alert.targetPrice}. Current price is $${currentPrice}.`,
        });

        console.log(`Email sent to ${alert.userId} for ${alert.cryptoId}`); //update
      }
    }
  } catch (error) {
    console.error('Error checking alerts:', error);
  }
}

// Schedule the job to run every minute (or adjust as needed)
cron.schedule('* * * * *', () => {
  checkAlertsAndSendEmails();
});
