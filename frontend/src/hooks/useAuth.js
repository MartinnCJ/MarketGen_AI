/**
 * useAuth — convenience hook for accessing auth state.
 *
 * Usage:
 *   const { user, isAuthenticated, isLoading, logout } = useAuth()
 */
import { useKeycloak } from '@react-keycloak/web'
import useAuthStore from '@/store/authStore'

export function useAuth() {
  const { keycloak } = useKeycloak()
  const { user, isAuthenticated, isLoading } = useAuthStore()

  return {
    user,
    isAuthenticated,
    isLoading,
    token:   keycloak.token,
    logout:  () => keycloak.logout({ redirectUri: window.location.origin }),
    login:   () => keycloak.login(),
    hasRole: (role) => user?.roles?.includes(role) ?? false,
  }
}
