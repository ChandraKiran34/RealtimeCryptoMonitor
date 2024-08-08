import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const Login: React.FC = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate(); // Assuming you're using react-router-dom for navigation

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const response = await axios.post(
        "http://localhost:3000/api/user/login",
        { email, password }
      ); // Adjust the URL as needed
      const { token } = response.data;

      // Save the token in local storage or any secure storage
      localStorage.setItem("token", token);

      // Redirect to a protected route, e.g., dashboard
      navigate("/");

      // Clear the error if login is successful
      setError(null);
    } catch (error) {
      setError("Invalid email or password");
    }
  };

  return (
    <div>
      <h2>Login</h2>
      <form onSubmit={handleLogin} style={{display:"flex", flexDirection:"column"}}>
        <div>
          <label style={{marginRight:"1.2rem",}}>Email:</label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            // style={{padding:"0.5rem"}}
          />
        </div>
        <div > 
          <label style={{marginRight:"1.2rem",}}>Password:</label>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            // style={{padding:"0.5rem"}}
          />
        </div>
        {error && <p style={{ color: "red" }}>{error}</p>}
        <button type="submit" style={{width:"10rem", marginLeft:"28rem" , marginTop:"1.2rem"}}>Login</button>
      </form>
    </div>
  );
};

export default Login;
