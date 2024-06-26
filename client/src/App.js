import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import { useAuthContext } from './hooks/useAuthContext.js';
import { useState,useEffect } from 'react'

// pages & components
import Home from './pages/Home'
import Login from './pages/Login'
import Signup from './pages/Signup'
import Profile from './pages/Profile'
import Post from './pages/Post'
import Navbar from './components/Navbar'
import SearchBar from './components/SearchBar'
import WhoToFollow from './components/WhoToFollow.jsx';
import { useWindowContext } from './hooks/useWindowContext';

const PrincipalLayout = ({ children }) => {
 const { isWindowWidthOver1020 } = useWindowContext();

  return (
    <div className='mainlayout'>
      <div className='header'>
        <Navbar />
      </div>
      <div id='main' className='main'>
        <div className='dashboard'>
          {children}
        </div>
        {isWindowWidthOver1020 &&
          <div className='trending'>
            <SearchBar/>
            <WhoToFollow/>
          </div>
        }
      </div>
    </div>
  );
};

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
            path="/:username" 
            element={user ? <PrincipalLayout><Profile /></PrincipalLayout> : <Navigate to="/login" />}
          />
          <Route 
            path='/home/:newPostId?' 
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
            element={!user ? <Navigate to="/login" /> : <Navigate to={`/${user.username}`} />} 
          />
          <Route 
            path="/post/:postId/:username" 
            element={user ? <PrincipalLayout><Post /></PrincipalLayout> : <Navigate to="/login" />}
          />
        </Routes>
      </BrowserRouter>
    </div>
  );
}

export default App;