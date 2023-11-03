import { useAtom } from "jotai";
import { atomWithStorage } from "jotai/utils";

import { Theme } from "@/components/theme/themes";

type Config = {
  theme: Theme["name"];
  radius: number;
};

const configAtom = atomWithStorage<Config>("config", {
  theme: "zinc",
  radius: 0.5,
});

export function useTheme() {
  return useAtom(configAtom);
}
