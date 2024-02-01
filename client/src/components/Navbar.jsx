import { Link } from 'react-router-dom'
import { useAuthContext } from '../hooks/useAuthContext.js'

const Navbar = () => {
  const { user } = useAuthContext()

  return (
    <header>
      <div className="container">
        <Link to="/">
          <h1>Social media</h1>
        </Link>
        <nav>
          {user && (
            <div>
              <span>{user.email}</span>
            </div>
          )}
          {!user && (
            <div>
              <Link to="/signup">Signup</Link>
            </div>
          )}
        </nav>
      </div>
    </header>
  )
}

export default Navbar