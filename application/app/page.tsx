import { authConfig } from "@/auth.config";
import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";

export default async function Home() {
  const session = await getServerSession(authConfig);

  if (session?.user?.role === "ADMIN") {
    redirect("/admin/employees");
  }
  if (session?.user?.role === "MANAGER") {
    redirect("/manager");
  }
  if (session?.user?.role === "STAFF") {
    redirect("/staff");
  }
}
