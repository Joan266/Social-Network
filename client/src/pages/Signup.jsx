import { useState } from "react"
import { useSignup } from "../hooks/useSignup"
import { Link } from 'react-router-dom'

const Signup = () => {
  const [username, setUsername] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const {signup, error, isLoading} = useSignup()

  const handleSubmit = async (e) => {
    e.preventDefault()

    await signup({email, password, username})
  }

  return (
    <>
    <form className="signup" onSubmit={handleSubmit}>
      <h3>Crea una cuenta</h3>
      <label>Nombre de usuario:</label>
      <input 
        type="text" 
        onChange={(e) => setUsername(e.target.value.trim())} 
        value={username} 
      />
      <label>Dirección de correo electrónico:</label>
      <input 
        type="email" 
        onChange={(e) => setEmail(e.target.value.trim())} 
        value={email} 
      />
      <label>Contraseña:</label>
      <input 
        type="password" 
        onChange={(e) => setPassword(e.target.value.trim())} 
        value={password} 
      />

      <button disabled={isLoading}>Regístrate</button>
      {error && <div className="error">{error}</div>}
    </form>
    <div>
      <p>¿Ya tienes cuenta? <Link to="/login">Inicia sesión</Link></p>
    </div>
    </>
  )
}

export default Signup