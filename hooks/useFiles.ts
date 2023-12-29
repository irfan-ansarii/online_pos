import { getFiles } from "@/actions/file-actions";
import useSWR from "swr";

interface Props {
  [key: string]: any;
}

export const useFiles = (params: Props) => {
  const key = new URLSearchParams(params).toString();
  const { data, error, isLoading, mutate } = useSWR(`/files${key}`, () => {
    return getFiles(params);
  });

  return {
    files: data,
    isLoading,
    isError: error,
    mutate,
  };
};
