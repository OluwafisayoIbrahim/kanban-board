"use client"
import React, { Suspense } from "react";
import AuthForm from "../components/AuthForm";
import { useSearchParams } from "next/navigation";

const SignUpContent = () => {
  const searchParams = useSearchParams();
  const type = (searchParams.get("type") as "signin" | "signup") || "signup";
  return <AuthForm type={type} />;
};
const SignUp = () => {
  return (
    <Suspense>
      <SignUpContent />
    </Suspense>
  );
};

export default SignUp;
