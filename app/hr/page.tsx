import { authConfig } from "@/lib/auth.config";
import { getServerSession } from "next-auth";

export default async function HRPage() {
  const session = await getServerSession(authConfig);
  console.log(session);
  return (
    <div className="min-h-screen max-w-7xl mx-auto p-4 md:p-6 space-y-4">
      <h1 className="text-3xl font-semibold tracking-tight select-none">
        Home
      </h1>
      <p>Coming Soon</p>
    </div>
  );
}
