import { createContext, useReducer, useEffect } from 'react';
export const AuthContext = createContext();

const initialState = {
  user: null,
  loading: true,
};

export const authReducer = (state, action) => {
  switch (action.type) {
    case 'LOGIN':
      // Stringify and store user in local storage
      localStorage.setItem('user', JSON.stringify(action.payload));
      return { user: action.payload, loading: false };
    case 'LOADING':
      return { ...state, loading: action.payload };
    case 'UPDATE_PROFILE_PIC':
      // Update profile pic in user object and store in local storage
      localStorage.setItem('user', JSON.stringify({ ...state.user, profilePicBase64: action.payload }));
      return { ...state, user: { ...state.user, profilePicBase64: action.payload } };
    case 'LOGOUT':
      // Remove user from local storage
      localStorage.removeItem('user');
      return { ...state, user: null };
    default:
      return state;
  }
};

export const AuthContextProvider = ({ children }) => {
  const [state, dispatch] = useReducer(authReducer, initialState);
  useEffect(() => {
    const storedUser = localStorage.getItem('user');
    if (storedUser) {
      const user = JSON.parse(storedUser);
      dispatch({ type: 'LOGIN', payload: user });
    } else {
      dispatch({ type: 'LOADING', payload: false });
    }
  }, []);


  return (
    <AuthContext.Provider value={{ ...state, dispatch }}>
      {children}
    </AuthContext.Provider>
  );
};
