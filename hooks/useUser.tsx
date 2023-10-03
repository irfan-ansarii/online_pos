import axios from "axios";
import { useMutation, useInfiniteQuery, useQuery } from "@tanstack/react-query";

/**
 * get users
 * @param query
 * @returns
 */
const users = async (query: any) => {
  return await axios.get("/api/users", query);
};

export const useUsers = () => {
  return useInfiniteQuery(["users"], users);
};

/**
 * get user
 * @param {number} id
 * @returns
 */
const user = async (id: number) => {
  return await axios.get(`/api/user/${id}`);
};

export const useUser = () => {
  return useQuery(["user"], user);
};

/**
 * invite user
 * @param email
 * @returns
 */
const invite = async ({ email }: { email: string }) => {
  return await axios.post("/api/users", { email });
};

export const useInviteUser = () => {
  return useMutation(invite);
};

/**
 * change user role
 * @param {object}
 * @returns
 */
const updateRole = async ({ id, role }: { id: number; role: string }) => {
  return await axios.put(`/api/users/${id}`, { role });
};
export const useUpdateUserRole = () => {
  return useMutation(updateRole);
};

/**
 * block or unblock user
 * @param {object}
 * @returns
 */
const updateStatus = async ({ id, status }: { id: number; status: string }) => {
  return await axios.patch(`/api/users/${id}`, { status });
};
export const useUpdateUserStatus = () => {
  return useMutation(updateStatus);
};

/**
 * delete user
 * @param {number} id
 */
const deleteUser = async (id: number) => {
  return await axios.delete(`/api/users/${id}`);
};

export const useDeleteUser = () => {
  return useMutation(deleteUser);
};
