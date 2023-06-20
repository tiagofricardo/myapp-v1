import { useSession } from "next-auth/react";
import { useState } from "react";
import Sidebar from "./Sidebar";

export default function Layout({ children }) {
  const { data: session } = useSession({
    required: true,
  });
  const [isStretch, setIsStretch] = useState(true);
  const onSidebarOpen = function (isOpen) {
    setIsStretch(isOpen);
  };

  if (!session) {
    return <></>;
  }

  return (
    <div className="flex gap-5 ">
      <Sidebar onSidebarChange={onSidebarOpen} />
      <div
        className={`max-w-screen-lg flex-1 mt-16 md:mt-10 ${
          isStretch ? "md:ml-[256px]" : "sm:ml-[64px]"
        } `}
      >
        {children}
      </div>
    </div>
  );
}
