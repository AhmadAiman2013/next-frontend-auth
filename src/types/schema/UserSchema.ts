import * as v from 'valibot';


const UserDataSchema = v.object({
    name: v.pipe(v.string(), v.nonEmpty('Name is required')),
    email: v.pipe(v.string(), v.email('Enter a valid email'), v.nonEmpty('Email is required')),
    password: v.pipe(v.string(), v.nonEmpty('Password is required')),
    password_confirmation: v.pipe(v.string(), v.nonEmpty('Password confirmation is required')),
    remember: v.boolean()
})

export const LoginSchema = v.pick(UserDataSchema, ['email', 'password', 'remember'])

export type LoginUserData = v.InferOutput<typeof LoginSchema>