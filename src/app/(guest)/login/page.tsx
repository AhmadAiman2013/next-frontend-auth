"use client";

import Link from "next/link";
import { useSearchParams } from "next/navigation";

import { valibotValidator } from "@tanstack/valibot-form-adapter";
import { useForm } from "@tanstack/react-form";
import { LoginSchema } from "@/types/schema/UserSchema";

import { useAuth } from "@/hooks/useAuth";
import ApplicationLogo from "@/components/ApplicationLogo";
import AuthCard from "@/components/AuthCard";
import { useEffect, useState } from "react";
import AuthSessionStatus from "@/components/AuthSessionStatus";

const LoginPage = () => {
  const searchParams = useSearchParams();
  const [status, setStatus] = useState<string>("");
  const [error, setErrors] = useState<string>("");

  const { login, loginGoogle } = useAuth({
    middleware: "guest",
    redirectIfAuthenticated: "/dashboard",
  });

  const submitGoogle = async () => {
    try {
      await loginGoogle()
    } catch (error: any) {
      console.log(error)
    } finally {
      setStatus('')
    }
  }

  useEffect(() => {
    const resetToken = searchParams.get("reset");
    setStatus(resetToken ? atob(resetToken) : "");
  }, [searchParams]);

  const form = useForm({
    defaultValues: {
      email: "",
      password: "",
      remember: false,
    },
    validatorAdapter: valibotValidator(),
    onSubmit: async ({ value }) => {
      const response = await login(value);
      if (response?.error) {
        setErrors(response.error);
      }
    },
  });

  return (
    <AuthCard
      logo={
        <Link href="/">
          <ApplicationLogo className="w-20 h-20 fill-current text-gray-500" />
        </Link>
      }
    >
      <form
        onSubmit={(e) => {
          e.preventDefault();
          e.stopPropagation();
          form.handleSubmit();
        }}
        className="space-y-4"
      >
        <div>
          <form.Field
            name="email"
            asyncDebounceMs={500}
            validators={{
              onChange: LoginSchema.entries.email,
              onChangeAsyncDebounceMs: 500,
            }}
            children={(field) => {
              return (
                <div>
                  <label
                    htmlFor={field.name}
                    className="undefined block font-medium text-sm text-gray-700"
                  >
                    Email
                  </label>
                  <input
                    id={field.name}
                    name={field.name}
                    value={field.state.value}
                    onBlur={field.handleBlur}
                    type="email"
                    onChange={(e) => field.handleChange(e.target.value)}
                    className="block mt-1 w-full rounded-md shadow-sm border-gray-300 focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
                  />
                  {field.state.meta.isTouched &&
                  field.state.meta.errors.length ? (
                    <em className="text-xs text-red-500">
                      {field.state.meta.errors.join(", ")}
                    </em>
                  ) : null}
                </div>
              );
            }}
          />
          {error && <p className="text-xs text-red-500">{error}</p>}
        </div>
        <div>
          <form.Field
            name="password"
            asyncDebounceMs={500}
            validators={{
              onChange: LoginSchema.entries.password,
              onChangeAsyncDebounceMs: 500,
            }}
            children={(field) => (
              <div>
                <label
                  htmlFor={field.name}
                  className="undefined block font-medium text-sm text-gray-700"
                >
                  Password
                </label>
                <input
                  id={field.name}
                  name={field.name}
                  value={field.state.value}
                  onBlur={field.handleBlur}
                  type="password"
                  onChange={(e) => field.handleChange(e.target.value)}
                  className="block mt-1 w-full rounded-md shadow-sm border-gray-300 focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
                />
                {field.state.meta.isTouched &&
                field.state.meta.errors.length ? (
                  <em className="text-xs text-red-500">
                    {field.state.meta.errors.join(", ")}
                  </em>
                ) : null}
              </div>
            )}
          />
          {error && <p className="text-xs text-red-500">{error}</p>}
        </div>
        <div className="flex items-center justify-between">
          <form.Field
            name="remember"
            validators={{
              onChange: LoginSchema.entries.remember,
            }}
            children={(field) => (
              <div>
                <label
                  htmlFor={field.name}
                  className="inline-flex items-center"
                >
                  <input
                    id={field.name}
                    name={field.name}
                    checked={field.state.value}
                    onBlur={field.handleBlur}
                    type="checkbox"
                    onChange={(e) => field.handleChange(e.target.checked)}
                    className="rounded border-[#99A6AE] text-indigo-600 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
                  />
                  <span className="ml-2 text-[#252729] text-sm leading-[150%] tracking-[-0.4px] font-medium">
                    Remember me
                  </span>
                </label>
              </div>
            )}
          />
        </div>
        <div className="flex items-center justify-end mt-4">
          <Link
            href="/forgot-password"
            className="underline text-sm text-gray-600 hover:text-gray-900"
          >
            Forgot your password?
          </Link>

          <form.Subscribe
            selector={(state) => [state.canSubmit, state.isSubmitting]}
            children={([canSubmit, isSubmitting]) => (
              <button
                className="ml-3 inline-flex items-center px-4 py-2 bg-gray-800 border border-transparent rounded-md font-semibold text-xs text-white uppercase tracking-widest hover:bg-gray-700 active:bg-gray-900 focus:outline-none focus:border-gray-900 focus:ring ring-gray-300 disabled:opacity-25 transition ease-in-out duration-150"
                type="submit"
                disabled={!canSubmit}
              >
                {isSubmitting ? "Login..." : "Login"}
              </button>
            )}
          />
        </div>
      </form>
      <div className="flex justify-center mt-2">
        <button
          onClick={submitGoogle}
          type="button"
          className=" text-white bg-[#4285F4] hover:bg-[#4285F4]/90 focus:ring-4 focus:outline-none focus:ring-[#4285F4]/50 font-medium rounded-lg text-sm px-5 py-2.5 text-center inline-flex items-center dark:focus:ring-[#4285F4]/55 me-2 mb-2"
        >
          Sign in with Google
        </button>
      </div>
      <AuthSessionStatus status={status} />
    </AuthCard>
  );
};

export default LoginPage;
