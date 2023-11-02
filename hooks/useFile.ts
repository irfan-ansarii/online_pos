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

const getFiles = async ({ queryKey, pageParam = 1 }) => {
  const [_, params] = queryKey;

  return await api.get("/files", {
    params: {
      ...params,
      page: pageParam,
    },
  });
};
export const useFiles = (query: any) => {
  return useInfiniteQuery(["files", query], getFiles, {
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
 * create file
 * @param email
 * @returns
 */
const create = async (values: any) => {
  return await api.post("/files", values);
};

export const useCreateFile = () => {
  const query = useQueryClient();
  return useMutation(create, {
    onSuccess: () => {
      query.invalidateQueries(["files"]);
    },
  });
};
