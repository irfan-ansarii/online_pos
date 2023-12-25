import { getLocations } from "@/actions/store-actions";
import useSWR from "swr";

export const useLocations = () => {
  const { data, error, isLoading, mutate } = useSWR(`/locations`, () => {
    return getLocations();
  });

  return {
    locations: data,
    isLoading,
    isError: error,
    mutate,
  };
};
