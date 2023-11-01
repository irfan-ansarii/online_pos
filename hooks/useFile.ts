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
