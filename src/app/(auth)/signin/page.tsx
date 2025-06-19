"use client";
import React, { Suspense } from "react";
import AuthForm from "../components/AuthForm";
import { useSearchParams } from "next/navigation";

const SignInContent = () => {
  const searchParams = useSearchParams();
  const type = (searchParams.get("type") as "signin" | "signup") || "signin";
  return <AuthForm type={type} />;
};

const SignIn = () => {
  return (
    <Suspense>
      <SignInContent />
    </Suspense>
  );
};

export default SignIn;
