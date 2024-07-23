import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import axios from '@/lib/axios'
import { AxiosResponse } from 'axios'
import { useRouter, useParams } from 'next/navigation'
import { useEffect } from 'react'

import { ForgotPasswordData, LoginUserData, RegisterUserData, ResetPasswordData } from '@/types/schema/UserSchema'

interface MiddlewareProps {
  middleware?: string;
  redirectIfAuthenticated?: string;
  redirectIfNotAuthenticated?: string;
}

export const useAuth = ({middleware, redirectIfAuthenticated, redirectIfNotAuthenticated} : MiddlewareProps) => {
  const router = useRouter()
  const params = useParams()
  const queryClient = useQueryClient();

 
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

  // login mutation
   const loginMutation = useMutation({
    mutationFn: async (data: LoginUserData) => {
      await csrf();
      await axios.post("/login", data);
    },
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: ["user"] });
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

  //login google
  const loginGoogle = async () => { 
    try {
      window.location.href = `${process.env.NEXT_PUBLIC_BACKEND_URL}/auth/redirect`;
    } catch (error: any) {
      console.error("Login failed");
    }
  }

  // register mutation
  const registerMutation = useMutation({
    mutationFn: async (data: RegisterUserData) => {
      await csrf();
      await axios.post("/register", data);
    },
    onSuccess: () => {
      router.push('/verify-email')
    }
  });

  // register
  const register = async (data: RegisterUserData) => {
    try {
      await registerMutation.mutateAsync(data);
    } catch (error: any) {
      console.error("register failed");
      return {
        error: error.response?.data?.message || "An unexpected error occurred",
      };
    }
  };

 
  // logout mutation
  const logoutMutation = useMutation({
    mutationFn: async () => {
      await axios.post('/logout')
    },
    onSuccess: () => {
      queryClient.clear();
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


  const forgotPassword = async (data: ForgotPasswordData ): Promise<AxiosResponse> => {
    try {
      await csrf()
      return await axios.post('/forgot-password', data)
    } catch (error: any) {
      throw Error
    }
  }

  const resetPassword = async (data: ResetPasswordData) => {
    try {
      await csrf()

      const response = await axios.post('/reset-password', {
        ...data,
        token: params.token,
      })
      router.push('/login?reset=' + btoa(response.data.status))
    } catch (error: any) {
      console.error("Reset password failed");
      return {
        error: error.response?.data?.message || "An unexpected error occurred",
      };
    }
  }

  const resendEmailVerification = async () => {
    try {
      return await axios.post('/email/verification-notification')
    } catch (error) {
      throw error
    }
  }

  useEffect(() => {
    if (middleware === 'guest') {
      if (redirectIfAuthenticated && user) {
        router.push(redirectIfAuthenticated)
      }
    } 
    else if (middleware === 'auth') {
      if (redirectIfNotAuthenticated && !user) {
        router.push(redirectIfNotAuthenticated)
      } 
      if (user?.email_verified_at && redirectIfAuthenticated) {
        router.push(redirectIfAuthenticated)
      }
      if (error) {
        logout()
      }
    }
  }, [user, error, middleware, redirectIfAuthenticated, redirectIfNotAuthenticated,])


  
  return {
    user,
    error,
    register,
    login,
    loginGoogle,
    forgotPassword,
    resetPassword,
    resendEmailVerification,
    logout,
  }
}
