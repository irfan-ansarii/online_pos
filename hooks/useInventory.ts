import { getInventory } from "@/actions/inventory-actions";
import useSWR from "swr";

interface Props {
  [key: string]: any;
}
export const useInventory = (params: Props) => {
  const { data, error, isLoading, mutate } = useSWR(`/inventory`, () => {
    return getInventory(params);
  });

  return {
    inventory: data,
    isLoading,
    isError: error,
    mutate,
  };
};
