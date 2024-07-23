import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import axios from '@/lib/axios'
import { AxiosResponse } from 'axios'
import { useRouter, useParams } from 'next/navigation'
import { useAuthStore } from './useAuthStore'

import { LoginUserData } from '@/types/schema/UserSchema'

interface MiddlewareProps {
  middleware?: string;
  redirectIfAuthenticated?: string;
}

export const useAuth = () => {
  const router = useRouter()
  const params = useParams()
  const queryClient = useQueryClient();
  const setIsAuthenticated = useAuthStore((state) => state.setIsAuthenticated)

 
  const { data: user, error } = useQuery({
    queryKey: ["user"],
    queryFn: async () =>{
      try {
        const response = await axios.get('/api/user');
        return response.data;
      } catch (error: any) {
        if (error.response?.status !== 409) {
          throw error;
        }
        router.push('/verify-email');
      }
    },
  });
      


  const csrf = () => axios.get('/sanctum/csrf-cookie')

  // //  // login mutation
   const loginMutation = useMutation({
    mutationFn: async (data: LoginUserData) => {
      await csrf();
      await axios.post("/login", data);
    },
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: ["user"] });
      setIsAuthenticated(true)
      router.push('/dashboard')
    },
  });

  // // login
  const login = async (data: LoginUserData) => {
    try {
      await loginMutation.mutateAsync(data);
    } catch (error: any) {
      console.error("Login failed");
      return {
        error: error.response?.data?.message || "An unexpected error occurred",
      };
    }
  };

 
  //  // logout mutation
  const logoutMutation = useMutation({
    mutationFn: async () => {
      await axios.post('/logout')
    },
    onSuccess: () => {
      queryClient.clear();
      setIsAuthenticated(false)
      router.push('/login')
    },
    onError: (error) => {
      console.error("Logout failed:", error);
    },
  });

  // // logout
  const logout = async () => {
      await logoutMutation.mutateAsync();
  };


  const forgotPassword = async (data: {
    email: string
  }): Promise<AxiosResponse> => {
    try {
      await csrf()
      return await axios.post('/forgot-password', data)
    } catch (error) {
      throw error
    }
  }

  const resetPassword = async (data: {
    email: string
    password: string
    password_confirmation: string
  }) => {
    try {
      await csrf()

      const response = await axios.post('/reset-password', {
        ...data,
        token: params.token,
      })

      router.push('/login?reset=' + btoa(response.data.status))
    } catch (error) {
      throw error
    }
  }

  const resendEmailVerification = async () => {
    try {
      return await axios.post('/email/verification-notification')
    } catch (error) {
      throw error
    }
  }

  

  // useEffect(() => {
  //   if (middleware === 'guest' && redirectIfAuthenticated && user) {
  //     router.push(redirectIfAuthenticated)
  //   }

  //   if (
  //     window.location.pathname === '/verify-email' &&
  //     user?.email_verified_at &&
  //     redirectIfAuthenticated
  //   ) {
  //     router.push(redirectIfAuthenticated)
  //   }
  //   if (middleware === 'auth' && error) logout()
  // }, [user, error, middleware, redirectIfAuthenticated])

  
  return {
    user,
    // register,
    login,
    forgotPassword,
    resetPassword,
    resendEmailVerification,
    logout,
  }
}
