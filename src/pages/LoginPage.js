//import React, { useState } from 'react';
//import axios from 'axios';
//
//function LoginPage() {
//  const [username, setUsername] = useState('');
//  const [password, setPassword] = useState('');
//  const [errorMessage, setErrorMessage] = useState('');
//
//  const handleLogin = async () => {
//    try {
//      const response = await axios.post('http://localhost:8080/v1/login', {
//        username,
//        password,
//      });
//      console.log(response.data);
//      // Handle successful login
//    } catch (error) {
//      setErrorMessage('Invalid credentials');
//    }
//  };
//
//  return (
//    <div>
//      <h2>Login</h2>
//      <input
//        type="text"
//        value={username}
//        onChange={(e) => setUsername(e.target.value)}
//        placeholder="Username"
//      />
//      <input
//        type="password"
//        value={password}
//        onChange={(e) => setPassword(e.target.value)}
//        placeholder="Password"
//      />
//      <button onClick={handleLogin}>Login</button>
//      {errorMessage && <p style={{ color: 'red' }}>{errorMessage}</p>}
//    </div>
//  );
//}
//
//export default LoginPage;
