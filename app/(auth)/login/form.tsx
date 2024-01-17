"use client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Loader2 } from "lucide-react";
import { signIn } from "next-auth/react";
import { useRouter, useSearchParams } from "next/navigation";
import { FormEvent, useState } from "react";
import { toast } from "sonner";

export default function LoginForm() {
  const searchParams = useSearchParams();
  const callbackUrl = searchParams.get("callbackUrl") || "/"; // Default to homepage
  const router = useRouter();

  const [isLoading, setIsLoading] = useState<boolean>(false);

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const formData = new FormData(event.currentTarget);
    setIsLoading(true);

    const payload = {
      email: formData.get("email"),
      password: formData.get("password")
    };

    const response = await signIn("credentials", {
      ...payload,
      redirect: false
    });

    if (response && response.status === 200 && response.ok) {
      router.replace(callbackUrl);
    }

    if (response && response.status === 401) {
      setIsLoading(false); // Reset loading state
      toast.error("Invalid email or password");
    }
  };

  return (
    <form className="grid gap-2 p-4" onSubmit={handleSubmit}>
      <Input id="email" name="email" type="email" placeholder="Enter Email" />
      <Input
        id="password"
        name="password"
        type="password"
        placeholder="Enter Password"
      />
      <Button className="space-x-2" disabled={isLoading}>
        {isLoading && <Loader2 size={20} className="animate-spin" />}
        <span>Sign In</span>
      </Button>
    </form>
  );
}
