import React, { useState, useEffect } from 'react';
import axios from 'axios';
import {jwtDecode }from 'jwt-decode'; // Make sure jwt-decode is installed

interface CryptoData {
  id: string;
  name: string;
  current_price: number;
}

interface DecodedToken {
  userId: string;
  exp: number;
}

interface AlertData {
  targetPrice: number;
  direction: 'above' | 'below';
}

const CryptoPriceMonitor: React.FC = () => {
  const [cryptoData, setCryptoData] = useState<CryptoData[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [alerts, setAlerts] = useState<{ [key: string]: AlertData }>({}); // State to manage alerts for each coin

  useEffect(() => {
    const ws = new WebSocket('ws://localhost:8080');

    ws.onmessage = (event) => {
      const data = JSON.parse(event.data);
      setCryptoData(data);
    };

    ws.onerror = (_event) => {
      setError('WebSocket error');
    };

    return () => ws.close();
  }, []);

  const handleAddAlert = async (id: string) => {
    try {
      const token = localStorage.getItem('token'); // Assuming the JWT is stored in localStorage
      if (!token) {
        throw new Error('No token found');
      }

      const decodedToken = jwtDecode<DecodedToken>(token);
      const userId = decodedToken.userId;

      const { targetPrice, direction } = alerts[id];
      console.log("hello")

      await axios.post('http://localhost:3000/api/alerts/createAlert', {
        userId: userId,
        cryptoId: id,
        targetPrice,
        direction,
      }, {
        headers: {
          Authorization: `Bearer ${token}`, // Include the token in the request headers
        },
      });

      alert('Alert created successfully!');
    } catch (error) {
      console.error('Error creating alert:', error);
      alert('Failed to create alert');
    }
  };

  const handleInputChange = (id: string, field: keyof AlertData, value: string | number) => {
    setAlerts(prev => ({
      ...prev,
      [id]: {
        ...prev[id],
        [field]: value,
      },
    }));
  };

  return (
    <div>
      <h1>Cryptocurrency Prices</h1>
      {cryptoData.length > 0 ? (
        <ul>
          {cryptoData.map((coin) => (
            <li key={coin.id} style={{display:"flex", justifyContent:"space-between", gap:"1rem"}}>
              <p>{coin.name} ({coin.id})</p>
              <p>${coin.current_price.toFixed(2)}</p>
              <div key={coin.id}>
                <input
                  type="number"
                  placeholder="Target Price"
                  value={alerts[coin.id]?.targetPrice || ''}
                  onChange={(e) => handleInputChange(coin.id, 'targetPrice', Number(e.target.value))}
                />
                <select value={alerts[coin.id]?.direction || 'above'} onChange={(e) => handleInputChange(coin.id, 'direction', e.target.value)}>
                  <option value="above">Above</option>
                  <option value="below">Below</option>
                </select>
                <button onClick={() => handleAddAlert(coin.id)}>Add Alert</button>
              </div>
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






// version 2

// import React, { useState, useEffect } from 'react';
// import axios from 'axios';
// interface CryptoData {
//   id: string;
//   name: string;
//   current_price: number;
// }

// const CryptoPriceMonitor: React.FC = () => {
//   const [cryptoData, setCryptoData] = useState<CryptoData[]>([]);
//   const [error, setError] = useState<string | null>(null);
//   const [targetPrice, setTargetPrice] = useState<number>(0);
//   const [direction, setDirection] = useState<'above' | 'below'>('above');
//   const [cryptoId, setCryptoId] = useState<string>('');
//   useEffect(() => {
//     const ws = new WebSocket('ws://localhost:8080');

//     ws.onmessage = (event) => {
//       const data = JSON.parse(event.data);
//       setCryptoData(data);
//     };

//     ws.onerror = (_event) => {
//       setError('WebSocket error');
//     };

//     return () => ws.close();
//   }, []);


//   const handleAddAlert = async (id: string) => {
//     try {
//       await axios.post('http://localhost:3000/api/alerts', {
//         userId: 'your_user_id', // Replace with the actual user ID
//         cryptoId: id,
//         targetPrice,
//         direction,
//       });
//       alert('Alert created successfully!');
//     } catch (error) {
//       console.error('Error creating alert:', error);
//       alert('Failed to create alert');
//     }
//   };

//   return (
//     <div>
//       <h1>Cryptocurrency Prices</h1>
//       {/* {console.log("print for every min")} */}
//       {cryptoData.length > 0 ? (
//         <ul>
//           {cryptoData.map((coin) => (
//             <li key={coin.id} style={{display:"flex", justifyContent:"space-between", gap:"1rem"}}>
//               <p>{coin.name} ({coin.id})</p>
//               <p> ${coin.current_price.toFixed(2)}</p> 
//               <button onClick={() => handleAddAlert(coin.id)}>Add Alert</button>
//             </li>
            
//           ))}
//         </ul>
//       ) : (
//         <p>Loading...</p>
//       )}
//     </div>
//   );
// };

// export default CryptoPriceMonitor;

























// / import React, { useState, useEffect } from 'react';
// import axios from 'axios';

// // Define the type for your data based on the backend response
// interface CryptoData {
//   id: string;
//   name: string;
//   current_price: number;
// }

// const CryptoPriceMonitor: React.FC = () => {
//   const [cryptoData, setCryptoData] = useState<CryptoData[] | null>(null);
//   const [error, setError] = useState<string | null>(null);

//   const fetchCryptoPrices = async () => {
//     try {
//       const response = await axios.get<CryptoData[]>('http://localhost:3000/api/crypto-prices'); // Adjust URL as needed
//       console.log(response);
//       setCryptoData(response.data);
//       setError(null); // Clear error if fetch is successful
//     } catch (err) {
//       setError('Error fetching crypto prices');
//     }
//   };

//   useEffect(() => {
//     fetchCryptoPrices(); // Fetch data on component mount

//     // Set up the interval to fetch data every minute
//     const intervalId = setInterval(() => {
//       fetchCryptoPrices();
//     }, 60000); // 60000 ms = 1 minute

//     // Cleanup interval on component unmount
//     return () => clearInterval(intervalId);
//   }, []); // Empty dependency array ensures this runs once on mount

//   return (
//     <div>
//       <h1>Cryptocurrency Prices</h1>
//       {error && <p>{error}</p>}
//       {cryptoData ? (
//         <ul>
//           {cryptoData.map((coin) => (
//             <li key={coin.id} style={{display:"flex", justifyContent:"space-between", gap:"1rem"}}>
//               <p>{coin.name} ({coin.id}) </p> ${coin.current_price.toFixed(2)}
//             </li>
//           ))}
//         </ul>
//       ) : (
//         <p>Loading...</p>
//       )}
//     </div>
//   );
// };

// export default CryptoPriceMonitor;


