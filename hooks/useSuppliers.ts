import { getSuppliers } from "@/actions/supplier-actions";
import useSWR from "swr";

interface Props {
  [key: string]: any;
}

export const useSuppliers = (params: Props) => {
  const key = new URLSearchParams(params).toString();
  const { data, error, isLoading, mutate } = useSWR(`/suppliers${key}`, () => {
    return getSuppliers(params);
  });

  return {
    customers: data,
    isLoading,
    isError: error,
    mutate,
  };
};
