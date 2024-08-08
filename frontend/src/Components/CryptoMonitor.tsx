import React, { useState, useEffect } from 'react';
import axios from 'axios';

// Define the type for your data based on the backend response
interface CryptoData {
  [key: string]: {
    usd: number;
  };
}

const CryptoPriceMonitor: React.FC = () => {
  const [cryptoData, setCryptoData] = useState<CryptoData | null>(null);
  const [error, setError] = useState<string | null>(null);

  const fetchCryptoPrices = async () => {
    try {
      const response = await axios.get<CryptoData>('http://localhost:3000/api/crypto-prices'); // Adjust URL as needed
      setCryptoData(response.data);
      setError(null); // Clear error if fetch is successful
    } catch (err) {
      setError('Error fetching crypto prices');
    }
  };

  useEffect(() => {
    fetchCryptoPrices(); // Fetch data on component mount

    // Set up the interval to fetch data every minute
    const intervalId = setInterval(() => {
      fetchCryptoPrices();
    }, 60000); // 60000 ms = 1 minute

    // Cleanup interval on component unmount
    return () => clearInterval(intervalId);
  }, []); // Empty dependency array ensures this runs once on mount

  return (
    <div>
      <h1>Cryptocurrency Prices</h1>
      {error && <p>{error}</p>}
      {cryptoData ? (
        <ul>
          {Object.entries(cryptoData).map(([crypto, data]) => (
            <li key={crypto}>
              {crypto}: ${data.usd}
            </li>
          ))}
        </ul>
      ) : (
        <p>Loading...</p>
      )}
    </div>
  );
};

export default CryptoPriceMonitor;
