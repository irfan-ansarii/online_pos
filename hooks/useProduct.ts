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
 * @param object {Object}
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

/**
 * update product
 * @param {number} values
 * @returns
 */
const updateProduct = async (values: any) => {
  const { id } = values;
  return await api.put(`/products/${id}`, values);
};

export const useUpdateProduct = () => {
  return useMutation(updateProduct);
};

/**
 * get inventory
 *  maybe delete later
 * @param param0
 * @returns
 */
const getInventory = async ({ queryKey }: { queryKey: [string, number] }) => {
  const [_, id] = queryKey;
  return await api.get(`/products/${id}`);
};

export const useInventory = (id: number) => {
  return useQuery(["product", id], getInventory);
};

/**
 * create stock transfer
 * @param values
 * @returns
 */
const createTransfer = async (values: any) => {
  return await api.post("/products/transfers", values);
};

export const useCreateTransfer = () => {
  const query = useQueryClient();
  return useMutation(createTransfer, {
    onSuccess: () => {
      query.invalidateQueries({ queryKey: ["transfers"] });
    },
  });
};

/**
 *
 * @param param
 * @returns
 */
const getTransfers = async ({
  queryKey,
  pageParam = 1,
}: InfiniteQueryProps) => {
  const [_, params] = queryKey;

  return await api.get("/products/transfers", {
    params: {
      ...params,
      page: pageParam,
    },
  });
};

export const useTransfers = (query: { search?: string }) => {
  return useInfiniteQuery(["transfers", query], getTransfers, {
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
 * update stock transfer
 * @param values
 * @returns
 */
const updateTransfer = async (values: any) => {
  const { id } = values;
  return await api.put(`/products/transfers/${id}`, values);
};

export const useUpdateTransfer = () => {
  const query = useQueryClient();
  return useMutation(updateTransfer, {
    onSuccess: () => {
      query.invalidateQueries(["transfers"]);
    },
  });
};

/**
 * accept stock transfer
 * @param values
 * @returns
 */
const acceptTransfer = async (values: any) => {
  const { id } = values;
  return await api.post(`/products/transfers/${id}/accept`, values);
};

export const useAcceptTransfer = () => {
  const query = useQueryClient();
  return useMutation(acceptTransfer, {
    onSuccess: () => {
      query.invalidateQueries({ queryKey: ["transfers"] });
    },
  });
};

/**
 * reject stock transfer
 * @param values
 * @returns
 */
const rejectTransfer = async (values: any) => {
  const { id } = values;
  return await api.delete(`/products/transfers/${id}`, values);
};

export const useRejectTransfer = () => {
  const query = useQueryClient();
  return useMutation(rejectTransfer, {
    onSuccess: () => {
      query.invalidateQueries({ queryKey: ["transfers"] });
    },
  });
};

/**
 * create adjustments
 * @param values
 * @returns
 */
const createAdjustment = async (values: any) => {
  return await api.post("/products/adjustments", values);
};

export const useCreateAdjustment = () => {
  const query = useQueryClient();
  return useMutation(createAdjustment, {
    onSuccess: () => {
      query.invalidateQueries({ queryKey: ["adjustments"] });
    },
  });
};

/**
 * get Adjustment
 * @param param
 * @returns
 */
const getAdjustments = async ({
  queryKey,
  pageParam = 1,
}: InfiniteQueryProps) => {
  const [_, params] = queryKey;

  return await api.get("/products/adjustments", {
    params: {
      ...params,
      page: pageParam,
    },
  });
};

export const useAdjustments = (query: { search?: string }) => {
  return useInfiniteQuery(["adjustment", query], getAdjustments, {
    getNextPageParam: (pages) => {
      if (pages.data.pagination.page < pages.data.pagination.pageCount) {
        return pages.data.pagination.page + 1;
      }
      return undefined;
    },
    retry: 0,
  });
};
