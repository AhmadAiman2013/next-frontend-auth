import * as v from 'valibot';


const UserDataSchema = v.object({
    name: v.pipe(v.string(), v.nonEmpty('Name is required')),
    email: v.pipe(v.string(), v.email('Enter a valid email'), v.nonEmpty('Email is required')),
    password: v.pipe(v.string(), v.nonEmpty('Password is required')),
    password_confirmation: v.string(),
    remember: v.boolean()
})

export const LoginSchema = v.pick(UserDataSchema, ['email', 'password', 'remember'])
export const RegisterSchema = v.omit(UserDataSchema,['remember'])
export const ForgotPasswordSchema = v.pick(UserDataSchema, ['email'])
export const ResetPasswordScheme = v.pick(UserDataSchema, ['email', 'password', 'password_confirmation'])

export type LoginUserData = v.InferOutput<typeof LoginSchema>
export type RegisterUserData = v.InferOutput<typeof RegisterSchema>
export type ForgotPasswordData = v.InferOutput<typeof ForgotPasswordSchema>
export type ResetPasswordData = v.InferOutput<typeof ResetPasswordScheme>