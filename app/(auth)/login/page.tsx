import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

export default function LoginPage() {
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
          <form>
            <div className="grid gap-2">
              <Input
                type="email"
                className="h-9 py-1 transition-colors"
                placeholder="Email"
                autoCapitalize="none"
                autoComplete="email"
                autoCorrect="off"
              />
              <Input
                type="password"
                className="h-9 py-1 transition-colors"
                placeholder="Enter your password"
              />
              <Button size="sm">Sign In</Button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
