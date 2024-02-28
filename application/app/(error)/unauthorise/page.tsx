import { Button } from "@/components/ui/button";
import Link from "next/link";

export default function UnauthorisedPage() {
  return (
    <div className="h-dvh w-full flex flex-col items-center justify-center">
      <div className="flex flex-col items-center text-center space-y-3">
        <div className="space-y-0.5">
          <h1>Unauthorised</h1>
          <p>You are not authorised to access this page</p>
        </div>
        <Button
          variant="ghost"
          className="font-normal text-muted-foreground hover:bg-transparent hover:font-medium"
        >
          <Link href="/">Back Home</Link>
        </Button>
      </div>
    </div>
  );
}
