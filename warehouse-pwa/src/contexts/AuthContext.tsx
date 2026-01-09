import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { User, UserRole } from '../types';
import { authApi, usersApi } from '../services/api';

interface AuthContextType {
  user: User | null;
  isLoading: boolean;
  isAuthenticated: boolean;
  login: (email: string, password: string) => Promise<boolean>;
  logout: () => Promise<void>;
  updateProfile: (updates: Partial<User>) => Promise<void>;
  hasRole: (roles: UserRole | UserRole[]) => boolean;
  switchUser: (userId: string) => Promise<void>; // For demo purposes
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    loadUser();
  }, []);

  async function loadUser() {
    try {
      const currentUser = await authApi.getCurrentUser();
      setUser(currentUser);
    } catch {
      setUser(null);
    } finally {
      setIsLoading(false);
    }
  }

  async function login(email: string, password: string): Promise<boolean> {
    setIsLoading(true);
    try {
      const loggedInUser = await authApi.login(email, password);
      if (loggedInUser) {
        setUser(loggedInUser);
        return true;
      }
      return false;
    } finally {
      setIsLoading(false);
    }
  }

  async function logout(): Promise<void> {
    await authApi.logout();
    setUser(null);
  }

  async function updateProfile(updates: Partial<User>): Promise<void> {
    if (!user) return;
    const updatedUser = await usersApi.update(user.id, updates);
    setUser(updatedUser);
  }

  function hasRole(roles: UserRole | UserRole[]): boolean {
    if (!user) return false;
    const roleArray = Array.isArray(roles) ? roles : [roles];

    // WarehouseAdmin has access to all roles
    if (user.role === 'WarehouseAdmin') return true;

    // WarehouseStaff has access to TeamMember and WarehouseStaff roles
    if (user.role === 'WarehouseStaff' &&
        (roleArray.includes('TeamMember') || roleArray.includes('WarehouseStaff'))) {
      return true;
    }

    return roleArray.includes(user.role);
  }

  // For demo purposes - allows switching between users
  async function switchUser(userId: string): Promise<void> {
    const newUser = await usersApi.getById(userId);
    if (newUser) {
      setUser(newUser);
    }
  }

  return (
    <AuthContext.Provider
      value={{
        user,
        isLoading,
        isAuthenticated: !!user,
        login,
        logout,
        updateProfile,
        hasRole,
        switchUser,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
