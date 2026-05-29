"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Eye, EyeOff, LogIn, ChevronDown } from "lucide-react";
import { Button } from "@/components/shadcn-ui/button";
import { Input } from "@/components/shadcn-ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/shadcn-ui/select";

const userTypes = [
  "Individual Creator",
  "Small Business Owner",
  "Marketing Agency",
  "Enterprise",
  "Student",
  "Other",
];

export default function SignUpPage() {
  const router = useRouter();
  const [showPassword, setShowPassword] = useState(false);
  const [formData, setFormData] = useState({
    email: "",
    password: "",
    name: "",
    phone: "",
    userType: "",
  });
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 1000));
    console.log("Sign up:", formData);
    setIsLoading(false);
    router.push("/signin");
  };

  const updateField = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
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
              Create Your Account
            </h1>
            <p className="text-muted-foreground text-sm">
              14-day trial with essential features &amp; no credit card
              required.
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <Input
              type="email"
              placeholder="Email *"
              value={formData.email}
              onChange={(e) => updateField("email", e.target.value)}
              className="bg-muted/50 border-border h-12 rounded-lg"
              required
            />

            <div className="relative">
              <Input
                type={showPassword ? "text" : "password"}
                placeholder="Password *"
                value={formData.password}
                onChange={(e) => updateField("password", e.target.value)}
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

            <Input
              type="text"
              placeholder="Your name *"
              value={formData.name}
              onChange={(e) => updateField("name", e.target.value)}
              className="bg-muted/50 border-border h-12 rounded-lg"
              required
            />

            <Input
              type="tel"
              placeholder="Phone Number"
              value={formData.phone}
              onChange={(e) => updateField("phone", e.target.value)}
              className="bg-muted/50 border-border h-12 rounded-lg"
            />

            <Select
              value={formData.userType}
              onValueChange={(value) => updateField("userType", value)}
            >
              <SelectTrigger className="bg-muted/50 border-border h-12 rounded-lg">
                <SelectValue placeholder="What best describes you? *" />
              </SelectTrigger>
              <SelectContent>
                {userTypes.map((type) => (
                  <SelectItem
                    key={type}
                    value={type.toLowerCase().replace(/ /g, "-")}
                  >
                    {type}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            <p className="text-muted-foreground text-center text-sm">
              By signing up, you agree to our{" "}
              <Link href="/terms" className="text-rose hover:underline">
                terms of services
              </Link>{" "}
              and{" "}
              <Link href="/privacy" className="text-rose hover:underline">
                privacy policy
              </Link>
            </p>

            <Button
              type="submit"
              disabled={isLoading}
              className="bg-foreground hover:bg-foreground/90 h-12 w-full rounded-full text-white"
            >
              <LogIn className="mr-2 h-5 w-5" />
              {isLoading ? "Creating account..." : "Sign Up"}
            </Button>

            <p className="text-rose text-center text-sm">
              <Link href="/signin" className="hover:underline">
                I already have an account
              </Link>
            </p>
          </form>
        </div>
      </div>
    </div>
  );
}
