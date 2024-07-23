'use client'
import React, { useState } from 'react'
import Link from 'next/link'

import { useAuth } from '@/hooks/useAuth'
import { useForm } from '@tanstack/react-form'
import axios from 'axios'
import { valibotValidator } from '@tanstack/valibot-form-adapter'
import AuthCard from '@/components/AuthCard'
import ApplicationLogo from '@/components/ApplicationLogo'
import AuthSessionStatus from '@/components/AuthSessionStatus'
import { ForgotPasswordSchema } from '@/types/schema/UserSchema'

interface FormValues {
  email: string
}

const ForgotPasswordPage = () => {
  const [status, setStatus] = useState<string>('')
  const [error, setError] = useState<string>('')

  const { forgotPassword } = useAuth({
    middleware: 'guest',
    redirectIfAuthenticated: '/dashboard',
  })

  const form = useForm({
    defaultValues: {
      email: "",
    },
    validatorAdapter: valibotValidator(),
    onSubmit: async ({ value }) => {
    try {
        const response = await forgotPassword(value);
        setStatus(response.data.status);
    } catch (error) {
        setStatus('')
        if (axios.isAxiosError(error) && error.response?.status === 422) {
          setError(error.response?.data?.errors)
        }
    }
    },
  });

  return (
    <AuthCard
      logo={
        <Link href="/">
          <ApplicationLogo className="w-20 h-20 fill-current text-gray-500" />
        </Link>
      }>
      <div className="mb-4 text-sm text-gray-600">
        Forgot your password? No problem. Just let us know your email address
        and we will email you a password reset link that will allow you to
        choose a new one.
      </div>
      <AuthSessionStatus className="mb-4" status={status} />

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
              onChange: ForgotPasswordSchema.entries.email,
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
          {error && <em className="text-xs text-red-500 mt-1">{error}</em>}
        </div>
        <div>
        <form.Subscribe
            selector={(state) => [state.canSubmit, state.isSubmitting]}
            children={([canSubmit, isSubmitting]) => (
              <button
                className="ml-3 inline-flex items-center px-4 py-2 bg-gray-800 border border-transparent rounded-md font-semibold text-xs text-white uppercase tracking-widest hover:bg-gray-700 active:bg-gray-900 focus:outline-none focus:border-gray-900 focus:ring ring-gray-300 disabled:opacity-25 transition ease-in-out duration-150"
                type="submit"
                disabled={!canSubmit}
              >
                {isSubmitting ? "Sending.." : "Email Reset Link"}
              </button>
            )}
          />
        </div>
     </form>
    </AuthCard>
  )
}

export default ForgotPasswordPage
