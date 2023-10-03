import { useMutation, useInfiniteQuery, useQuery } from "@tanstack/react-query";
import { api } from "@/lib/utils";
/**
 * get users
 * @param query
 * @returns
 */
const users = async ({ pageParam = 1 }) => {
  return await api.get(`/users?page=${pageParam}`);
};

export const useUsers = () => {
  return useInfiniteQuery(["users"], users, {
    getNextPageParam: (lastPage, allPages) => {
      console.log(lastPage, allPages);

      return undefined;
    },
  });
};

/**
 * get user
 * @param {number} id
 * @returns
 */
const user = async () => {
  return await api.get(`/user/`);
};

export const useUser = () => {
  return useQuery(["user", "1"], user);
};

/**
 * invite user
 * @param email
 * @returns
 */
const invite = async ({ email }: { email: string }) => {
  return await api.post("/users", { email });
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
  return await api.put(`/users/${id}`, { role });
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
  return await api.patch(`/users/${id}`, { status });
};
export const useUpdateUserStatus = () => {
  return useMutation(updateStatus);
};

/**
 * delete user
 * @param {number} id
 */
const deleteUser = async (id: number) => {
  return await api.delete(`/users/${id}`);
};

export const useDeleteUser = () => {
  return useMutation(deleteUser);
};
