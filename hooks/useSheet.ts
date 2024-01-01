import { store } from "@/lib/utils";
import { useAtom } from "jotai";

export const useSheetToggle = (name: string): [boolean, () => void] => {
  const [state, setState] = useAtom(store);

  const toggleSheet = () => {
    setState({ ...state, [name]: !state[name] });
  };

  return <[boolean, () => void]>[state[name], toggleSheet];
};
