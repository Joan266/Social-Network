import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import { useAuthContext } from './hooks/useAuthContext.js';

// pages & components
import Home from './pages/Home'
import Login from './pages/Login'
import Signup from './pages/Signup'
import Profile from './pages/Profile'
import Search from './pages/Search'
import Post from './pages/Post'
import Notifications from './pages/Notifications'
import Navbar from './components/Navbar'
import SearchBar from './components/SearchBar'
const PrincipalLayout = ({ children }) => (
  <div className='mainlayout'>
    <div className='header'>
      <Navbar />
    </div>
    <div className='main'>
      <div className='container'>
        <div className='dashboard'>{children}</div>
        <div className='trending'>
          <SearchBar/>
        </div>
      </div>
    </div>
  </div>
);

const AuthLayout = ({ children }) => (
  <div className='authlayout'>
    <div className='container'>{children}</div>
  </div>
);

function App() {
  const { user } = useAuthContext()

  return (
    <div className="App">
      <BrowserRouter>
        <Routes>
          <Route 
            path="/" 
            element={user ? <Navigate to="/home" /> : <Navigate to="/signup" />} 
          />
          <Route 
            path="/home" 
            element={!user ? <Navigate to="/login" /> :  <PrincipalLayout><Home /></PrincipalLayout>} 
          />
          <Route 
            path="/login" 
            element={user ?  <Navigate to="/home" />: <AuthLayout><Login /></AuthLayout>} 
          />
          <Route 
            path="/signup" 
            element={user ?  <Navigate to="/home" />: <AuthLayout><Signup /></AuthLayout>} 
          />
          <Route 
            path="/profile" 
            element={!user ? <Navigate to="/login" /> : <PrincipalLayout><Profile /></PrincipalLayout>} 
          />
          <Route 
            path="/search" 
            element={!user ? <Navigate to="/login" /> : <PrincipalLayout><Search /></PrincipalLayout>} 
          />
          <Route 
            path="/notifications" 
            element={!user ? <Navigate to="/login" /> : <PrincipalLayout><Notifications /></PrincipalLayout>} 
          />
          <Route 
            path="/post" 
            element={!user ? <Navigate to="/login" /> : <PrincipalLayout><Post /></PrincipalLayout>} 
          />
        </Routes>
      </BrowserRouter>
    </div>
  );
}

export default App;