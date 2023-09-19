import React from "react";
// import { Content, Trigger, Root } from "@/components/drawer";

import Profile from "@/components/global/header/profile";
import Activity from "@/components/global/header/activity";
import Setting from "@/components/global/header/setting";
import WorkspaceDialog from "@/components/global/header/workspace-dialog";
const Header = async () => {
  return (
    <div className="hidden md:block sticky top-0 z-50 shadow w-full border-b bg-background/95 backdrop-blur">
      <header className="h-[60px] px-4">
        {/* <Root>
        <Trigger asChild>
          <Button variant="outline">Customize</Button>
        </Trigger>
        <Content className="h-[85%] p-6 pt-10">
          <Button>Customize</Button>
          drawer content
        </Content>
      </Root> */}
        <div className="flex h-full w-full items-center justify-between">
          <WorkspaceDialog />

          <div className="justify-self-end flex gap-3">
            <Setting />

            <Activity />
            <Profile />
          </div>
        </div>
      </header>
    </div>
  );
};

export default Header;
