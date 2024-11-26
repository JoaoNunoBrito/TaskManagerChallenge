"use client"

import { User } from '@/types/User';
import { useRouter } from 'next/navigation';
import React, { createContext, useState, useContext, ReactNode, useEffect } from 'react';
import CryptoJS from 'crypto-js';

const SECRET_KEY = 'MY-SECRET-KEY-THAT-SHOULD-NOT-BE-HERE';

interface AuthContextType {
  user: User | null;
  isLoading: boolean;
  login: (user: User) => void;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const router = useRouter();
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const storedUser = localStorage.getItem('user');
    if (storedUser) {
      try {
        const bytes = CryptoJS.AES.decrypt(storedUser, SECRET_KEY);
        const decryptedData = bytes.toString(CryptoJS.enc.Utf8);

        if (decryptedData) {
          setUser(JSON.parse(decryptedData));
        }
      } catch (error) {
        console.error('Failed to decrypt user data:', error);
      }
    }
    setIsLoading(false);
  }, []);

  const login = (user: User) => {
    setUser(user);

    const encryptedUser = CryptoJS.AES.encrypt(JSON.stringify(user), SECRET_KEY).toString();
    localStorage.setItem('user', encryptedUser);

    router.push("/");
  };

  const logout = () => {
    setUser(null);
    
    localStorage.removeItem('user');

    router.push("/");
  };

  return (
    <AuthContext.Provider value={{ user, isLoading, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuthContext = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuthContext must be used within an AuthProvider");
  }
  return context;
};
