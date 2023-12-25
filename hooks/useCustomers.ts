import { getCustomers } from "@/actions/customer-actions";
import useSWR from "swr";

interface Props {
  [key: string]: any;
}
export const useCustomers = (params: Props) => {
  const { data, error, isLoading, mutate } = useSWR(`/customers`, () => {
    return getCustomers(params);
  });

  return {
    customers: data,
    isLoading,
    isError: error,
    mutate,
  };
};
