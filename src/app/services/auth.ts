import axios, { AxiosResponse } from "axios";
import { useRouter } from "next/navigation";
import { useMutation } from "@tanstack/react-query";
import DEV_URL from "../common";
import { setAuthCookies } from "@/lib/cookies";

interface LoginProps {
  email: string;
  password: string;
}

export const userLoginRequest = async (params: LoginProps) => {
  const axiosConfig = {
    headers: {
      Accept: "application/json",
    },
    withCredentials: true,
  };

  const data = await axios.post(
    `${DEV_URL.ROOT_URL}/login`,
    params,
    axiosConfig
  );

  return data;
};

export const useLogin = () => {
  const router = useRouter();
  
  const loginMutation = useMutation({
    mutationFn: userLoginRequest,
    onSuccess: async (details: AxiosResponse) => {
      const { user_details, token } = details.data;

      if (token) {
        setAuthCookies({
          accessToken: token,
          userId: user_details.id,
          userRole: user_details.role_id,
        });
      }
    },
  });

  return loginMutation;
}; 