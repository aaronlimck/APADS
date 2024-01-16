"use client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { signIn } from "next-auth/react";
import { FormEvent } from "react";

export default function LoginForm() {
  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const formData = new FormData(event.currentTarget);

    const payload = {
      email: formData.get("email"),
      password: formData.get("password")
    };

    const response = await signIn("credentials", {
      ...payload,
      callbackUrl: "/"
    });
    console.log(response);
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
