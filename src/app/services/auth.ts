import axios, { AxiosResponse } from "axios";
import { useMutation } from "@tanstack/react-query";

import { setAuthCookies } from "@/lib/cookies";

interface LoginResponse {
  data: {
    user_details: {
      id: string;
      role_id: string;
    };
  };
}

export const userLoginRequest = async (data: { email: string; password: string }) => {
  return axios.post<LoginResponse>(`${process.env.NEXT_PUBLIC_API_URL}/login`, data);
};

export const useLogin = () => {
  return useMutation<AxiosResponse<LoginResponse>, Error, { email: string; password: string }>({
    mutationFn: userLoginRequest,
    onSuccess: (response) => {
      const { user_details } = response.data.data;
      setAuthCookies({
        userId: user_details.id,
        userRole: user_details.role_id,
      });
    },
  });
}; 