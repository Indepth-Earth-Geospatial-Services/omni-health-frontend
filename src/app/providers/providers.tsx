import { ReactNode } from "react";
import QueryProvider from "./query.provider";

function Providers({ children }: { children: ReactNode }) {
  return <QueryProvider>{children}</QueryProvider>;
}

export default Providers;
