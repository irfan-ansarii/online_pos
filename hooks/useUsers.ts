import { getUsers } from "@/actions/user-actions";
import useSWR from "swr";

interface Props {
  [key: string]: any;
}
export const useUsers = (params: Props) => {
  const { data, error, isLoading, mutate } = useSWR(`/users`, () => {
    return getUsers(params);
  });

  return {
    users: data,
    isLoading,
    isError: error,
    mutate,
  };
};
