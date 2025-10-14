'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { Github, Linkedin } from 'lucide-react';
import Link from 'next/link';

const Footer = () => {
    const year = new Date().getFullYear();

    return (
        <motion.footer
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4 }}
            // ✅ Static by default (for mobile); fixed only on md+ screens
            className="mt-auto border-t border-[var(--panel-border)] bg-[var(--panel)]/80 backdrop-blur 
                md:fixed md:inset-x-0 md:bottom-0 md:z-40"
        >
            <div className="mx-auto grid max-w-6xl grid-cols-1 gap-8 px-6 py-8 text-sm text-[var(--foreground)] sm:grid-cols-3">
                {/* Left: About */}
                <div>
                    <h2 className="text-base font-semibold mb-2 text-indigo-400">Kaushik</h2>
                    <p className="opacity-70 leading-relaxed">
                        Fullstack Developer passionate about building secure, scalable, and elegant web
                        applications using modern technologies like Next.js, TypeScript, and MongoDB.
                    </p>
                </div>

                {/* Middle: Quick Links */}
                <div className="flex flex-col sm:items-center">
                    <h3 className="text-base font-semibold mb-3 tracking-wide text-indigo-400">Quick Links</h3>
                    <nav className="flex flex-col gap-1.5">
                        {[
                            { name: 'Dashboard', href: '/dashboard' },
                            { name: 'Entities', href: '/entities' },
                            { name: 'Contact', href: 'mailto:kaushikd696@gmail.com' },
                        ].map((link) =>
                            link.href.startsWith('mailto:') ? (
                                <a
                                    key={link.name}
                                    href={link.href}
                                    className="transition-colors hover:text-indigo-400 hover:underline underline-offset-4"
                                >
                                    {link.name}
                                </a>
                            ) : (
                                <Link
                                    key={link.name}
                                    href={link.href}
                                    className="transition-colors hover:text-indigo-400 hover:underline underline-offset-4"
                                >
                                    {link.name}
                                </Link>
                            )
                        )}
                    </nav>
                </div>

                {/* Right: Socials */}
                <div className="flex flex-col sm:items-end">
                    <h3 className="text-base font-semibold mb-2 text-indigo-400">Connect</h3>
                    <div className="flex items-center gap-4">
                        <a
                            href="https://github.com/kaushikd-coder"
                            target="_blank"
                            rel="noopener noreferrer"
                            className="flex items-center gap-2 hover:text-indigo-500 transition"
                        >
                            <Github className="h-4 w-4" />
                            GitHub
                        </a>
                        <a
                            href="https://www.linkedin.com/in/kaushik-dcode-13799828b/"
                            target="_blank"
                            rel="noopener noreferrer"
                            className="flex items-center gap-2 hover:text-indigo-500 transition"
                        >
                            <Linkedin className="h-4 w-4" />
                            LinkedIn
                        </a>
                    </div>

                    <p className="mt-4 text-xs opacity-70 text-left md:text-right">
                        © {year} Kaushik. Built with Next.js 15, TypeScript &amp; Tailwind CSS.
                    </p>
                </div>
            </div>
        </motion.footer>
    );
};

export default Footer;
