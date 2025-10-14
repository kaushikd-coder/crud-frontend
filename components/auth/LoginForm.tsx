"use client";
import React from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { LoginSchema, type LoginInput } from "@/lib/validators/auth";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import { loginThunk } from "@/store/slices/authSlice";
import { Eye, EyeOff, Loader2 } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";

const LoginForm = () => {

    const dispatch = useAppDispatch();
    const { status, error } = useAppSelector((s:any) => s.auth);
    const [show, setShow] = React.useState(false);


    const {
        register,
        handleSubmit,
        formState: { errors, isSubmitting, isValid },
        setError,
    } = useForm<LoginInput>({
        mode: "onChange",
        resolver: zodResolver(LoginSchema),
        defaultValues: { email: "", password: "", remember: true },
    });


    const router = useRouter();

    const onSubmit:any = async (values: LoginInput) => {
        const res = await dispatch(loginThunk(values));
        if (loginThunk.rejected.match(res)) {
            setError('root', { type: 'server', message: (res.payload as string) ?? 'Login failed' });
            return;
        }
        
        
        setTimeout(() => {
            router.push('/dashboard');
        }, 0);
    };




    const busy = status === "loading" || isSubmitting;

    return (
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">

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
                <div className="relative">
                    <input
                        id="password"
                        type={show ? "text" : "password"}
                        autoComplete="current-password"
                        placeholder="••••••••"
                        className="w-full rounded-xl border px-3 py-2.5 sm:py-3 pr-10 text-sm sm:text-base outline-none border-[var(--panel-border)] bg-[var(--panel)] text-[var(--foreground)] focus:ring-2 focus:ring-indigo-500/70 focus:border-transparent"
                        {...register("password")}
                    />
                    <button
                        type="button"
                        onClick={() => setShow((s) => !s)}
                        className="absolute right-2 top-1/2 -translate-y-1/2 p-1 rounded-md hover:bg-gray-100 dark:hover:bg-zinc-800"
                        aria-label={show ? "Hide password" : "Show password"}
                    >
                        {show ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                    </button>
                </div>
                {errors.password && (
                    <p className="mt-1 text-xs text-red-500">{(errors.password as any).message as string}</p>
                )}
            </div>

            {/* Server + Root errors */}
            {error && <p className="text-sm text-red-600">{error}</p>}
            {/* {errors.root?.message && (
                <p className="text-sm text-red-600">{errors.root?.message}</p>
            )} */}


            {/* Submit !isValid*/}
            <button
                type="submit"
                disabled={busy}
                className="w-full inline-flex items-center justify-center gap-2 rounded-xl bg-indigo-600 text-white py-2.5 sm:py-3 font-medium hover:bg-indigo-700 disabled:opacity-60 disabled:cursor-not-allowed shadow-sm"
            >
                {busy && <Loader2 className="h-4 w-4 animate-spin" />}
                Sign in
            </button>

            {/* Sign up hint */}
            <p className="text-xs sm:text-sm text-gray-500 text-center">
                Don’t have an account?{' '}
                <Link href="/register" className="text-indigo-500 hover:text-indigo-600 font-medium">Sign up</Link>
            </p>

        </form>
    )
}

export default LoginForm