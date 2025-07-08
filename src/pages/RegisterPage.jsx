import { RegisterForm } from "@/components/RegisterForm";
import React from "react";

export default function RegisterPage() {
  return (
    <div className="bg-muted flex min-h-svh flex-col items-center justify-center p-6 md:p-10">
      <div className="w-full max-w-4xl">
        <RegisterForm />
      </div>
    </div>
  );
}
