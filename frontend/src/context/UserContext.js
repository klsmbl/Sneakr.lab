import React, { createContext, useState, useContext, useEffect } from 'react';

const UserContext = createContext();

export const UserProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(localStorage.getItem('token'));
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const savedUser = localStorage.getItem('user');
    if (savedUser && token) {
      setUser(JSON.parse(savedUser));
    }
    setLoading(false);
  }, [token]);

  const normalizeUser = (rawUser) => {
    if (!rawUser) return rawUser;

    const name = rawUser.name || rawUser.full_name || rawUser.fullName || '';
    return {
      ...rawUser,
      name,
      full_name: rawUser.full_name || name,
      fullName: rawUser.fullName || name,
    };
  };

  const signIn = (userData, userToken) => {
    const normalizedUser = normalizeUser(userData);
    setUser(normalizedUser);
    setToken(userToken);
    localStorage.setItem('user', JSON.stringify(normalizedUser));
    localStorage.setItem('token', userToken);
  };

  const signOut = () => {
    setUser(null);
    setToken(null);
    localStorage.removeItem('user');
    localStorage.removeItem('token');
  };

  const updateProfile = (updates) => {
    setUser((prevUser) => {
      const nextUser = normalizeUser({ ...(prevUser || {}), ...updates });
      localStorage.setItem('user', JSON.stringify(nextUser));
      return nextUser;
    });
  };

  const isAdmin = user?.role === 'admin';

  return (
    <UserContext.Provider value={{ user, token, loading, signIn, signOut, updateProfile, isAdmin }}>
      {children}
    </UserContext.Provider>
  );
};

export const useUser = () => useContext(UserContext);
