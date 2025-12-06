import { useAuthStore } from '../store/auth.store';
import { useRouter } from 'next/navigation';

export const useAuth = () => {
  const router = useRouter();
  const authStore = useAuthStore();

  const requireAuth = () => {
    if (!authStore.isAuthenticated) {
      router.push('/login');
      return false;
    }
    return true;
  };

  return {
    ...authStore,
    requireAuth,
  };
};