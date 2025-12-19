"use client";

import DeskCard from "./DeskCard";
import type { DeskData, UserData } from "../lib/types";

const DeskGrid = ({
  desks,
  me,
  onChanged,
}: {
  desks: DeskData[];
  me: UserData | null;
  onChanged?: () => Promise<void> | void;
}) => {
  return (
    <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
      {desks.map((desk) => (
        <DeskCard key={desk.id} desk={desk} me={me} onChanged={onChanged} />
      ))}
    </div>
  );
}

export default DeskGrid;
