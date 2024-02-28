import LoginForm from "@/components/form/login-form";

export default function LoginPage() {
  return (
    <div className="flex min-h-dvh w-screen items-center justify-center bg-gray-50">
      <div className="z-10 w-full max-w-md overflow-hidden rounded-2xl sm:border sm:border-gray-100 sm:shadow-xl space-y-2 p-8 sm:p-12">
        <div>
          <h3 className="text-xl font-semibold mb-2">Sign In</h3>
          <p className="text-sm text-gray-500 mb-6">
            Use your email and password to sign in
          </p>
        </div>
        <LoginForm />
      </div>
    </div>
  );
}
