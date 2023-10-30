import * as z from "zod";
import { saleValidation } from "@/lib/validations/sale";
import {
  useMutation,
  useQuery,
  useQueryClient,
  useInfiniteQuery,
} from "@tanstack/react-query";
import { api } from "@/lib/utils";

interface Props {
  query: {
    search?: string;
  };
  pageParam: number;
}
const getSales = async ({ query, pageParam = 1 }: Props) => {
  return await api.get("/products", {
    params: {
      ...query,
      page: pageParam,
    },
  });
};

export const useSales = (query: { search?: string }) => {
  return useInfiniteQuery(
    ["sales"],
    ({ pageParam }) => getSales({ query, pageParam }),
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

/**
 * get product
 * @param {number} id
 * @returns
 */
const getSale = async ({ queryKey }: { queryKey: [string, number] }) => {
  const [_, id] = queryKey;
  return await api.get(`/sales/${id}`);
};

export const useSale = (id: number) => {
  return useQuery(["sale", id], getSale);
};

/**
 * create product
 * @param email
 * @returns
 */
const create = async (values: z.infer<typeof saleValidation>) => {
  return await api.post("/sales", values);
};

export const useCreateSale = () => {
  const query = useQueryClient();
  return useMutation(create, {
    onSuccess: () => {
      query.invalidateQueries(["sales"]);
    },
  });
};
