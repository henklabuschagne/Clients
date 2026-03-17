import { useAppStore } from './useAppStore';
import type { UserDto } from '../services/api';

export function useAuth() {
  const { currentUser, authToken, actions } = useAppStore('auth');

  const login = async (username: string, password: string) => {
    const result = await actions.login(username, password);
    if (result.success) return result.data;
    throw new Error(result.error.message);
  };

  const logout = () => {
    actions.logout();
  };

  const isAuthenticated = !!authToken;

  return {
    currentUser,
    isAuthenticated,
    login,
    logout,
  };
}
