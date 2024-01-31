import { getContacts } from "@/actions/contact-actions";
import useSWR from "swr";

interface Props {
  [key: string]: any;
}

export const useContacts = (params: Props) => {
  const key = new URLSearchParams(params).toString();
  const { data, error, isLoading, mutate } = useSWR(`/contacts${key}`, () => {
    return getContacts(params);
  });

  return {
    contacts: data,
    isLoading,
    isError: error,
    mutate,
  };
};
