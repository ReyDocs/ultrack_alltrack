import { createContext, useContext, useState } from 'react';

const AuthContext = createContext(null);

export function useAuth() {
  return useContext(AuthContext);
}

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(false);

  const login = async ({ email, password } = {}) => {
    setLoading(true);
    try {
      // TODO: const data = await authApi.login({ email, password });
      // setUser(data.user);
      setUser({
        name: 'User',
        avatarUrl: null,
        email: email || '',
      });
      return true;
    } finally {
      setLoading(false);
    }
  };

  const signup = async ({ email, password } = {}) => {
    setLoading(true);
    try {
      // TODO: const data = await authApi.signup({ email, password });
      // setUser(data.user);
      setUser({
        name: 'User',
        avatarUrl: null,
        email: email || '',
      });
      return true;
    } finally {
      setLoading(false);
    }
  };

  const logout = async () => {
    setUser(null);
    // TODO: await authApi.logout();
  };

  const updateProfile = async (updates) => {
    setUser((prevUser) => ({
      ...prevUser,
      ...updates,
    }));
    // TODO: await authApi.updateProfile(updates);
  };

  return (
    <AuthContext.Provider value={{ user, loading, login, signup, logout, updateProfile }}>
      {children}
    </AuthContext.Provider>
  );
}
