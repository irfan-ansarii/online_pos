"use server";
import axios from "axios";
import { revalidatePath } from "next/cache";

const axiosInstance = axios.create({
  baseURL: "http://localhost:3000/api",
});

interface APIParams {
  params?: { [key: string]: string };
  data?: { [key: string]: string | any };
  onSuccess?: (data: any) => void;
  onError?: (error: any) => void;
}

interface Props {
  url: string;
  params?: { [key: string]: string };
  data?: any;
}

export const fetchData = async (
  url: string,
  { params, onSuccess, onError }: APIParams
) => {
  try {
    const response = await axiosInstance.get(url, {
      params,
    });
    onSuccess && onSuccess(response.data);
    return response.data;
  } catch (error) {
    let errorMessage = "Something went wrong!";
    if (axios.isAxiosError(error) && error.response) {
      errorMessage = error.response.data.message;
    }
    onError && onError(error);
    throw new Error(errorMessage);
  }
};

export const postData = async (
  url: string,
  { data, onSuccess, onError }: APIParams
) => {
  try {
    const response = await axiosInstance.post(url, data);
    onSuccess && onSuccess(response.data);
    revalidatePath("/products");
    return response.data;
  } catch (error) {
    console.log(error);
    let errorMessage = "Something went wrong!";
    if (axios.isAxiosError(error) && error.response) {
      errorMessage = error.response.data.message;
    }
    onError && onError(error);
    throw new Error(errorMessage);
  }
};

export const updateData = async ({ url, data }: Props) => {
  try {
    const response = await axiosInstance.put(url, data);
    return response;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      if (error.response) {
        throw Error(error.response.data.message);
      }
      throw Error(error.request.data.message);
    } else {
      throw Error("Something went wrong!");
    }
  }
};
export const deleteData = async ({ url }: Props) => {
  try {
    const response = await axiosInstance.delete(url);
    return response;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      if (error.response) {
        throw Error(error.response.data.message);
      }
      throw Error(error.request.data.message);
    } else {
      throw Error("Something went wrong!");
    }
  }
};
