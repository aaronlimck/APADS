import { Button } from "@/components/ui/button";
import Link from "next/link";

export default function ErrorComponent({
  title,
  message,
}: {
  title: string;
  message: string;
}) {
  return (
    <main className="h-dvh w-full flex flex-col items-center justify-center">
      <div className="flex flex-col items-center text-center space-y-3">
        <div className="space-y-2">
          <h1 className="text-lg font-medium">{title}</h1>
          <p className="text-muted-foreground max-w-md text-balance">
            {message}
          </p>
        </div>
        <Button
          variant="ghost"
          className="font-normal text-muted-foreground hover:bg-transparent hover:font-medium"
        >
          <Link href="/">Back Home</Link>
        </Button>
      </div>
    </main>
  );
}
