"use client";
import Logo from "@/components/Logo";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  setAuthToken,
  signIn,
  signUp,
} from "@/app/api/auth";
import { useAuthStore } from "@/store/auth-store";
import { SignUpData, SignInData } from "@/types/index";
import { AuthFormProps } from "@/types/index";
import { baseAuthSchema, SignUpSchema } from "@/schemas/index";

const SignInSchema = baseAuthSchema;

type SignUpFormSchema = z.infer<typeof SignUpSchema>;
type SignInFormSchema = z.infer<typeof SignInSchema>;

const AuthForm: React.FC<AuthFormProps> = ({ type = "signin", onSubmit }) => {
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  const setToken = useAuthStore((s) => s.setToken);
  const setUser = useAuthStore((s) => s.setUser);

  const currentSchema = type === "signup" ? SignUpSchema : SignInSchema;
  const form = useForm<SignUpFormSchema | SignInFormSchema>({
    resolver: zodResolver(currentSchema),
    defaultValues: { username: "", email: "", password: "" },
  });

  const handleRedirect = (): void => {
    router.push("/dashboard");
  };

  const onSubmitHandler = async (
    values: SignUpFormSchema | SignInFormSchema
  ): Promise<void> => {
    setIsLoading(true);
    setError(null);

    try {
      if (onSubmit) {
        onSubmit(values);
        return;
      }

      if (type === "signup") {
        const payload = values as SignUpData;
        const response = await signUp(payload);
        setAuthToken(response.access_token);
        setToken(response.access_token);
        setUser(response.user);
        handleRedirect();
      } else {
        const payload = values as SignInData;
        const response = await signIn(payload);

        setAuthToken(response.access_token);
        setToken(response.access_token);
        setUser(response.user);
        handleRedirect();
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "An unexpected error");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="w-full h-auto lg:max-w-[1440px] lg:h-[853px]">
      <div className="flex items-center justify-center min-h-screen">
        <div className="bg-white w-[343px] lg:w-[455px] rounded-2xl lg:rounded-3xl px-[19px] lg:px-8 py-6 lg:py-8">
          <div className="flex justify-center items-center">
            <Logo className="text-black w-[165px] h-[50px] lg:w-[224px] lg:h-[67px] " />
          </div>

          <h1 className="text-black text-xs lg:text-[16px] text-center font-normal mt-3 lg:mt-4">
            {type === "signin"
              ? "Welcome back to FlowSpace!"
              : "Welcome to FlowSpace!"}
          </h1>
          {error && (
            <div className="flex justify-center items-center">
              <p className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded mt-4">
                {error}
              </p>
            </div>
          )}

          <Form {...form}>
            <form
              onSubmit={form.handleSubmit(onSubmitHandler)}
              className="space-y-[15px]"
            >
              {type === "signup" && (
                <FormField
                  control={form.control}
                  name="username"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-black text-[14px] leading-5 lg:text-lg font-normal mt-[13px] lg:mt-4">
                        Username
                      </FormLabel>
                      <FormControl>
                        <Input
                          placeholder="Enter your preferred username"
                          {...field}
                          className="text-[#000000] font-light leading-6 text-[15px] lg:text-[16px] placeholder:text-[#A1A1A1] lg:placeholder:text-[#7D7D7D] focus-visible:outline-none focus-visible:ring-0"
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              )}
              <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel
                      className={`text-[#000000] leading-5 font-normal text-[14px] lg:text-lg ${
                        type === "signin" ? "mt-3 lg:mt-4" : ""
                      }`}
                    >
                      Email Address
                    </FormLabel>
                    <FormControl>
                      <Input
                        placeholder="Enter your email address"
                        {...field}
                        className="text-[#000000] font-light leading-6 text-[15px] lg:text-[16px] placeholder:text-[#A1A1A1] lg:placeholder:text-[#7D7D7D] focus-visible:outline-none focus-visible:ring-0"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="password"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-[#000000] leading-5 font-normal text-[14px] lg:text-lg">
                      Password
                    </FormLabel>
                    <FormControl>
                      <Input
                        type="password"
                        autoComplete="current-password"
                        placeholder="Enter your password"
                        {...field}
                        className="text-[#000000] font-light leading-6 text-[15px] lg:text-[16px] placeholder:text-[#A1A1A1] lg:placeholder:text-[#7D7D7D] focus-visible:outline-none focus-visible:ring-0"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <div className="flex justify-center items-center mt-4 lg:mt-5">
                <Button
                  type="submit"
                  className="font-normal text-[16px] leading-6 w-[106px] h-[56px] cursor-pointer"
                >
                  {isLoading
                    ? "Loading..."
                    : type === "signin"
                    ? "Sign In"
                    : "Sign Up"}
                </Button>
              </div>
            </form>
          </Form>
          <p className="text-center mt-[10px] lg:mt-4">
            {type === "signin" ? (
              <span className="text-[#000000] text-[14px] lg:text-[16px]">
                Don&apos;t have an account?{" "}
                <Link
                  href="/signup"
                  className="text-black font-bold hover:underline"
                >
                  Sign Up
                </Link>
              </span>
            ) : (
              <span className="text-[#000000] text-[14px] lg:text-[16px]">
                Already have an account?{" "}
                <Link
                  href="/signin"
                  className="text-black font-bold hover:underline"
                >
                  Sign In
                </Link>
              </span>
            )}
          </p>
        </div>
      </div>
    </div>
  );
};

export default AuthForm;
