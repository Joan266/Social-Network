import { createContext, useEffect, useState } from 'react';

export const WindowContext = createContext();

const initialState = {
  isWindowWidthOver1275: null,
  isWindowWidthOver1020: null,
  isWindowWidthOver800: null,
  isWindowWidthOver650: null,
  isWindowWidthOver600: null,
  isWindowWidthOver550: null,
  isWindowWidthOver400: null,
};

export const WindowContextProvider = ({ children }) => {
  const [state, setState] = useState(initialState);

  const handleResize = () => {
    const windowWidth = window.innerWidth;

    setState({
      isWindowWidthOver1275: windowWidth > 1275,
      isWindowWidthOver1020: windowWidth > 1020,
      isWindowWidthOver800: windowWidth > 800,
      isWindowWidthOver650: windowWidth > 650,
      isWindowWidthOver600: windowWidth > 600,
      isWindowWidthOver550: windowWidth > 550,
      isWindowWidthOver400: windowWidth > 400,
    });
  };

  useEffect(() => {
    handleResize();
    window.addEventListener('resize', handleResize);
    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, []);

  return (
    <WindowContext.Provider value={{ ...state }}>
      {children}
    </WindowContext.Provider>
  );
};
