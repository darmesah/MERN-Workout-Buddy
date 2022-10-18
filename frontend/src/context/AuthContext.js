import { createContext, useEffect, useReducer } from 'react';

export const AuthContext = createContext({
  user: {},
});

export const authReducer = (state, action) => {
  switch (action.type) {
    case 'LOGIN':
      return { user: action.payload };

    case 'LOGOUT':
      return { user: null };

    default:
      return state;
  }
};

export const AuthContextProvider = ({ children }) => {
  const [user, dispatch] = useReducer(authReducer, { user: null });

  useEffect(() => {
    const user = JSON.parse(localStorage.getItem('user'));

    if (user) {
      dispatch({ type: 'LOGIN', payload: user });
    }
  }, []);

  console.log('AuthContext state', user);

  return (
    <AuthContext.Provider value={{ ...user, dispatch }}>
      {children}
    </AuthContext.Provider>
  );
};
