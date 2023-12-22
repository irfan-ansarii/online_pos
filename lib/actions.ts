"use server";
import axios from "axios";

const axiosInstance = axios.create({
  baseURL: "http://localhost:3000/api",
});

interface APIParams {
  endpoint: string;
  params?: { [key: string]: string };
  data?: { [key: string]: string | any };
}

export const fetchData = async ({ endpoint, params }: APIParams) => {
  try {
    const response = await axiosInstance.get(endpoint, {
      params,
    });

    return response.data;
  } catch (error) {
    let errorMessage = "Something went wrong!";
    if (axios.isAxiosError(error) && error.response) {
      errorMessage = error.response.data.message;
    }

    throw new Error(errorMessage);
  }
};

export const postData = async ({ endpoint, data }: APIParams) => {
  try {
    const response = await axiosInstance.post(endpoint, data);

    return response.data;
  } catch (error) {
    let errorMessage = "Something went wrong!";
    if (axios.isAxiosError(error) && error.response) {
      errorMessage = error.response.data.message;
    }

    throw new Error(errorMessage);
  }
};

export const updateData = async ({ endpoint, data }: APIParams) => {
  try {
    const response = await axiosInstance.put(endpoint, data);

    return response;
  } catch (error) {
    let errorMessage = "Something went wrong!";
    if (axios.isAxiosError(error) && error.response) {
      errorMessage = error.response.data.message;
    }

    throw new Error(errorMessage);
  }
};

export const deleteData = async ({ endpoint, data }: APIParams) => {
  try {
    const response = await axiosInstance.delete(endpoint);

    return response;
  } catch (error) {
    let errorMessage = "Something went wrong!";
    if (axios.isAxiosError(error) && error.response) {
      errorMessage = error.response.data.message;
    }

    throw new Error(errorMessage);
  }
};

// export const auth = async () => {
//   try {
//     const res = await fetchData({ endpoint: "/auth/session" });
//     return res.data;
//   } catch (error: any) {
//     return null;
//   }
// };
