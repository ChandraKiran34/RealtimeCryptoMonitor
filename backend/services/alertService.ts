import { Alert } from '../models/Alert';
import { createClient } from 'redis';
import { broadcast } from '../websocket/webSocket';

const client = createClient();
client.connect();

export const checkAlerts = async () => {
  const alerts = await Alert.find();
  const data = await client.get('cryptoPrices');
  if (!data) {
    console.error('No prices found in cache');
    return;
  }

  const prices = JSON.parse(data);
  alerts.forEach(alert => {
    const price = prices[alert.cryptoId]?.usd;
    if (price) {
      if ((alert.direction === 'above' && price >= alert.targetPrice) ||
          (alert.direction === 'below' && price <= alert.targetPrice)) {
        sendAlert(alert.userId, alert.cryptoId, price);
      }
    }
  });
};

const sendAlert = (userId: string, cryptoId: string, price: number) => {
  // Send alert to user (e.g., email or push notification)
  const alertMessage = `Alert for user ${userId}: ${cryptoId} is now ${price}`;
  console.log(alertMessage);
  broadcast({ type: 'alert', userId, cryptoId, price });
};

setInterval(checkAlerts, 60000); // 1 minute
