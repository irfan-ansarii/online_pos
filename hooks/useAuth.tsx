import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import axios from "axios";

interface Props {
  email: string;
  password: string;
}

/**
 *  signup
 * @param data
 * @returns
 */
const signup = async (data: Props) => {
  return await axios.post("/api/auth/signup", data);
};

export const useSignup = () => {
  return useMutation(signup);
};

/**
 * login
 * @param data
 * @returns
 */
const login = async (data: Props) => {
  return await axios.post("/api/auth/login", data);
};

export const useLogin = () => {
  return useMutation(login);
};

/**
 * logout
 * @returns
 */
const logout = async () => {
  return await axios.post("/api/auth/logout");
};

export const useLogout = () => {
  const queryClient = useQueryClient();
  return useMutation(logout, {
    onSuccess: () => {
      queryClient.removeQueries();
      queryClient.clear();
    },
  });
};

/**
 * session
 * @returns
 */
const session = async () => {
  return await axios.get("/api/auth/session");
};
export const useSession = () => {
  return useQuery(["session"], session, { retry: 0 });
};

/**
 * send reset password
 * @param email
 * @returns
 */
const sendOTP = async (data: { email: string }) => {
  return await axios.post("/api/auth/send-otp", data);
};
export const useSendOTP = () => {
  return useMutation(sendOTP);
};

/**
 * verify otp
 * @param email
 * @returns
 */
const verifyOtp = async (data: { otp: string }) => {
  return await axios.post("/api/auth/verify-otp", data);
};

export const useVerifyOTP = () => {
  return useMutation(verifyOtp);
};

/**
 * reset password
 * @param data
 * @returns
 */
const resetPassword = async (data: {
  newPassword: string;
  confirmNewPassword: string;
}) => {
  return await axios.post("/api/auth/reset-password", data);
};

export const useResetPassword = () => {
  return useMutation(resetPassword);
};
