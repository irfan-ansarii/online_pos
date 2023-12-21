import { useAtom } from "jotai";
import { atomWithStorage } from "jotai/utils";

import { Theme } from "@/components/theme/themes";

type Config = {
  theme: Theme["name"];
};

const configAtom = atomWithStorage<Config>("config", {
  theme: "zinc",
});

export function useTheme() {
  return useAtom(configAtom);
}
