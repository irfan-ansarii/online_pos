import { getPayments } from "@/actions/payments-actions";
import useSWR from "swr";

export const usePayments = () => {
  const { data, error, isLoading, mutate } = useSWR(`/payments`, () => {
    return getPayments();
  });

  return {
    payments: data,
    isLoading,
    isError: error,
    mutate,
  };
};
