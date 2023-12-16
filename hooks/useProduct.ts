import {
  useMutation,
  useQuery,
  useQueryClient,
  useInfiniteQuery,
} from "@tanstack/react-query";
import { api } from "@/lib/utils";

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
      query.invalidateQueries(["products", {}]);
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
 * delete product
 * @param {number} values
 * @returns
 */
const deleteProduct = async (values: any) => {
  const { id } = values;

  return await api.delete(`/products/${id}`, values);
};

export const useDeleteProduct = () => {
  const query = useQueryClient();

  return useMutation(deleteProduct, {
    onSuccess: () => query.invalidateQueries(["products", {}]),
  });
};

/**
 * get inventory
 * @param object {Object}
 * @returns
 */
const getInventory = async ({ queryKey }: InfiniteQueryProps) => {
  const [_, params] = queryKey;

  return await api.get("/products/inventory", { params: { ...params } });
};

export const useInventory = (query: any) => {
  return useQuery(["inventory", query], getInventory);
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
      query.invalidateQueries({ queryKey: ["adjustments", "product"] });
    },
  });
};

/**
 * get Adjustments
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

/**
 * create barcodes entry
 * @param values
 * @returns
 */
const createBarcode = async (values: any) => {
  return await api.post("/products/barcodes", values);
};

export const useCreateBarcode = () => {
  const query = useQueryClient();
  return useMutation(createBarcode, {
    onSuccess: () => {
      query.invalidateQueries({ queryKey: ["barcodes", "product"] });
    },
  });
};

/**
 * update barcode
 * @param values
 * @returns
 */
const updateBarcode = async (values: any) => {
  const { id } = values;
  return await api.put(`/products/barcodes/${id}`, values);
};

export const useUpdateBarcode = () => {
  const query = useQueryClient();
  return useMutation(updateBarcode, {
    onSuccess: () => {
      query.invalidateQueries(["barcodes", {}]);
    },
  });
};

/**
 * print barcodes entry
 * @param values
 * @returns
 */
const printBarcode = async (values: any) => {
  return await api.post("/products/barcodes/print", values);
};

export const usePrintBarcode = () => {
  const query = useQueryClient();
  return useMutation(printBarcode, {
    onSuccess: () => {
      query.invalidateQueries({ queryKey: ["barcodes", "product"] });
    },
  });
};

/**
 * get barcodes
 * @param param
 * @returns
 */
const getBarcodes = async ({ queryKey, pageParam = 1 }: InfiniteQueryProps) => {
  const [_, params] = queryKey;

  return await api.get("/products/barcodes", {
    params: {
      ...params,
      page: pageParam,
    },
  });
};

export const useBarcodes = (query: { search?: string }) => {
  return useInfiniteQuery(["barcodes", query], getBarcodes, {
    getNextPageParam: (pages) => {
      if (pages.data.pagination.page < pages.data.pagination.pageCount) {
        return pages.data.pagination.page + 1;
      }
      return undefined;
    },
    retry: 0,
  });
};
