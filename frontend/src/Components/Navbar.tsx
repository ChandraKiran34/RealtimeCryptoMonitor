import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';

const Navbar: React.FC = () => {
  const [hasToken, setHasToken] = useState<boolean>(false);

  useEffect(() => {
    // Check if there is a token in localStorage
    const token = localStorage.getItem('token');
    if (token) {
      setHasToken(true);
    } else {
      setHasToken(false);
    }
  }, []); // Empty dependency array ensures this runs once on mount

  return (
    <>
      <div style={{ display: 'flex', justifyContent: 'space-between', gap: '1px' }}>
        {!hasToken ? (
          <>
            {/* Buttons to show when there is a token */}
            <Link 
              style={{ 
                marginLeft: '49rem', 
                borderRadius: '8px', 
                border: '1px solid transparent', 
                padding: '0.6rem 1.2rem', 
                backgroundColor: '#1a1a1a', 
                color: 'white', 
                transition: 'border-color 0.25s' 
              }} 
              to='/login'
            >
              Login
            </Link>
            <Link 
              style={{ 
                marginLeft: '0.8rem', 
                borderRadius: '8px', 
                padding: '0.6rem 1.2rem', 
                backgroundColor: '#1a1a1a', 
                color: 'white', 
                transition: 'border-color 0.25s' 
              }} 
              to='/register'
            >
              Not a user?
            </Link>
          </>
        ) : (
          <></>
        )}
      </div>
    </>
  );
};

export default Navbar;
