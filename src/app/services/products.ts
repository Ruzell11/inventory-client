import axios, { AxiosResponse } from "axios";
import { useMutation, useQuery } from "@tanstack/react-query";
import jsCookie from "js-cookie";
import DEV_URL from "../common";


interface ProductProps {
  image: File | null;
  product_name: string | null;
  product_description: string | null;
  product_price: string | null;
}

export const userAddProduct = async (params: FormData) => {
  const user_id = jsCookie.get("id");
  const axiosConfig = {
    headers: {
      Accept: "application/json",
    },
    withCredentials: true,
  };

  const data = await axios.post(
    `${DEV_URL.ROOT_URL}/products/create/${user_id}`,
    params,
    axiosConfig
  );

  return data;
};

export const useAddProduct = () => {
  const { mutate, isSuccess, isError, isPending, data } = useMutation<AxiosResponse, Error, FormData>({
    mutationFn: userAddProduct,
    onSuccess: (response: AxiosResponse) => {},
  });

  return { mutate, isSuccess, isError, isLoading: isPending, data };
};

export const getUserProductList = async (): Promise<AxiosResponse> => {
  if (typeof window === 'undefined') {
    return { data: { products: [] } } as AxiosResponse;
  }
  
  const userId = jsCookie.get("id");
  const role_id = jsCookie.get("role_id");

  return axios({
    method: "GET",
    withCredentials: true,
    url: `${DEV_URL.ROOT_URL}/products/product-list?role_id=${role_id}&user_id=${userId}`,
  });
};

export const useProductList = () => {
  return useQuery({
    queryKey: ["productList"],
    queryFn: getUserProductList,
  });
}; 