import { getServerSession } from "next-auth";
import { authConfig } from "@/lib/auth.config";
import LoginForm from "./form";
import { redirect } from "next/navigation";

export default async function LoginPage() {
  const session = await getServerSession(authConfig);
  if (session) {
    redirect("/");
  }

  return (
    <div className="h-screen w-full flex justify-center items-center">
      <div className="mx-auto flex w-full flex-col justify-center space-y-6 sm:w-[350px]">
        <div className="flex flex-col space-y-2 text-center">
          <h1 className="text-2xl font-semibold tracking-tight">Sign In</h1>
          <p className="text-sm text-muted-foreground">
            Enter your email below to login your account
          </p>
        </div>
        <div className="grid gap-6">
          <LoginForm />
        </div>
      </div>
    </div>
  );
}
