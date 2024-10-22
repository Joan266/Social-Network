import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import { useAuthContext } from './hooks/useAuthContext.js';
import { useWindowContext } from './hooks/useWindowContext';

// pages & components
import Home from './pages/Home'
import Login from './pages/Login'
import Signup from './pages/Signup'
import Profile from './pages/Profile'
import Post from './pages/Post'
import Navbar from './components/Navbar'
import SearchBar from './components/SearchBar'
import WhoToFollow from './components/WhoToFollow.jsx';

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
  const { user } = useAuthContext();

  return (
    <div className="App">
      <BrowserRouter>
        {user ? (
          <PrincipalLayout>
            <Routes>
              <Route path="/" element={<Navigate to="/home" />} />
              <Route path="/:username" element={<Profile />} />
              <Route path="/home/:newPostId?" element={<Home />} />
              <Route
                path="/profile"
                element={<Navigate to={`/${user.username}`} />}
              />
              <Route path="/:username/:postId" element={<Post />} />
            </Routes>
          </PrincipalLayout>
        ) : (
          <AuthLayout>
            <Routes>
              <Route path="/" element={<Navigate to="/signup" />} />
              <Route path="/login" element={<Login />} />
              <Route path="/signup" element={<Signup />} />
            </Routes>
          </AuthLayout>
        )}
      </BrowserRouter>
    </div>
  );
}
export default App;
