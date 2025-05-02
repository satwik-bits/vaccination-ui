// import React, { useState } from 'react';
// import { useHistory } from 'react-router-dom';
// import api from '../api/axios';
// import { useAuth } from '../auth/AuthContext';
//
// const Login = () => {
//   const [username, setUsername] = useState('');
//   const [password, setPassword] = useState('');
//   const [error, setError] = useState('');
//   const { login } = useAuth();
//   const history = useHistory();
//
//   const handleSubmit = async (e) => {
//     e.preventDefault();
//     try {
//       const response = await api.post('/login', { username, password });
//       login(response.data.token);  // Store token in context and localStorage
//       history.push('/dashboard');   // Redirect to dashboard
//     } catch (err) {
//       setError('Invalid credentials');
//     }
//   };
//
//   return (
//     <div className="login-container">
//       <h2>Login</h2>
//       {error && <p className="error">{error}</p>}
//       <form onSubmit={handleSubmit}>
//         <div>
//           <label>Username:</label>
//           <input
//             type="text"
//             value={username}
//             onChange={(e) => setUsername(e.target.value)}
//             required
//           />
//         </div>
//         <div>
//           <label>Password:</label>
//           <input
//             type="password"
//             value={password}
//             onChange={(e) => setPassword(e.target.value)}
//             required
//           />
//         </div>
//         <button type="submit">Login</button>
//       </form>
//     </div>
//   );
// };
//
// export default Login;
