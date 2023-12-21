import axios from "axios";

const axiosInstance = axios.create({
  baseURL: "http://localhost:3000/api",
});

interface Props {
  url: string;
  params?: { [key: string]: string };
  data?: any;
}

export const fetchData = async ({ url, params }: Props) => {
  try {
    const response = await axiosInstance.get(url, {
      params,
    });
    return response.data;
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

export const postData = async ({ url, data }: Props) => {
  try {
    const response = await axiosInstance.post(url, data);
    return response.data;
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
