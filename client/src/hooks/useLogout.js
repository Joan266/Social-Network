import { useAuthContext } from './useAuthContext';
import { useNavigate } from 'react-router-dom';  
export const useLogout = () => {
  const { dispatch } = useAuthContext();
  const navigate = useNavigate();  

  const logout = () => {
    dispatch({ type: 'LOGOUT' });

    navigate('/auth');
  };

  return { logout };
};
