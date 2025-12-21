"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useProfile } from "../ProfileContext";
import { CurrentUserReservations } from "@/app/lib/types";
import { ApiError, backend } from "@/app/lib/api";
import Spinner from "@/app/ui/Spinner";
import ReservationTable from "@/app/ui/ReservationTable";


const AboutPage = () => {
  const router = useRouter();
  const { me } = useProfile();

  const [res, setRes] = useState<CurrentUserReservations | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    (async () => {
      try {
        const reservations = await backend.getMeReservations();
        setRes(reservations);
      } catch (e: any) {
        const apiErr = e as ApiError;
        setError(apiErr?.messages?.[0] ?? apiErr?.err?.message ?? "Failed to load reservations.");
      }
    })();
  }, []);

  if (!res) return <Spinner />;

  return (
    <>
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
    </>
  );
}

export default AboutPage;
