import { createContext, useReducer, useEffect } from 'react';

export const AuthContext = createContext();

// Define initial state outside the reducer function
const initialState = {
  user: null,
};

export const authReducer = (state, action) => {
  switch (action.type) {
    case 'LOGIN':
      // Stringify and store user in local storage
      localStorage.setItem('user', JSON.stringify(action.payload));
      return { user: action.payload };
    case 'LOGOUT':
      // Remove user from local storage
      localStorage.removeItem('user');
      return { user: null };
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
    }
  }, []);

  console.log('AuthContext state:', state);

  return (
    <AuthContext.Provider value={{ ...state, dispatch }}>
      { children }
    </AuthContext.Provider>
  );
};
