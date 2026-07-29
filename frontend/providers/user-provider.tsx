"use client";
import { useAppDispatch } from "@/app/store";
import { setUser } from "@/features/auth/auth.slice";
import { AuthUser } from "@/features/auth/auth.types";
import { useEffect } from "react";

export default function UserProvider({ user }: { user: AuthUser }) {
  const dispatch = useAppDispatch();
  useEffect(() => {
    dispatch(setUser(user));
  }, [user, dispatch]);

  return <></>;
}
