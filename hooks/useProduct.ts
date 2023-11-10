import * as z from "zod";
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

interface InfiniteQueryProps {
  queryKey: string | any[];
  pageParam?: number;
}

const getProducts = async ({ queryKey, pageParam = 1 }: InfiniteQueryProps) => {
  const [_, params] = queryKey;
  console.log(queryKey);
  return await api.get("/products", {
    params: {
      ...params,
      page: pageParam,
    },
  });
};

export const useProducts = (query: { search?: string }) => {
  return useInfiniteQuery(["products", query], getProducts, {
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
 * get product
 * @param {number} id
 * @returns
 */
const getProduct = async ({ queryKey }: { queryKey: [string, number] }) => {
  const [_, id] = queryKey;
  return await api.get(`/products/${id}`);
};

export const useProduct = (id: number) => {
  return useQuery(["product", id], getProduct);
};

/**
 * create product
 * @param email
 * @returns
 */
const create = async (values: any) => {
  return await api.post("/products", values);
};

export const useCreateProduct = () => {
  const query = useQueryClient();
  return useMutation(create, {
    onSuccess: () => {
      query.invalidateQueries(["products"]);
    },
  });
};

const getInventory = async ({ queryKey }: { queryKey: [string, number] }) => {
  const [_, id] = queryKey;
  return await api.get(`/products/${id}`);
};

export const useInventory = (id: number) => {
  return useQuery(["product", id], getInventory);
};
