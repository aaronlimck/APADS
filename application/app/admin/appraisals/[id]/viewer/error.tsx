"use client";

import { Button } from "@/components/ui/button";
import Link from "next/link";
import { useEffect } from "react";

export default function ErrorPage({ error }: { error: Error }) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <div className="flex min-h-dvh w-full flex-col items-center justify-center">
      <h2>Something went wrong</h2>
      <Button asChild>
        <Link href="/admin/appraisals">Go back</Link>
      </Button>
    </div>
  );
}
