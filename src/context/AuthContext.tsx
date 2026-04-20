import React, { createContext, useContext, useState, useCallback, useEffect } from 'react';

// Типы пользователей
export type UserRole = 'admin' | 'user';

export interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  avatar: string;
}

interface AuthContextType {
  user: User | null;
  login: (email: string, password: string) => Promise<{ success: boolean; error?: string }>;
  register: (name: string, email: string, password: string) => Promise<{ success: boolean; error?: string }>;
  logout: () => void;
  isAuthenticated: boolean;
  // Admin User Management
  allUsers: User[];
  deleteUser: (id: string) => boolean;
  updateUserRole: (id: string, role: UserRole) => boolean;
}

// Встроенные системные аккаунты (для демо)
const SYSTEM_USERS: Array<User & { password: string }> = [
  {
    id: 'sys-1',
    name: 'Администратор',
    email: 'admin@company.com',
    role: 'admin',
    avatar: 'A',
    password: 'admin123',
  },
  {
    id: 'sys-2',
    name: 'Одилбек Юсупов',
    email: 'user@company.com',
    role: 'user',
    avatar: 'О',
    password: 'user123',
  },
];

// Хранилище зарегистрированных пользователей (живёт пока открыт браузер)
const registeredUsers: Array<User & { password: string }> = [];

const AuthContext = createContext<AuthContextType | null>(null);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  
  // Мы переносим всех пользователей в State, чтобы изменения отображались реактивно в UI
  const [allUsersState, setAllUsersState] = useState<Array<User & { password: string }>>([
    ...SYSTEM_USERS,
    ...registeredUsers
  ]);

  // Синхронизация `registeredUsers` (устаревшее, но оставим для совместимости)
  useEffect(() => {
    // В реальном приложении это сохранялось бы на сервер или в localStorage.
  }, [allUsersState]);

  // ── Вход ──────────────────────────────────────────────────────────────────
  const login = useCallback(async (email: string, password: string) => {
    await new Promise(resolve => setTimeout(resolve, 700));

    const found = allUsersState.find(
      u => u.email.toLowerCase() === email.toLowerCase() && u.password === password
    );

    if (found) {
      const { password: _pwd, ...userWithoutPassword } = found;
      setUser(userWithoutPassword);
      return { success: true };
    }

    return { success: false, error: 'Неверный email или пароль' };
  }, [allUsersState]);

  // ── Регистрация ───────────────────────────────────────────────────────────
  const register = useCallback(async (name: string, email: string, password: string) => {
    await new Promise(resolve => setTimeout(resolve, 700));

    // Проверяем, не занят ли email
    const exists = allUsersState.find(u => u.email.toLowerCase() === email.toLowerCase());
    if (exists) {
      return { success: false, error: 'Пользователь с таким email уже существует' };
    }

    if (password.length < 6) {
      return { success: false, error: 'Пароль должен содержать минимум 6 символов' };
    }

    // Создаём нового пользователя с ролью "user"
    const newUser: User & { password: string } = {
      id: `user-${Date.now()}`,
      name: name.trim(),
      email: email.toLowerCase().trim(),
      role: 'user',
      avatar: name.trim()[0]?.toUpperCase() || 'U',
      password,
    };

    setAllUsersState(prev => [...prev, newUser]);
    registeredUsers.push(newUser); // Сохраняем в память для совместимости

    // Автоматически входим после регистрации
    const { password: _pwd, ...userWithoutPassword } = newUser;
    setUser(userWithoutPassword);

    return { success: true };
  }, []);

  // ── Выход ─────────────────────────────────────────────────────────────────
  const logout = useCallback(() => {
    setUser(null);
  }, []);

  // ── Admin: Управление Пользователями ───────────────────────────────────────
  const deleteUser = useCallback((id: string) => {
    if (id === 'sys-1') return false; // Нельзя удалить главного админа
    
    setAllUsersState(prev => prev.filter(u => u.id !== id));
    
    // Удаляем из registeredUsers тоже, чтобы при релодетест он исчезал
    const index = registeredUsers.findIndex(u => u.id === id);
    if (index !== -1) registeredUsers.splice(index, 1);
    
    return true;
  }, []);

  const updateUserRole = useCallback((id: string, role: UserRole) => {
    if (id === 'sys-1') return false; // Роль главного админа нельзя поменять
    
    setAllUsersState(prev => prev.map(u => u.id === id ? { ...u, role } : u));
    
    // Обновляем и registeredUsers
    const userToUpdate = registeredUsers.find(u => u.id === id);
    if (userToUpdate) {
      userToUpdate.role = role;
    }
    
    return true;
  }, []);

  // Возвращаем всех пользователей без паролей
  const allUsersWithoutPasswords = allUsersState.map(({ password, ...u }) => u);

  return (
    <AuthContext.Provider value={{ 
      user, 
      login, 
      register, 
      logout, 
      isAuthenticated: !!user,
      allUsers: allUsersWithoutPasswords,
      deleteUser,
      updateUserRole
    }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within AuthProvider');
  return ctx;
};
