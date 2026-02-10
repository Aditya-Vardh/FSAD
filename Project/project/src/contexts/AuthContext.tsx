import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import api from '../utils/api';

interface User {
  id: string;
  name: string;
  email: string;
}

interface AuthContextType {
  user: User | null;
  login: (email: string, password: string) => Promise<void>;
  register: (name: string, email: string, password: string) => Promise<void>;
  logout: () => void;
  loading: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const storedUser = localStorage.getItem('user');
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
    setLoading(false);
  }, []);

  const login = async (email: string, password: string) => {
    try {
      const response = await api.post('/auth/login', { email, password });
      const { token, user } = response.data;

      if (!token || !user) {
        throw new Error('Invalid response from server');
      }

      // Ensure user has id field (convert _id if needed)
      const userData = {
        id: user.id || user._id || user._id?.toString(),
        name: user.name,
        email: user.email
      };

      localStorage.setItem('token', token);
      localStorage.setItem('user', JSON.stringify(userData));
      setUser(userData);
    } catch (error: any) {
      console.error('Login error:', error);

      // Network error - backend not running
      if (!error.response) {
        if (error.code === 'ECONNABORTED' || error.message.includes('timeout')) {
          throw new Error('Connection timeout. Please ensure the backend server is running on port 5000 and MongoDB is connected.');
        }
        if (error.code === 'ERR_NETWORK' || error.message.includes('Network Error')) {
          throw new Error('Cannot connect to server. Please ensure the backend is running on port 5000.');
        }
        throw new Error('Network error. Please check your connection and ensure the backend server is running.');
      }

      // Database not connected
      if (error.response?.status === 503) {
        throw new Error(error.response.data.message || 'Database service unavailable. Please check MongoDB.');
      }

      // Validation errors
      if (error.response?.data?.errors) {
        const errorMessages = error.response.data.errors.map((e: any) => e.msg || e.message).join(', ');
        throw new Error(errorMessages || error.response.data.message || 'Login failed');
      }

      // Server errors
      if (error.response?.status >= 500) {
        throw new Error(error.response?.data?.error || error.response?.data?.message || 'Server error. Please try again later.');
      }

      throw new Error(error.response?.data?.message || error.message || 'Login failed. Please check your credentials and try again.');
    }
  };

  const register = async (name: string, email: string, password: string) => {
    try {
      const response = await api.post('/auth/register', { name, email, password });
      const { token, user } = response.data;

      if (!token || !user) {
        throw new Error('Invalid response from server');
      }

      // Ensure user has id field (convert _id if needed)
      const userData = {
        id: user.id || user._id || user._id?.toString(),
        name: user.name,
        email: user.email
      };

      localStorage.setItem('token', token);
      localStorage.setItem('user', JSON.stringify(userData));
      setUser(userData);
    } catch (error: any) {
      console.error('Register error:', error);

      // Network error - backend not running
      if (!error.response) {
        if (error.code === 'ECONNABORTED' || error.message.includes('timeout')) {
          throw new Error('Connection timeout. Please ensure the backend server is running on port 5000 and MongoDB is connected.');
        }
        if (error.code === 'ERR_NETWORK' || error.message.includes('Network Error')) {
          throw new Error('Cannot connect to server. Please ensure the backend is running on port 5000.');
        }
        throw new Error('Network error. Please check your connection and ensure the backend server is running.');
      }

      // Database not connected
      if (error.response?.status === 503) {
        throw new Error(error.response.data.message || 'Database service unavailable. Please check MongoDB.');
      }

      // Validation errors
      if (error.response?.data?.errors) {
        const errorMessages = error.response.data.errors.map((e: any) => e.msg || e.message).join(', ');
        throw new Error(errorMessages || error.response.data.message || 'Registration failed');
      }

      // Server errors
      if (error.response?.status >= 500) {
        throw new Error(error.response?.data?.error || error.response?.data?.message || 'Server error. Please try again later.');
      }

      throw new Error(error.response?.data?.message || error.message || 'Registration failed. Please try again.');
    }
  };

  const logout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, login, register, logout, loading }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
