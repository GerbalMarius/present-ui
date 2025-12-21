"use client";

import React, { createContext, useContext } from "react";
import type { UserData } from "../lib/types";

type ProfileContextValue = {
  me: UserData;
};

const ProfileContext = createContext<ProfileContextValue | null>(null);

export function ProfileProvider({
  me,
  children,
}: {
  me: UserData;
  children: React.ReactNode;
}) {
  return <ProfileContext.Provider value={{ me }}>{children}</ProfileContext.Provider>;
}

export function useProfile() {
  const ctx = useContext(ProfileContext);
  if (!ctx) throw new Error("useProfile must be used inside <ProfileProvider />");
  return ctx;
}
