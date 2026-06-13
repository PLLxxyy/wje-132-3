import { create } from 'zustand';
import type { CurrentUser } from '../types/roles';
import { UserRole } from '../types/enums';

interface AuthState {
  user: CurrentUser;
  setRole: (role: UserRole) => void;
}

export const useAuthStore = create<AuthState>((set) => ({
  user: { id: 1, name: '演示安全经理', role: UserRole.SafetyManager },
  setRole(role) {
    set((state) => ({ user: { ...state.user, role } }));
  },
}));
