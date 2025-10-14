'use client'
import React from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { RegisterSchema, type RegisterInput } from "@/lib/validators/auth";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import { registerThunk } from "@/store/slices/authSlice";
import { Loader2 } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";

const RegisterForm = () => {

    const dispatch = useAppDispatch();
    const authState = useAppSelector((s: any) => s.auth);
    const status = authState?.status ?? "idle";
    const error = authState?.error ?? null;

    const {
        register,
        handleSubmit,
        formState: { errors, isSubmitting, isValid },
        setError,
    } = useForm<RegisterInput>({
        mode: "onChange",
        resolver: zodResolver(RegisterSchema),
        defaultValues: {
            name: "",
            email: "",
            password: "",
            confirmPassword: "",
            accept: false,  
            role: "user",   
        },
    });


    const router = useRouter();

    const onSubmit = async (values: RegisterInput) => {

        console.log("Clicked")

        const res = await dispatch(registerThunk(values));

        console.log({ res })
        router.push('/dashboard');


    };


    const busy = status === "loading" || isSubmitting;

    return (
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-5 sm:space-y-6">
            {/* Name */}
            <div>
                <label className="block text-xs sm:text-sm font-medium mb-1.5" htmlFor="name">Name</label>
                <input
                    id="name"
                    type="text"
                    autoComplete="name"
                    placeholder="Jane Doe"
                    className="w-full rounded-xl border px-3 py-2.5 sm:py-3 text-sm sm:text-base outline-none border-[var(--panel-border)] bg-[var(--panel)] text-[var(--foreground)] focus:ring-2 focus:ring-indigo-500/70 focus:border-transparent"
                    {...register("name")}
                />
                {errors.name && (
                    <p className="mt-1 text-xs text-red-500">{errors.name.message as any}</p>
                )}
            </div>

            {/* Email */}
            <div>
                <label className="block text-xs sm:text-sm font-medium mb-1.5" htmlFor="email">Email</label>
                <input
                    id="email"
                    type="email"
                    autoComplete="email"
                    placeholder="you@example.com"
                    className="w-full rounded-xl border px-3 py-2.5 sm:py-3 text-sm sm:text-base outline-none border-[var(--panel-border)] bg-[var(--panel)] text-[var(--foreground)] focus:ring-2 focus:ring-indigo-500/70 focus:border-transparent"
                    {...register("email")}
                />
                {errors.email && (
                    <p className="mt-1 text-xs text-red-500">{errors.email.message as any}</p>
                )}
            </div>

            {/* Password */}
            <div>
                <label className="block text-xs sm:text-sm font-medium mb-1.5" htmlFor="password">Password</label>
                <input
                    id="password"
                    type="password"
                    autoComplete="new-password"
                    placeholder="••••••••"
                    className="w-full rounded-xl border px-3 py-2.5 sm:py-3 text-sm sm:text-base outline-none border-[var(--panel-border)] bg-[var(--panel)] text-[var(--foreground)] focus:ring-2 focus:ring-indigo-500/70 focus:border-transparent"
                    {...register("password")}
                />
                {errors.password && (
                    <p className="mt-1 text-xs text-red-500">{errors.password.message as any}</p>
                )}
            </div>

            {/* Confirm */}
            <div>
                <label className="block text-xs sm:text-sm font-medium mb-1.5" htmlFor="confirm">Confirm password</label>
                <input
                    id="confirm"
                    type="password"
                    autoComplete="new-password"
                    placeholder="••••••••"
                    className="w-full rounded-xl border px-3 py-2.5 sm:py-3 text-sm sm:text-base outline-none border-[var(--panel-border)] bg-[var(--panel)] text-[var(--foreground)] focus:ring-2 focus:ring-indigo-500/70 focus:border-transparent"
                    {...register("confirmPassword")}
                />
                {errors.confirmPassword && (
                    <p className="mt-1 text-xs text-red-500">{errors.confirmPassword.message as any}</p>
                )}
            </div>



            {/* Terms */}
            <label className="flex items-center gap-2 text-xs sm:text-sm">
                <input type="checkbox" className="rounded" {...register("accept")} />
                I agree to the <a href="#" className="text-indigo-500 hover:text-indigo-600">Terms</a>.
            </label>
            {errors.accept && <p className="mt-1 text-xs text-red-500">{errors.accept.message as any}</p>}

            {/* Server + Root errors */}
            {error && <p className="text-sm text-red-500">{error}</p>}

            {/* Submit */}
            <button
                type="submit"
                disabled={busy || !isValid}
                className="w-full inline-flex items-center justify-center gap-2 rounded-xl bg-indigo-600 text-white py-2.5 sm:py-3 font-medium hover:bg-indigo-700 disabled:opacity-60 disabled:cursor-not-allowed shadow-sm"
            >
                {busy && <Loader2 className="h-4 w-4 animate-spin" />}
                Create account
            </button>


            <p className="text-xs sm:text-sm text-gray-500 text-center">
                Already have an account?{' '}
                <Link href="/login" className="text-indigo-500 hover:text-indigo-600 font-medium">Sign in</Link>
            </p>
        </form>
    )
}

export default RegisterForm