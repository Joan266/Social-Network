import { useState } from "react"
import { useLogin } from "../hooks/useLogin"
import { Link, useNavigate } from 'react-router-dom';

const Login = () => {
  const [emailOrUsername, setEmailOrUsername] = useState('')
  const [password, setPassword] = useState('')
  const {login, error, isLoading} = useLogin()
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault()

    await login(emailOrUsername, password).then(() => {
      navigate('/home');  
    });
  }

  return (
    <>
      <form className="login" onSubmit={handleSubmit}>
        <h3>Inicia sesión</h3>
        
        <label>Correo electrónico o nombre de usuario:</label>
        <input 
          type="text" 
          onChange={(e) => setEmailOrUsername(e.target.value)} 
          value={emailOrUsername} 
          autoComplete="email-username"
        />
        <label>Contraseña:</label>
        <input 
          type="password" 
          onChange={(e) => setPassword(e.target.value)} 
          autoComplete="current-password"
          value={password} 
        />

        <button disabled={isLoading}>Inicia sesión</button>
        {error && <div className="error">{error}</div>}
      </form>
      <div>
        <p>¿No tienes cuenta?<Link to="/auth/signup">Regístrate</Link></p>
      </div>
    </>
  )
}

export default Login