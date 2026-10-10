"use client";

import dynamic from "next/dynamic";

const Dashboard = dynamic(() => import("./Dashboard"), {
  ssr: false,
  loading: () => (
    <main style={{ padding: "40px", textAlign: "center" }}>
      Loading your dashboard...
    </main>
  ),
});

export default function ClientOnlyDashboard() {
  return <Dashboard />;
}