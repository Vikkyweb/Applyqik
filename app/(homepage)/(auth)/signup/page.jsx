"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { FaFacebook, FaLinkedin } from "react-icons/fa";
import { GoogleIcon } from "../../../../components/icons";
import LeftIllustration from "@/components/Illustrations/LeftIllustration";
import RightIllustration from "@/components/Illustrations/RightIllustration";
import { useAuth } from "@/context/AuthContext";
import Button from "@/components/ui/Button";

export default function SignUpPage() {
  const router = useRouter();
  const { register } = useAuth();

  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [remember, setRemember] = useState(false);

  const [error, setError] = useState("");
  const [fieldErrors, setFieldErrors] = useState({});
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e) {
    e.preventDefault();
    setError("");
    setFieldErrors({});
    setLoading(true);
    try {
      // Backend expects a single `name` — combine the two inputs.
      const name = `${firstName} ${lastName}`.trim();
      
      await register(name, email, password);
      // New accounts go into onboarding to build their career agent.
      router.push("/onboarding");
    } catch (err) {
      if (err.errors) setFieldErrors(err.errors);
      else setError(err.message || "Registration failed.");
    } finally {
      setLoading(false);
    }
  }

  // Helper: pull the first message for a field out of the API error bag.
  const fieldError = (key) => {
    const v = fieldErrors[key];
    return Array.isArray(v) ? v[0] : v;
  };

  return (
    <main className="min-h-screen w-full bg-background flex items-center justify-center px-3 py-6 sm:px-6 sm:py-10">
      <div
        className="
          w-full max-w-[420px]
          sm:max-w-[560px] sm:rounded-2xl sm:bg-[#F5F6F4] sm:p-6 sm:shadow-[0_10px_40px_-12px_rgba(31,42,46,0.18)]
          lg:max-w-[1180px] lg:overflow-hidden lg:p-0 lg:px-6 lg:pt-10
        "
      >
        <div
          className="
            flex flex-col items-center
            lg:flex-row lg:items-end lg:justify-center lg:gap-4 xl:gap-12
          "
        >
          {/* Left illustration: hidden below lg so the card stays the focus on small screens */}
          <div className="hidden h-[420px] shrink-0 lg:flex lg:w-[300px] lg:items-end lg:justify-center xl:w-[360px]">
            <LeftIllustration />
          </div>

          {/* Sign-up card, always centered and the primary element */}
          <div className="flex w-full justify-center lg:w-auto lg:shrink-0">
            <div className="w-full max-w-[420px] rounded-xl bg-white p-7 shadow-[0_1px_2px_rgba(31,42,46,0.06),0_8px_24px_-8px_rgba(31,42,46,0.12)] sm:p-9">
              {/* Logo */}
              <div className="mb-7 flex items-center gap-2">
                <span className="text-[28px] font-extrabold tracking-tight text-primary">
                  Applyqik
                </span>
              </div>

              <h1 className="text-[22px] font-bold leading-tight text-[#1F2A2E] sm:text-[24px]">
                Create your Applyqik account.
              </h1>
              <p className="mt-1.5 text-[14px] text-[#6B7573]">
                Already have an account?{" "}
                <Link
                  href="/signin"
                  className="font-medium text-accent underline underline-offset-2 hover:text-secondary"
                >
                  Sign in
                </Link>
                .
              </p>

              <form className="mt-6 space-y-4" onSubmit={handleSubmit}>
                <div>
                  <label
                    htmlFor="firstName"
                    className="mb-1.5 block text-[13px] font-medium text-[#1F2A2E]"
                  >
                    First name
                  </label>
                  <input
                    id="firstName"
                    type="text"
                    autoComplete="given-name"
                    value={firstName}
                    onChange={(e) => setFirstName(e.target.value)}
                    required
                    className="w-full rounded-md border border-[#DCE3E1] bg-white px-3.5 py-2.5 text-[15px] text-[#1F2A2E] outline-none transition-colors placeholder:text-[#6B7573]/60 focus:border-primary focus:ring-2 focus:ring-primary/20"
                  />
                </div>

                <div>
                  <label
                    htmlFor="lastName"
                    className="mb-1.5 block text-[13px] font-medium text-[#1F2A2E]"
                  >
                    Last name
                  </label>
                  <input
                    id="lastName"
                    type="text"
                    autoComplete="family-name"
                    value={lastName}
                    onChange={(e) => setLastName(e.target.value)}
                    required
                    className="w-full rounded-md border border-[#DCE3E1] bg-white px-3.5 py-2.5 text-[15px] text-[#1F2A2E] outline-none transition-colors placeholder:text-[#6B7573]/60 focus:border-primary focus:ring-2 focus:ring-primary/20"
                  />
                </div>

                <div>
                  <label
                    htmlFor="email"
                    className="mb-1.5 block text-[13px] font-medium text-[#1F2A2E]"
                  >
                    Email
                  </label>
                  <input
                    id="email"
                    type="email"
                    autoComplete="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                    className="w-full rounded-md border border-[#DCE3E1] bg-white px-3.5 py-2.5 text-[15px] text-[#1F2A2E] outline-none transition-colors placeholder:text-[#6B7573]/60 focus:border-primary focus:ring-2 focus:ring-primary/20"
                  />
                  {fieldError("email") && (
                    <p className="mt-1 text-[12px] text-red-600">{fieldError("email")}</p>
                  )}
                </div>

                <div>
                  <div className="mb-1.5 flex items-center justify-between gap-2">
                    <label
                      htmlFor="password"
                      className="block text-[13px] font-medium text-[#1F2A2E]"
                    >
                      Password
                    </label>
                  </div>
                  <input
                    id="password"
                    type="password"
                    autoComplete="new-password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                    minLength={8}
                    className="w-full rounded-md border border-[#DCE3E1] bg-white px-3.5 py-2.5 text-[15px] text-[#1F2A2E] outline-none transition-colors focus:border-primary focus:ring-2 focus:ring-primary/20"
                  />
                  {fieldError("password") && (
                    <p className="mt-1 text-[12px] text-red-600">{fieldError("password")}</p>
                  )}
                </div>

                <label className="flex cursor-pointer items-center gap-2.5 pt-1 select-none">
                  <input
                    type="checkbox"
                    checked={remember}
                    onChange={(e) => setRemember(e.target.checked)}
                    className="h-4 w-4 rounded border-[#DCE3E1] text-primary focus:ring-2 focus:ring-primary/30"
                  />
                  <span className="text-[14px] text-[#1F2A2E]">Remember this device</span>
                </label>

                {error && (
                  <p className="rounded-lg bg-red-500/8 px-3 py-2 text-sm text-red-600">{error}</p>
                )}

                <Button
                  type="submit"
                  variant="accent"
                  loading={loading}
                  className="w-full text-center rounded-md bg-primary py-2.5 text-[15px] font-semibold text-white transition-colors hover:bg-secondary disabled:opacity-70 cursor-pointer"
                >
                  Create account
                </Button>
              </form>

              <div className="my-6 flex items-center gap-3">
                <div className="h-px flex-1 bg-[#DCE3E1]" />
                <span className="text-[12px] text-[#6B7573]">or sign up with</span>
                <div className="h-px flex-1 bg-[#DCE3E1]" />
              </div>

              <div className="space-y-2.5">
                <button
                  type="button"
                  className="flex w-full items-center justify-center gap-2.5 rounded-md border border-[#DCE3E1] bg-white py-2.5 text-[14px] font-medium text-[#1F2A2E] transition-colors hover:bg-[#F5F6F4]"
                >
                  <GoogleIcon />
                  Google
                </button>

                <div className="flex gap-2.5">
                  <button
                    type="button"
                    className="flex w-1/2 items-center justify-center gap-2 rounded-md border border-[#DCE3E1] bg-white py-2.5 text-[14px] font-medium text-[#1F2A2E] transition-colors hover:bg-[#F5F6F4]"
                  >
                    <FaFacebook />
                    Facebook
                  </button>
                  <button
                    type="button"
                    className="flex w-1/2 items-center justify-center gap-2 rounded-md border border-[#DCE3E1] bg-white py-2.5 text-[14px] font-medium text-[#1F2A2E] transition-colors hover:bg-[#F5F6F4]"
                  >
                    <FaLinkedin />
                    LinkedIn
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* Right illustration */}
          <div className="hidden h-[420px] shrink-0 lg:flex lg:w-[300px] lg:items-end lg:justify-center xl:w-[360px]">
            <RightIllustration />
          </div>
        </div>
      </div>
    </main>
  );
}