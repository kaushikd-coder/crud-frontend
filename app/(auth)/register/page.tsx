"use client";
import React from "react";
import RegisterForm from "@/components/auth/RegisterForm";


export default function RegisterPage() {
  return (
    <div className="min-h-[100dvh] flex items-center justify-center px-4 sm:px-6 border-[var(--panel-border)] bg-[var(--panel)] text-[var(--foreground)]">
      <div className="w-full max-w-sm sm:max-w-md md:max-w-lg rounded-2xl border  shadow-xl p-5 sm:p-6 md:p-8 border-[var(--panel-border)] bg-[var(--panel)] text-[var(--foreground)]">
        <h1 className="text-xl sm:text-2xl font-semibold tracking-tight">Create your account</h1>
        <p className="text-xs sm:text-sm text-gray-500 mt-1">Join us in a minute</p>
        <div className="mt-5 sm:mt-6">
          <RegisterForm />
        </div>
      </div>
    </div>
  );
}