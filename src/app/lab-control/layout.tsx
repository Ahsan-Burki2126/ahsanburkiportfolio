import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Lab Control | Admin Dashboard",
  robots: "noindex, nofollow",
};

export default function LabControlLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
