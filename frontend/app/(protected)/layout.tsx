import ResponsiveAppBar from "@/components/app-bar";
import { AuthUser } from "@/features/auth/auth.types";
import { serverApi } from "@/lib/server.api";
import UserProvider from "@/providers/user-provider";
import { redirect } from "next/navigation";

export default async function Layout({
  children,
}: {
  children: React.ReactNode;
}) {
  const api = await serverApi();
  const { data } = await api.get("/auth/me");
  const user: AuthUser = data;
  if (!user) redirect("/login");
  if (!user.isVerified) redirect("/email-verify");
  return (
    <section>
      <UserProvider user={data as AuthUser} />
      <ResponsiveAppBar />
      {children}
    </section>
  );
}
