"use client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { signIn } from "next-auth/react";
import { useRouter, useSearchParams } from "next/navigation";
import { FormEvent } from "react";
import { toast } from "sonner";

export default function LoginForm() {
  const searchParams = useSearchParams();
  const callbackUrl = searchParams.get("callbackUrl") || "/"; // Default to homepage
  const router = useRouter();

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const formData = new FormData(event.currentTarget);

    const payload = {
      email: formData.get("email"),
      password: formData.get("password")
    };

    const response = await signIn("credentials", {
      ...payload,
      redirect: false
    });

    if (response && response.status === 200 && response.ok)
      router.replace(callbackUrl);

    if (response && response.status === 401)
      toast.error("Invalid email or password");
  };

  return (
    <form className="grid gap-2" onSubmit={handleSubmit}>
      <Input id="email" name="email" type="email" placeholder="Enter Email" />
      <Input
        id="password"
        name="password"
        type="password"
        placeholder="Enter Password"
      />
      <Button>Sign In</Button>
    </form>
  );
}
