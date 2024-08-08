import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import './App.css'
import CryptoPriceMonitor from './Components/CryptoMonitor'
import Navbar from './Components/Navbar'
import Login from './Components/Login';
import Register from './Components/register';

// function App() {

//   return (
//     <>
//     <Navbar/>
//       <CryptoPriceMonitor />
//     </>
//   )
// }

const App: React.FC = () => {
  return (
    <Router>
      <Navbar />
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/" element={<CryptoPriceMonitor />} />
        {/* Add other routes as needed */}
      </Routes>
    </Router>
  );
};


export default App
