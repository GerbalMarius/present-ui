"use client";

import { useEffect, useState } from "react";
import { DeskData, UserData } from "./lib/types";
import { backend } from "./lib/api";
import NavBar from "./ui/NavBar";
import Spinner from "./ui/Spinner";
import DeskGrid from "./ui/DeskGrid";
import AccountInfo from "./ui/AccountInfo";

export default function Home() {
  const [desks, setDesks] = useState<DeskData[]>([]);
  const [me, setMe] = useState<UserData | null>(null);
  const [error, setError] = useState<string | null>(null);

  const [isLoading, setIsLoading] = useState<boolean>(true)

  useEffect(() => {
    (async () => {
      try {
        const [d, u] = await Promise.all([backend.getDesks(), backend.getMe()]);
        setDesks(d);
        setMe(u);
        setIsLoading(false);
      } catch (e: any) {
        setIsLoading(false);
        setError(e?.messages?.[0] ?? e?.err?.message ?? "Failed to load data.");
      }
    })();
  }, []);

  return (
    <>
      <NavBar
        links={[
          { label: "Desks", href: "/" },
          { label: "Profile", href: "/profile" },
        ]}
        showButton={false}
        brandName="Deski"
        logoSrc="/img/logo.svg"
      />

      <main className="max-w-6xl mx-auto px-4 sm:px-6 pb-16">
        {/* Header card */}
        <section className="mt-6 rounded-3xl bg-white/80 backdrop-blur border border-red-100 shadow-xl p-6">
          <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-4">
            <div>
              <h1 className="text-3xl md:text-4xl font-extrabold tracking-tight text-slate-900">
                Shared desks
              </h1>
              <p className="text-sm md:text-base text-slate-600 mt-1">
                Desks are color-coded by status. Hover reserved desks to see who reserved them.
              </p>
            </div>
            {me && <AccountInfo {...me} /> }
          </div>
        </section>

        <section className="mt-6">
          {error && (
            <div className="mb-4 rounded-2xl border border-red-200 bg-red-50 p-4 text-sm text-red-800">
              {error}
            </div>
          )}

          {isLoading ? (
            <Spinner />
          ) : (
            <DeskGrid desks={desks} me={me} />
          )}
        </section>

        {/* Legend */}
        <section className="mt-6 rounded-3xl bg-white/70 backdrop-blur border border-red-100 shadow-sm p-5">
          <h2 className="text-lg font-bold text-slate-900">Legend</h2>
          <div className="mt-3 grid gap-3 sm:grid-cols-3 text-sm">
            <div className="flex items-center gap-3">
              <span className="h-3 w-3 rounded-full bg-emerald-400" />
              <span className="text-slate-700">Open</span>
            </div>
            <div className="flex items-center gap-3">
              <span className="h-3 w-3 rounded-full bg-red-400" />
              <span className="text-slate-700">Reserved</span>
            </div>
            <div className="flex items-center gap-3">
              <span className="h-3 w-3 rounded-full bg-slate-400" />
              <span className="text-slate-700">Maintenance</span>
            </div>
          </div>
        </section>
      </main>
    </>
  );
}
