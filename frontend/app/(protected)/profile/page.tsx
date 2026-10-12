import ProfilePage from "@/features/profile/profile-page";
import type { AuthUser } from "@/features/auth/auth.types";
import { serverApi } from "@/lib/server.api";

export default async function Page() {
  const api = await serverApi();
  const { data } = await api.get<AuthUser>("/users/me");
  return <ProfilePage initialUser={data} />;
}
