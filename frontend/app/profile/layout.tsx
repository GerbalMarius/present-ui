"use client";

import { useEffect, useMemo, useState } from "react";
import { usePathname, useRouter } from "next/navigation";
import DashboardSidebar from "../ui/DashboardSidebar";
import Spinner from "../ui/Spinner";
import { ApiError, backend } from "../lib/api";
import type { UserData } from "../lib/types";
import { ProfileProvider } from "./ProfileContext";

const ProfileLayout = ({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) =>{
  const router = useRouter();
  const path = usePathname();

  const [me, setMe] = useState<UserData | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    (async () => {
      try {
        const u = await backend.getMe();
        setMe(u);
      } catch (e: any) {
        const apiErr = e as ApiError;
        setError(apiErr?.messages?.[0] ?? apiErr?.err?.message ?? "Failed to load profile.");
      }
    })();
  }, []);

  const avatarText = useMemo(() => {
    if (!me) return "?";
    return `${me.firstName?.[0] ?? "?"}${me.lastName?.[0] ?? "?"}`.toUpperCase();
  }, [me]);

  const sidebarLinks = useMemo(
    () => [
      {
        id: "about",
        label: "About",
        iconSrc: "/img/home.svg",
        active: path === "/profile/about",
        onClick: () => router.push("/profile/about"),
      },
    ],
    [path, router]
  );

  if (!me) return <Spinner />;

  return (
    <ProfileProvider me={me}>
      <div className="min-h-screen flex">
        <DashboardSidebar
          title="Profile"
          subtitle="Your dashboard"
          avatarText={avatarText}
          links={sidebarLinks}
          onExit={() => router.push("/")}
          exitLabel="Exit"
        />

        <main className="flex-1 max-w-6xl mx-auto px-4 sm:px-6 py-8">
          {error && (
            <section className="mb-6 rounded-2xl border border-red-200 bg-red-50 p-4 text-sm font-semibold text-red-800">
              {error}
            </section>
          )}

          {children}
        </main>
      </div>
    </ProfileProvider>
  );
}
export default ProfileLayout;
