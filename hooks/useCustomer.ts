import * as z from "zod";
import {
  useMutation,
  useQuery,
  useQueryClient,
  useInfiniteQuery,
} from "@tanstack/react-query";
import { api } from "@/lib/utils";

import { customerValidation } from "@/lib/validations/customer";

interface Props {
  query: {
    search?: string;
  };
  pageParam?: number | undefined;
}
interface InfiniteQueryProps {
  queryKey: string | any[];
  pageParam?: number;
}

const getCustomers = async ({
  queryKey,
  pageParam = 1,
}: InfiniteQueryProps) => {
  const [_, params] = queryKey;

  return await api.get("/customers", {
    params: {
      ...params,
      page: pageParam,
    },
  });
};

export const useCustomers = (query: { search?: string }) => {
  return useInfiniteQuery(["customers", query], getCustomers, {
    getNextPageParam: (pages) => {
      if (pages.data.pagination.page < pages.data.pagination.pageCount) {
        return pages.data.pagination.page + 1;
      }
      return undefined;
    },
    retry: 0,
  });
};

export const useSearchCustomer = (query: { search?: string | undefined }) => {
  return useQuery(["search-customer", query], getCustomers);
};

/**
 * get customer
 * @param {number} id
 * @returns
 */
const getCustomer = async ({ queryKey }: { queryKey: [string, number] }) => {
  const [_, id] = queryKey;
  return await api.get(`/customers/${id}`);
};

export const useCustomer = (id: number) => {
  return useQuery(["customer", id], getCustomer);
};

/**
 * create customer
 * @param
 * @returns
 */
const create = async (values: z.infer<typeof customerValidation>) => {
  return await api.post("/customers", values);
};

export const useCreateCustomer = () => {
  const query = useQueryClient();
  return useMutation(create, {
    onSuccess: () => {
      query.invalidateQueries(["customers"]);
    },
  });
};

/**
 * create customer
 * @param
 * @returns
 */
const update = async (values: z.infer<typeof customerValidation>) => {
  const { id } = values;
  return await api.put(`/customers/${id}`, values);
};

export const useUpdateCustomer = () => {
  const query = useQueryClient();
  return useMutation(update, {
    onSuccess: () => {
      query.invalidateQueries(["customers"]);
    },
  });
};
