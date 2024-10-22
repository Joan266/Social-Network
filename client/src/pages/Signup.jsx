import { useState, useEffect } from "react";
import { useSignup } from "../hooks/useSignup";
import { Link, useNavigate } from 'react-router-dom';
import { useAuthContext } from '../hooks/useAuthContext';

const generateRandomCredentials = () => {
  const randomString = Math.random().toString(36).substring(2, 8);
  return {
    username: `user_${randomString}`,
    email: `${randomString}@gmail.com`,
    password: `Pass${randomString}@!`
  };
};

const Signup = () => {
  const { user } = useAuthContext();
  const navigate = useNavigate();
  const { signup, error, isLoading } = useSignup();

  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  useEffect(() => {
    const isFirstVisit = !localStorage.getItem('isSignedUp'); 

    if (isFirstVisit && !user) {
      const { username, email, password } = generateRandomCredentials();  
      setUsername(username);
      setEmail(email);
      setPassword(password);

      signup({ email, password, username }).then(() => {
        localStorage.setItem('isSignedUp', 'true');  
        navigate('/home');  
      });
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    await signup({ email, password, username }).then(() => {
      navigate('/home');  
    });
  };


  return (
    <>
      <form className="signup" onSubmit={handleSubmit}>
        <h3>Crea una cuenta</h3>
        <label>Nombre de usuario:</label>
        <input 
          type="text" 
          onChange={(e) => setUsername(e.target.value.trim())} 
          value={username} 
          autoComplete="username"
        />
        <label>Dirección de correo electrónico:</label>
        <input 
          type="email" 
          onChange={(e) => setEmail(e.target.value.trim())} 
          value={email} 
          autoComplete="email"
        />
        <label>Contraseña:</label>
        <input 
          type="password" 
          onChange={(e) => setPassword(e.target.value.trim())} 
          autoComplete="current-password"
          value={password} 
        />

        <button disabled={isLoading}>Regístrate</button>
        {error && <div className="error">{error}</div>}
      </form>
      <div>
        <p>¿Ya tienes cuenta? <Link to="/auth/login">Inicia sesión</Link></p>
      </div>
    </>
  );
};

export default Signup;
