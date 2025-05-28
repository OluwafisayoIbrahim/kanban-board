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
import React from "react";
import { useForm } from "react-hook-form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import Link from "next/link";

type AuthType = "signin" | "signup";

interface AuthFormProps {
  type?: AuthType;
  onSubmit?: (
    formData:
      | {
          email: string;
          password: string;
        }
      | {
          username: string;
          email: string;
          password: string;
        }
  ) => void;
}

const baseAuthSchema = z
  .object({
    email: z.string().email({
      message: "Please enter a valid email address",
    }),
    password: z
      .string()
      .min(6, {
        message: "Password must be at least 6 characters",
      })
      .refine(
        (password) => /[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/.test(password),
        {
          message: "Password must contain at least one special character",
        }
      ),
  })
  .required();

const SignUpSchema = baseAuthSchema
  .extend({
    username: z
      .string()
      .min(3, {
        message: "Username must be at least 3 characters",
      })
      .max(20, {
        message: "Username must be at most 20 characters",
      }),
  })
  .refine((data) => data.username !== data.password, {
    message: "Username and password must not match.",
    path: ["password"],
  });

const SignInSchema = baseAuthSchema;

type SignUpFormSchema = z.infer<typeof SignUpSchema>;
type SignInFormSchema = z.infer<typeof SignInSchema>;

const AuthForm: React.FC<AuthFormProps> = ({ type, onSubmit }) => {
  const currentSchema = type === "signup" ? SignUpSchema : SignInSchema;
  const form = useForm<SignUpFormSchema | SignInFormSchema>({
    resolver: zodResolver(currentSchema),
    defaultValues: {
      username: "",
      email: "",
      password: "",
    },
  });

  const onSubmitHandler = (values: SignUpFormSchema | SignInFormSchema) => {
    onSubmit && onSubmit(values);
    console.log(values);
    if (type === "signup") {
      const signUpValues = values as SignUpFormSchema;
      alert(
        `Username: ${signUpValues.username}, Email: ${signUpValues.email}, Password: ${signUpValues.password}`
      );
    } else {
      const signInValues = values as SignInFormSchema;
      alert(`Email: ${signInValues.email}, Password: ${signInValues.password}`);
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
                  {type === "signin" ? "Log In" : "Sign Up"}
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
