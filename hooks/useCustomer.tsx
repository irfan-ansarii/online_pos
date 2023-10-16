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
const getCustomers = async ({ query, pageParam = 1 }: Props) => {
  return await api.get("/customers", {
    params: {
      ...query,
      page: pageParam,
    },
  });
};

export const useCustomers = (query: { search?: string }) => {
  return useInfiniteQuery(
    ["customers"],
    ({ pageParam }) => getCustomers({ query, pageParam }),
    {
      getNextPageParam: (pages) => {
        if (pages.data.pagination.page < pages.data.pagination.pageCount) {
          return pages.data.pagination.page + 1;
        }
        return undefined;
      },
      retry: 0,
    }
  );
};

export const useSearchCustomer = (query: { search?: string | undefined }) => {
  return useQuery(["search-customer"], () => getCustomers({ query }));
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
 * @param email
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
