"use client";

import { useEffect, useMemo, useState } from "react";
import { useRouter, usePathname } from "next/navigation";
import { CurrentUserReservations, ReservationData, UserData } from "../lib/types";
import { ApiError, backend } from "../lib/api";
import Spinner from "../ui/Spinner";
import DashboardSidebar from "../ui/DashboardSidebar";
import ReservationTable from "../ui/ReservationTable";



 const ProfilePage = () => {
    const router = useRouter();
    const path = usePathname();

    const [me, setMe] = useState<UserData | null>(null);
    const [res, setRes] = useState<CurrentUserReservations | null>(null);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        (async () => {
            try {
                const [u, r] = await Promise.all([backend.getMe(), backend.getMeReservations()]);
                setMe(u);
                setRes(r);
            } catch (e: any) {
                const apiErr = e as ApiError;
                setError(apiErr?.messages?.[0] ?? apiErr?.err?.message ?? "Failed to load profile.");
            }
        })();
    }, []);

    const avatarText = () => {
        if (!me) return "?";
        return `${me.firstName?.[0] ?? "?"}${me.lastName?.[0] ?? "?"}`.toUpperCase();
    }

    const sidebarLinks = [
        {
            id: "profile",
            label: "Profile",
            iconSrc: "/img/account.svg",
            active: path === "/profile",
            onClick: () => router.push("/profile"),
        },
    ];

    if (!me || !res) return <Spinner />;

    return (
        <div className="min-h-screen flex">
            <DashboardSidebar
                title="Profile"
                subtitle="Your reservations"
                avatarText={avatarText()}
                links={sidebarLinks}
                onExit={() => router.push("/")}
                exitLabel="Exit"
            />

            <main className="flex-1 max-w-6xl mx-auto px-4 sm:px-6 py-8">
                {/* Header */}
                <section className="rounded-3xl bg-white/80 backdrop-blur border border-red-100 shadow-xl p-6">
                    {error && (
                        <div className="mb-4 rounded-2xl border border-red-200 bg-red-50 p-4 text-sm font-semibold text-red-800">
                            {error}
                        </div>
                    )}

                    <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-4">
                        <div>
                            <div className="text-sm font-extrabold text-red-700">Welcome back!</div>

                            <h1 className="mt-1 text-3xl md:text-4xl font-black tracking-tight text-slate-900">
                                {me.firstName} {me.lastName}
                            </h1>

                            <p className="mt-1 text-sm font-semibold text-slate-600">{me.email}</p>
                        </div>

                        <button
                            onClick={() => router.push("/")}
                            className="md:hidden inline-flex items-center justify-center rounded-2xl px-5 py-3
                            text-sm font-extrabold bg-red-700 text-white shadow-lg hover:bg-red-600 transition
                            hover:cursor-pointer"
                        >
                            Exit
                        </button>
                    </div>
                </section>

                <section className="mt-6 grid gap-6 lg:grid-cols-2">
                    <ReservationTable
                        title="Current reservations"
                        rows={res.currentReservations}
                        emptyText="No current reservations."
                    />
                    <ReservationTable
                        title="Past reservations"
                        rows={res.pastReservations}
                        emptyText="No past reservations yet."
                    />
                </section>
            </main>
        </div>
    );
}

export default ProfilePage;