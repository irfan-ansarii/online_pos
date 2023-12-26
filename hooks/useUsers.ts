import { getUsers } from "@/actions/user-actions";
import useSWR from "swr";

interface Props {
  [key: string]: any;
}
export const useUsers = (params: Props) => {
  const key = new URLSearchParams(params).toString();
  const { data, error, isLoading, mutate } = useSWR(`/users${key}`, () => {
    return getUsers(params);
  });

  return {
    users: data,
    isLoading,
    isError: error,
    mutate,
  };
};
