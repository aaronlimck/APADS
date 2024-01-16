import { authConfig } from "@/lib/auth.config";
import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";

export default async function Home() {
  const session = await getServerSession(authConfig);

  if (session?.user?.role === "ADMIN") {
    redirect("/hr");
  }
  if (session?.user?.role === "MANAGER") {
    redirect("/manager");
  }
  if (session?.user?.role === "STAFF") {
    redirect("/staff");
  }
}
