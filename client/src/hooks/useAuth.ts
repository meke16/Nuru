import { useQuery } from "@tanstack/react-query";

export function useAuth() {
  const { data: admin, isLoading } = useQuery({
    queryKey: ["/api/auth/admin"],
    retry: false,
  });

  return {
    admin,
    user: admin, // For compatibility with existing code
    isLoading,
    isAuthenticated: !!admin,
  };
}
