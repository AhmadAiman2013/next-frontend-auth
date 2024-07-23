// "use client";

// import Link from "next/link";

// import { useState } from "react";
// import { valibotValidator } from "@tanstack/valibot-form-adapter";
// import * as v from "valibot";
// import { useForm } from "@tanstack/react-form";
// import { RegisterSchema } from "@/types/schema/UserSchema";

// import { useAuth } from "@/hooks/useAuth";
// import ApplicationLogo from "@/components/ApplicationLogo";
// import AuthCard from "@/components/AuthCard";

// const RegisterPage = () => {
//   const [error, setErrors] = useState<string>("");

//   const { register } = useAuth({
//     middleware: "guest",
//     redirectIfAuthenticated: "/verify-email",
//   });

//   const form = useForm({
//     defaultValues: {
//       name: "",
//       email: "",
//       password: "",
//       password_confirmation: "",
//     },
//     validatorAdapter: valibotValidator(),
//     onSubmit: async ({ value }) => {
//       const response = await register(value);
//       if (response?.error) {
//         setErrors(response.error);
//       }
//     },
//   });

//   return (
//     <AuthCard
//       logo={
//         <Link href="/">
//           <ApplicationLogo className="w-20 h-20 fill-current text-gray-500" />
//         </Link>
//       }
//     >
//       <form
//         onSubmit={(e) => {
//           e.preventDefault();
//           e.stopPropagation();
//           form.handleSubmit();
//         }}
//         className="space-y-4"
//       >
//         <div>
//           <form.Field
//             name="name"
//             asyncDebounceMs={500}
//             validators={{
//               onChange: RegisterSchema.entries.name,
//               onChangeAsyncDebounceMs: 500,
//             }}
//             children={(field) => {
//               return (
//                 <div>
//                   <label
//                     htmlFor={field.name}
//                     className="undefined block font-medium text-sm text-gray-700"
//                   >
//                     Name
//                   </label>
//                   <input
//                     id={field.name}
//                     name={field.name}
//                     value={field.state.value}
//                     onBlur={field.handleBlur}
//                     onChange={(e) => field.handleChange(e.target.value)}
//                     className="block mt-1 w-full rounded-md shadow-sm border-gray-300 focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
//                   />
//                   {field.state.meta.isTouched &&
//                   field.state.meta.errors.length ? (
//                     <em className="text-xs text-red-500">
//                       {field.state.meta.errors.join(", ")}
//                     </em>
//                   ) : null}
//                 </div>
//               );
//             }}
//           />
//           {error && <em className="text-xs text-red-500 mt-1">{error}</em>}
//         </div>
//         <div>
//           <form.Field
//             name="email"
//             asyncDebounceMs={500}
//             validators={{
//               onChange: RegisterSchema.entries.email,
//               onChangeAsyncDebounceMs: 500,
//             }}
//             children={(field) => {
//               return (
//                 <div>
//                   <label
//                     htmlFor={field.name}
//                     className="undefined block font-medium text-sm text-gray-700"
//                   >
//                     Email
//                   </label>
//                   <input
//                     id={field.name}
//                     name={field.name}
//                     value={field.state.value}
//                     onBlur={field.handleBlur}
//                     type="email"
//                     onChange={(e) => field.handleChange(e.target.value)}
//                     className="block mt-1 w-full rounded-md shadow-sm border-gray-300 focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
//                   />
//                   {field.state.meta.isTouched &&
//                   field.state.meta.errors.length ? (
//                     <em className="text-xs text-red-500">
//                       {field.state.meta.errors.join(", ")}
//                     </em>
//                   ) : null}
//                 </div>
//               );
//             }}
//           />
//           {error && <em className="text-xs text-red-500 mt-1">{error}</em>}
//         </div>
//         <div>
//           <form.Field
//             name="password"
//             asyncDebounceMs={500}
//             validators={{
//               onChange: RegisterSchema.entries.password,
//               onChangeAsyncDebounceMs: 500,
//             }}
//             children={(field) => (
//               <div>
//                 <label
//                   htmlFor={field.name}
//                   className="undefined block font-medium text-sm text-gray-700"
//                 >
//                   Password
//                 </label>
//                 <input
//                   id={field.name}
//                   name={field.name}
//                   value={field.state.value}
//                   onBlur={field.handleBlur}
//                   type="password"
//                   onChange={(e) => field.handleChange(e.target.value)}
//                   className="block mt-1 w-full rounded-md shadow-sm border-gray-300 focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
//                 />
//                 {field.state.meta.isTouched &&
//                 field.state.meta.errors.length ? (
//                   <em className="text-xs text-red-500">
//                     {field.state.meta.errors.join(", ")}
//                   </em>
//                 ) : null}
//               </div>
//             )}
//           />
//           {error && <em className="text-xs text-red-500 mt-1">{error}</em>}
//         </div>
//         <div>
//           <form.Field
//             name="password_confirmation"
//             asyncDebounceMs={500}
//             validators={{
//               onChangeListenTo: ["password"],
//               onChange: ({ value, fieldApi }) => {
//                 try {
//                   v.parse(RegisterSchema.entries.password_confirmation, value);
//                   if (value !== fieldApi.form.getFieldValue("password")) {
//                     return "Passwords do not match";
//                   }
//                 } catch (error) {
//                   console.error(error);
//                 }
//               },
//               onChangeAsyncDebounceMs: 500,
//             }}
//             children={(field) => (
//               <div>
//                 <label
//                   htmlFor={field.name}
//                   className="undefined block font-medium text-sm text-gray-700"
//                 >
//                   Confirm password
//                 </label>
//                 <input
//                   id={field.name}
//                   name={field.name}
//                   value={field.state.value}
//                   onBlur={field.handleBlur}
//                   type="password"
//                   onChange={(e) => field.handleChange(e.target.value)}
//                   className="block mt-1 w-full rounded-md shadow-sm border-gray-300 focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
//                 />
//                 {field.state.meta.isTouched &&
//                 field.state.meta.errors.length ? (
//                   <em className="text-xs text-red-500">
//                     {field.state.meta.errors.join(", ")}
//                   </em>
//                 ) : null}
//               </div>
//             )}
//           />
//           {error && <em className="text-xs text-red-500 mt-1">{error}</em>}
//         </div>
//         <div className="flex items-center justify-end mt-4">
//           <Link
//             href="/login"
//             className="underline text-sm text-gray-600 hover:text-gray-900"
//           >
//             Already registered?
//           </Link>

//           <form.Subscribe
//             selector={(state) => [state.canSubmit, state.isSubmitting]}
//             children={([canSubmit, isSubmitting]) => (
//               <button
//                 className="ml-3 inline-flex items-center px-4 py-2 bg-gray-800 border border-transparent rounded-md font-semibold text-xs text-white uppercase tracking-widest hover:bg-gray-700 active:bg-gray-900 focus:outline-none focus:border-gray-900 focus:ring ring-gray-300 disabled:opacity-25 transition ease-in-out duration-150"
//                 type="submit"
//                 disabled={!canSubmit}
//               >
//                 {isSubmitting ? "Registering..." : "Register"}
//               </button>
//             )}
//           />
//         </div>
//       </form>
//     </AuthCard>
//   );
// };

// export default RegisterPage;
