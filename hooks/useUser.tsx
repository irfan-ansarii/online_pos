import { api } from "@/lib/utils";
import { useMutation, useInfiniteQuery, useQuery } from "@tanstack/react-query";

interface UsersQueryKey {
  query: {
    perPage?: number;
    search?: string;
  };
  pageParam: number;
}

/**
 * get users
 * @param query
 * @returns
 */
const getUsers = async ({ query, pageParam = 1 }: UsersQueryKey) => {
  return await api.get("/users", {
    params: {
      ...query,
      page: pageParam,
    },
  });
};

export const useUsers = (query: any) => {
  return useInfiniteQuery(
    ["users"],
    ({ pageParam }) => getUsers({ query, pageParam }),
    {
      getNextPageParam: (lastPage, allPages) => {
        return undefined;
      },
      retry: 0,
    }
  );
};
/**
 * get user
 * @param {number} id
 * @returns
 */
const getUser = async ({ queryKey }: { queryKey: [string, number] }) => {
  const [_, id] = queryKey;
  return await api.get(`/user/${id}`);
};

export const useUser = (id: number) => {
  return useQuery(["user", id], getUser);
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
