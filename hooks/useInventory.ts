import { getInventory } from "@/actions/inventory-actions";
import useSWR from "swr";

interface Props {
  [key: string]: any;
}
export const useInventory = (params: Props) => {
  const key = new URLSearchParams(params).toString();

  const { data, error, isLoading, mutate } = useSWR(`/inventory?${key}`, () => {
    return getInventory(params);
  });

  return {
    inventory: data,
    isLoading,
    isError: error,
    mutate,
  };
};
