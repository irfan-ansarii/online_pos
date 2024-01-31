import { getSession } from "@/actions/auth-actions";
import useSWR from "swr";

export const useSession = () => {
  const { data, error, isLoading, mutate } = useSWR(`/session`, () => {
    return getSession();
  });

  return {
    session: data?.data,
    isLoading,
    isError: error,
    mutate,
  };
};
