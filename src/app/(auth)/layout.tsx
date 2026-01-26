export const metadata = {
  title: "Authentication - OmniHealth",
  description: "Sign in or create an account to access OmniHealth",
};

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
