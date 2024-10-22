import { BrowserRouter, Routes, Route, Navigate, Outlet } from 'react-router-dom';
import { useAuthContext } from './hooks/useAuthContext.js';
import { useWindowContext } from './hooks/useWindowContext';
import Home from './pages/Home';
import Login from './pages/Login';
import Signup from './pages/Signup';
import Profile from './pages/Profile';
import Post from './pages/Post';
import Navbar from './components/Navbar';
import SearchBar from './components/SearchBar';
import WhoToFollow from './components/WhoToFollow.jsx';
import { LoaderComponent } from './components/Loader.jsx'; // Importing loader component

const PrincipalLayout = () => {
  const { isWindowWidthOver1020 } = useWindowContext();
  const { user, loading } = useAuthContext();

  if (loading) {
    return <LoaderComponent />;
  }

  if (!user) {
    return <Navigate to="/auth/signup" replace />;
  }
  return (
    <div className="mainlayout">
      <div className="header">
        <Navbar />
      </div>
      <div id="main" className="main">
        <div className="dashboard">
          <Outlet />
        </div>
        {isWindowWidthOver1020 && (
          <div className="trending">
            <SearchBar />
            <WhoToFollow />
          </div>
        )}
      </div>
    </div>
  );
};

const AuthLayout = () => {
  const { user, loading } = useAuthContext();

  if (loading) {
    return <LoaderComponent />;
  }

  if (user) {
    return <Navigate to="/" replace />;
  }

  return (
    <div className="authlayout">
      <div className="container">
        <Outlet />
      </div>
    </div>);
};

function App() {
  const { user, loading } = useAuthContext();

  if (loading) {
    return <LoaderComponent />;
  }

  return (
    <div className="App">
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<PrincipalLayout />}>
            <Route index element={<Home />} />
            <Route path="user/:username" element={<Profile />} />
            <Route path="home/:newPostId?" element={<Home />} />
            <Route
              path="profile"
              element={user ? <Navigate to={`/user/${user.username}`} /> : <Navigate to="/auth/login" replace />}
            />
            <Route path="post/:username/:postId" element={<Post />} />
          </Route>

          <Route path="/auth" element={<AuthLayout />}>
            <Route index element={<Signup />} />
            <Route path="login" element={<Login />} />
            <Route path="signup" element={<Signup />} />
          </Route>
        </Routes>
      </BrowserRouter>
    </div>
  );
}

export default App;
