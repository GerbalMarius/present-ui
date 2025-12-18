
"use client";

import { DeskData, UserData } from "../lib/types";
import DeskCard from "./DeskCard";

export default function DeskGrid({
  desks,
  me,
}: {
  desks: DeskData[];
  me: UserData | null;
}) {
  return (
    <section className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
      {desks.map((desk) => (
        <DeskCard key={desk.id} desk={desk} me={me} />
      ))}
    </section>
  );
}