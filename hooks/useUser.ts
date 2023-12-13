import { api } from "@/lib/utils";
import {
  useMutation,
  useInfiniteQuery,
  useQuery,
  useQueryClient,
} from "@tanstack/react-query";
import { locationValidation } from "@/lib/validations/locations";
import {
  userInviteValidation,
  updateUserValidation,
} from "@/lib/validations/user";
import * as z from "zod";

interface InfiniteQueryProps {
  queryKey: string | any[];
  pageParam?: number;
}

/**
 * get users
 * @param query
 * @returns
 */
const getUsers = async ({ queryKey, pageParam = 1 }: InfiniteQueryProps) => {
  const [_, params] = queryKey;
  return await api.get("/users", {
    params: {
      ...params,
      page: pageParam,
    },
  });
};

export const useUsers = (query: { search?: string }) => {
  return useInfiniteQuery(["users", query], getUsers, {
    getNextPageParam: (pages) => {
      if (pages.data.pagination.page < pages.data.pagination.pageCount) {
        return pages.data.pagination.page + 1;
      }
      return undefined;
    },
    retry: 0,
  });
};

/**
 * get user
 * @param {number} id
 * @returns
 */
const getUser = async ({ queryKey }: { queryKey: [string, number] }) => {
  const [_, id] = queryKey;
  return await api.get(`/users/${id}`);
};

export const useUser = (id: number) => {
  return useQuery(["user", id], getUser);
};

/**
 * invite user
 * @param email
 * @returns
 */
const invite = async (values: z.infer<typeof userInviteValidation>) => {
  return await api.post("/users", values);
};

export const useInviteUser = () => {
  return useMutation(invite);
};

/**
 * update user
 * @param {object}
 * @returns
 */
const update = async (values: any) => {
  const { id } = values;
  return await api.put(`/users/${id}`, values);
};
export const useUpdateUser = () => {
  const queryClient = useQueryClient();
  return useMutation(update, {
    onSuccess: () => {
      queryClient.invalidateQueries(["users"]);
    },
  });
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

/**
 * get locations
 * @returns
 */
const locations = async () => {
  return api.get("/locations");
};

export const useLocations = () => {
  return useQuery(["locations"], locations);
};

/**
 * create location
 * @param data
 * @returns
 */
const createLocation = async (data: z.infer<typeof locationValidation>) => {
  return api.post("/locations", data);
};

export const useCreateLocation = () => {
  return useMutation(createLocation);
};

/**
 * switch location
 * @param data
 * @returns
 */
const switchLocation = async (data: any) => {
  return api.post("/users/locations", data);
};

export const useSwitchLocation = () => {
  const query = useQueryClient();
  return useMutation(switchLocation, {
    onSuccess: () => {
      query.invalidateQueries();
    },
  });
};
