import { atom } from "jotai";
interface State {
  open: boolean;
}
export const store = atom<State>({
  open: false,
});
