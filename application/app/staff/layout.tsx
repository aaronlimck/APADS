import { getUserById } from "@/actions/user.action";
import { authConfig } from "@/auth.config";
import NavBar from "@/components/navigation/navbar";
import { getServerSession } from "next-auth";
import React from "react";

export default async function StaffLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await getServerSession(authConfig);
  let isArchived = null;

  if (session) {
    const userResponse = await getUserById(session?.user?.id!);
    isArchived = userResponse.data?.isArchived;
  }

  if (isArchived) {
    return <div>Account is disabled</div>;
  }

  return (
    <div className="flex min-h-dvh flex-col">
      <NavBar />
      {children}
    </div>
  );
}
