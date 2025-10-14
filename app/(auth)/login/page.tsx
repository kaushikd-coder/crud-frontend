'use client'

import LoginForm from '@/components/auth/LoginForm'
import React from 'react'

const page = () => {
    return (
        <div className="min-h-[100dvh] flex items-center justify-center px-4 sm:px-6 border-[var(--panel-border)] bg-[var(--panel)] text-[var(--foreground)]">
            <div className="w-full max-w-sm sm:max-w-md md:max-w-lg rounded-2xl border  shadow-xl p-5 sm:p-6 md:p-8 border-[var(--panel-border)] bg-[var(--panel)] text-[var(--foreground)]">
                <h1 className="text-xl sm:text-2xl font-semibold tracking-tight">Welcome back</h1>
                <p className="text-xs sm:text-sm text-gray-500 mt-1">Sign in to continue</p>
                <div className="mt-5 sm:mt-6">
                    <LoginForm />
                </div>
            </div>
        </div>
    )
}

export default page