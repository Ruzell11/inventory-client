import axios, { AxiosResponse } from "axios";
import { useMutation } from "@tanstack/react-query";

import { setAuthCookies } from "@/lib/cookies";
import { useRouter } from "next/navigation";

interface LoginResponse {
    user_details: {
      id: string;
      role_id: string;
      token: string;
  };
}

export const userLoginRequest = async (data: { email: string; password: string }) => {
  return axios.post<LoginResponse>(`${process.env.NEXT_PUBLIC_API_URL}/login`, data);
};

export const useLogin = () => {
  const router = useRouter();
  return useMutation<AxiosResponse<LoginResponse>, Error, { email: string; password: string }>({
    mutationFn: userLoginRequest,
    onSuccess: (response) => {
      const { user_details } = response.data;
      setAuthCookies({
        userId: user_details.id,
        userRole: user_details.role_id,
        token: user_details.token, // 👈 add token
      });

      router.push('/dashboard/charts');
    },
  });
}; 