
import React, { createContext, useContext, useState, useEffect } from 'react';
import { useToast } from '@/components/ui/use-toast';
import { User } from '@/types';

interface AuthContextType {
  user: User | null;
  loading: boolean;
  login: (email: string, password: string) => Promise<void>;
  register: (name: string, email: string, password: string) => Promise<void>;
  logout: () => void;
  updateProfile: (userData: Partial<User>) => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    // Check for user in localStorage on initial load
    const storedUser = localStorage.getItem('user');
    if (storedUser) {
      try {
        setUser(JSON.parse(storedUser));
      } catch (error) {
        console.error('Error parsing user data from localStorage', error);
        localStorage.removeItem('user');
      }
    }
    setLoading(false);
  }, []);

  const login = async (email: string, password: string) => {
    try {
      setLoading(true);
      // In a real app, this would be an API call
      // Mocking a successful login for demo
      const userData: User = {
        id: '1',
        name: 'John Doe',
        email: email,
        isAdmin: email.includes('admin'),
        token: 'mock-jwt-token'
      };
      
      setUser(userData);
      localStorage.setItem('user', JSON.stringify(userData));
      toast({
        title: "Login successful",
        description: `Welcome back, ${userData.name}!`,
        duration: 3000,
      });
    } catch (error) {
      console.error('Login failed', error);
      toast({
        title: "Login failed",
        description: "Invalid email or password",
        variant: "destructive",
        duration: 3000,
      });
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const register = async (name: string, email: string, password: string) => {
    try {
      setLoading(true);
      // In a real app, this would be an API call
      // Mocking a successful registration for demo
      const userData: User = {
        id: '1',
        name,
        email,
        isAdmin: false,
        token: 'mock-jwt-token'
      };
      
      setUser(userData);
      localStorage.setItem('user', JSON.stringify(userData));
      toast({
        title: "Registration successful",
        description: "Your account has been created",
        duration: 3000,
      });
    } catch (error) {
      console.error('Registration failed', error);
      toast({
        title: "Registration failed",
        description: "Could not create your account",
        variant: "destructive",
        duration: 3000,
      });
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('user');
    toast({
      title: "Logged out",
      description: "You have been logged out successfully",
      duration: 3000,
    });
  };

  const updateProfile = async (userData: Partial<User>) => {
    try {
      setLoading(true);
      // In a real app, this would be an API call
      // Mocking a successful profile update for demo
      if (user) {
        const updatedUser = { ...user, ...userData };
        setUser(updatedUser);
        localStorage.setItem('user', JSON.stringify(updatedUser));
        toast({
          title: "Profile updated",
          description: "Your profile has been updated successfully",
          duration: 3000,
        });
      }
    } catch (error) {
      console.error('Profile update failed', error);
      toast({
        title: "Update failed",
        description: "Could not update your profile",
        variant: "destructive",
        duration: 3000,
      });
      throw error;
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthContext.Provider value={{ user, loading, login, register, logout, updateProfile }}>
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
