"use client";

import { useState } from "react";
import { GoogleIcon, XeroIcon, IntuitIcon } from "../../components/icons";
import LeftIllustration from "@/app/components/Illustrations/LeftIllustration";
import RightIllustration from "@/app/components/Illustrations/RightIllustration";

export default function SignInPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [remember, setRemember] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  function handleSubmit(e) {
    e.preventDefault();
    setSubmitting(true);
    window.setTimeout(() => setSubmitting(false), 900);
  }

  return (
    <main className="min-h-screen w-full bg-[#EEF1EF] flex items-center justify-center px-3 py-6 sm:px-6 sm:py-10">
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

          {/* Sign-in card, always centered and the primary element */}
          <div className="flex w-full justify-center lg:w-auto lg:shrink-0">
            <div className="w-full max-w-[420px] rounded-xl bg-white p-7 shadow-[0_1px_2px_rgba(31,42,46,0.06),0_8px_24px_-8px_rgba(31,42,46,0.12)] sm:p-9">
              {/* Logo */}
              <div className="mb-7 flex items-center gap-2">
                <span className="text-[28px] font-extrabold tracking-tight text-[#F45D48]">
                  gusto
                </span>
              </div>

              <h1 className="text-[22px] font-bold leading-tight text-[#1F2A2E] sm:text-[24px]">
                Welcome back to Gusto.
              </h1>
              <p className="mt-1.5 text-[14px] text-[#6B7573]">
                New here?{" "}
                <a
                  href="#"
                  className="font-medium text-[#2E6E71] underline underline-offset-2 hover:text-[#24585B]"
                >
                  Create an account
                </a>
                .
              </p>

              <form className="mt-6 space-y-4" onSubmit={handleSubmit}>
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
                    className="w-full rounded-md border border-[#DCE3E1] bg-white px-3.5 py-2.5 text-[15px] text-[#1F2A2E] outline-none transition-colors placeholder:text-[#6B7573]/60 focus:border-[#2E6E71] focus:ring-2 focus:ring-[#2E6E71]/20"
                  />
                </div>

                <div>
                  <div className="mb-1.5 flex items-center justify-between gap-2">
                    <label
                      htmlFor="password"
                      className="block text-[13px] font-medium text-[#1F2A2E]"
                    >
                      Password
                    </label>
                    <a
                      href="#"
                      className="text-[13px] font-medium text-[#2E6E71] underline underline-offset-2 hover:text-[#24585B]"
                    >
                      Forgot your password?
                    </a>
                  </div>
                  <input
                    id="password"
                    type="password"
                    autoComplete="current-password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full rounded-md border border-[#DCE3E1] bg-white px-3.5 py-2.5 text-[15px] text-[#1F2A2E] outline-none transition-colors focus:border-[#2E6E71] focus:ring-2 focus:ring-[#2E6E71]/20"
                  />
                </div>

                <label className="flex cursor-pointer items-center gap-2.5 pt-1 select-none">
                  <input
                    type="checkbox"
                    checked={remember}
                    onChange={(e) => setRemember(e.target.checked)}
                    className="h-4 w-4 rounded border-[#DCE3E1] text-[#2E6E71] focus:ring-2 focus:ring-[#2E6E71]/30"
                  />
                  <span className="text-[14px] text-[#1F2A2E]">
                    Remember this device
                  </span>
                </label>

                <button
                  type="submit"
                  disabled={submitting}
                  className="mt-2 w-full rounded-md bg-[#2E6E71] py-2.5 text-[15px] font-semibold text-white transition-colors hover:bg-[#24585B] disabled:opacity-70"
                >
                  {submitting ? "Signing in…" : "Sign in"}
                </button>
              </form>

              <div className="my-6 flex items-center gap-3">
                <div className="h-px flex-1 bg-[#DCE3E1]" />
                <span className="text-[12px] text-[#6B7573]">or sign in with</span>
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
                    <XeroIcon />
                    Xero
                  </button>
                  <button
                    type="button"
                    className="flex w-1/2 items-center justify-center gap-2 rounded-md border border-[#DCE3E1] bg-white py-2.5 text-[14px] font-medium text-[#1F2A2E] transition-colors hover:bg-[#F5F6F4]"
                  >
                    <IntuitIcon />
                    Intuit
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