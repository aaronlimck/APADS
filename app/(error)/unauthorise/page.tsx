import { buttonVariants } from "@/components/ui/button";
import Link from "next/link";

export default function Unauthorised() {
  return (
    <div className="flex flex-col items-center justify-center w-full h-screen space-y-6">
      <div className="text-center space-y-1">
        <h1 className="text-3xl font-bold text-gray-800">Unauthorised</h1>
        <p className="text-gray-600">
          You are not authorised to view this page.
        </p>
      </div>
      <Link className={buttonVariants({ variant: "outline" })} href="/">
        Home
      </Link>
    </div>
  );
}
