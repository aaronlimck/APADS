"use client";
import { useRouter, useSearchParams } from "next/navigation";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import { Label } from "../ui/label";
import { signIn } from "next-auth/react";
import { toast } from "sonner";

export default function LoginForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const callbackUrl = searchParams.get("callbackUrl") || "/"; // Default to homepage

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const payload = {
      email: event.currentTarget.email.value,
      password: event.currentTarget.password.value,
    };

    // alert(JSON.stringify(payload, null, 2));
    const response = await signIn("credentials", {
      ...payload,
      redirect: false,
    });
    if (response && response.status === 200 && response.ok) {
      router.replace(callbackUrl);
    }

    if (response && response.status === 401) {
      toast.error("Invalid email or password");
    }
  };

  return (
    <form className="w-full space-y-6" onSubmit={handleSubmit}>
      <div className="space-y-4">
        <div className="grid w-full items-center gap-1.5">
          <Label htmlFor="email">Email</Label>
          <Input
            type="email"
            id="email"
            placeholder="Enter your email"
            className="focus-visible:ring-0 focus-visible:ring-offset-0 focus-visible:border-gray-500 focus-visible:border-[1.5px]"
          />
        </div>

        <div className="grid w-full items-center gap-1.5">
          <Label htmlFor="password">Password</Label>
          <Input
            type="password"
            id="password"
            placeholder="Enter your password"
            className="focus-visible:ring-0 focus-visible:ring-offset-0 focus-visible:border-gray-500 focus-visible:border-[1.5px]"
          />
        </div>
      </div>

      <Button type="submit" className="w-full">
        Sign In
      </Button>
    </form>
  );
}
