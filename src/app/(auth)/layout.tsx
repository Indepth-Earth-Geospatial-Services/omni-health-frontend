import { Toaster } from "sonner";

export const metadata = {
  title: "Authentication - GeoHealth",
  description: "Sign in or create an account to access GeoHealth",
};

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      {children}
      <Toaster
        position="top-right"
        richColors
        toastOptions={{
          duration: 4000,
        }}
      />
    </>
  );
}
