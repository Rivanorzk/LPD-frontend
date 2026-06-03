"use client";

import { Suspense } from "react";
import CreateReportPage from "./createReport";

export default function Page() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <CreateReportPage />
    </Suspense>
  );
}