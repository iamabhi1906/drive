const apiUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5050";

export function avatarUrl(avatar: string | null | undefined): string | undefined {
  if (!avatar) return undefined;
  return avatar.startsWith("uploads/") ? `${apiUrl}/${avatar}` : avatar;
}
