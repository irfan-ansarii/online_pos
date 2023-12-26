import { getCustomers } from "@/actions/customer-actions";
import useSWR from "swr";

interface Props {
  [key: string]: any;
}

export const useCustomers = (params: Props) => {
  const key = new URLSearchParams(params).toString();
  const { data, error, isLoading, mutate } = useSWR(`/customers${key}`, () => {
    return getCustomers(params);
  });

  return {
    customers: data,
    isLoading,
    isError: error,
    mutate,
  };
};
