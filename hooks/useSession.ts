import { getSession } from "@/actions/auth-actions";
import useSWR from "swr";

export const useSession = () => {
  const { data, isLoading, mutate } = useSWR(`/session`, getSession);
  return {
    session: data?.data,
    isLoading,
    mutate,
  };
};
