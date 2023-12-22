"use server";

import axios from "axios";
import { revalidatePath } from "next/cache";

const axiosInstance = axios.create({
  baseURL: "http://localhost:3000/api",
});

interface APIParams {
  endpoint: string;
  params?: { [key: string]: string };
  data?: { [key: string]: string | any };
  revalidate?: string;
}

export const fetchData = async ({
  endpoint,
  params,
  revalidate,
}: APIParams) => {
  try {
    const response = await axiosInstance.get(endpoint, {
      params,
    });
    revalidate && revalidatePath(revalidate);
    return response.data;
  } catch (error) {
    let errorMessage = "Something went wrong!";
    if (axios.isAxiosError(error) && error.response) {
      errorMessage = error.response.data.message;
    }

    throw new Error(errorMessage);
  }
};

export const postData = async ({ endpoint, data, revalidate }: APIParams) => {
  try {
    const response = await axiosInstance.post(endpoint, data);

    revalidate && revalidatePath(revalidate);
    return response.data;
  } catch (error) {
    let errorMessage = "Something went wrong!";
    if (axios.isAxiosError(error) && error.response) {
      errorMessage = error.response.data.message;
    }

    throw new Error(errorMessage);
  }
};

export const updateData = async ({ endpoint, data, revalidate }: APIParams) => {
  try {
    const response = await axiosInstance.put(endpoint, data);
    revalidate && revalidatePath(revalidate);
    return response;
  } catch (error) {
    let errorMessage = "Something went wrong!";
    if (axios.isAxiosError(error) && error.response) {
      errorMessage = error.response.data.message;
    }

    throw new Error(errorMessage);
  }
};

export const deleteData = async ({ endpoint, data, revalidate }: APIParams) => {
  try {
    const response = await axiosInstance.delete(endpoint);
    revalidate && revalidatePath(revalidate);
    return response;
  } catch (error) {
    let errorMessage = "Something went wrong!";
    if (axios.isAxiosError(error) && error.response) {
      errorMessage = error.response.data.message;
    }

    throw new Error(errorMessage);
  }
};
