"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Eye, EyeOff, LogIn } from "lucide-react";
import { Button } from "@/components/shadcn-ui/button";
import { Input } from "@/components/shadcn-ui/input";
import { Checkbox } from "@/components/shadcn-ui/checkbox";
import { Label } from "@/components/shadcn-ui/label";

export default function SignInPage() {
  const router = useRouter();
  const [showPassword, setShowPassword] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [rememberMe, setRememberMe] = useState(true);
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 1000));
    console.log("Sign in:", { email, password, rememberMe });
    setIsLoading(false);
    router.push("/");
  };

  return (
    <div className="w-full max-w-md">
      <div className="relative">
        {/* Decorative dots pattern - top left */}
        <div className="absolute -top-10 -left-15 hidden grid-cols-10 gap-3 lg:grid">
          {Array.from({ length: 100 }).map((_, i) => (
            <div key={i} className="h-1 w-1 rounded-full bg-white/80" />
          ))}
        </div>

        {/* Decorative dots pattern - bottom right */}
        <div className="absolute -right-20 -bottom-10 hidden grid-cols-10 gap-3 lg:grid">
          {Array.from({ length: 100 }).map((_, i) => (
            <div key={i} className="h-1 w-1 rounded-full bg-white/80" />
          ))}
        </div>
        {/* Card */}
        <div className="relative rounded-2xl bg-white p-8 shadow-xl">
          <div className="mb-8 text-center">
            <h1 className="text-foreground mb-2 text-2xl font-bold">
              Sign in to your account
            </h1>
            <p className="text-muted-foreground text-sm">
              This is the first time to use Dizim.ai?{" "}
              <Link
                href="/signup"
                className="text-rose font-medium hover:underline"
              >
                Sign up now.
              </Link>
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-2">
              <Input
                type="email"
                placeholder="Email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="bg-muted/50 border-border h-12 rounded-lg"
                required
              />
            </div>

            <div className="space-y-2">
              <div className="relative">
                <Input
                  type={showPassword ? "text" : "password"}
                  placeholder="Password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="bg-muted/50 border-border h-12 rounded-lg pr-12"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="text-muted-foreground hover:text-foreground absolute top-1/2 right-4 -translate-y-1/2"
                  aria-label={showPassword ? "Hide password" : "Show password"}
                >
                  {showPassword ? (
                    <EyeOff className="h-5 w-5" />
                  ) : (
                    <Eye className="h-5 w-5" />
                  )}
                </button>
              </div>
            </div>

            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Checkbox
                  id="remember"
                  checked={rememberMe}
                  onCheckedChange={(checked) =>
                    setRememberMe(checked as boolean)
                  }
                  className="data-[state=checked]:bg-azure data-[state=checked]:border-azure"
                />
                <Label
                  htmlFor="remember"
                  className="text-foreground cursor-pointer text-sm"
                >
                  Remember me
                </Label>
              </div>
              <Link
                href="/forgot-password"
                className="text-rose text-sm hover:underline"
              >
                Forgot Password?
              </Link>
            </div>

            <Button
              type="submit"
              disabled={isLoading}
              className="bg-foreground hover:bg-foreground/90 h-12 w-full rounded-full text-white"
            >
              <LogIn className="mr-2 h-5 w-5" />
              {isLoading ? "Signing in..." : "Đăng nhập"}
            </Button>
          </form>
        </div>
      </div>
    </div>
  );
}
