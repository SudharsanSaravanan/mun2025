"use client";
import { useState } from "react";
import { motion } from "framer-motion";

export default function LoginPage() {
    return (
        <div className="min-h-screen md:mt-2 flex items-center justify-center bg-gradient-to-br from-sky-100 to-sky-200 p-4">
            <motion.div
                className="bg-white/80 backdrop-blur-2xl rounded-xl shadow-[0_8px_32px_rgb(0,0,0,0.15)] border border-sky-200 p-6 sm:p-8 w-full max-w-md"
                initial={{ opacity: 0, y: 40 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, ease: "easeOut" }}
            >
                <h2 className="text-2xl sm:text-3xl font-bold text-center text-gray-800 mb-6">
                    Sign in
                </h2>
                <form className="space-y-4">
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                            Email
                        </label>
                        <input
                            type="email"
                            className="w-full px-4 py-2 border text-gray-800 border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-200 bg-gray-50/50"
                            placeholder="you@example.com"
                            required
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                            Password
                        </label>
                        <input
                            type="password"
                            className="w-full px-4 py-2 border text-gray-800 border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-200 bg-gray-50/50"
                            placeholder=""
                            required
                        />
                    </div>
                    <motion.button
                        type="submit"
                        className="w-full py-2 px-4 cursor-pointer bg-[#00B7FF] hover:bg-[#0077FF] text-white font-semibold rounded-lg shadow-sm transition-colors"
                        whileTap={{ scale: 0.97 }}
                    >
                        Sign In
                    </motion.button>
                </form>
                <p className="mt-6 text-center text-sm text-gray-600">
                    Don't have an account?{" "}
                    <a href="/signup" className="text-[#00B7FF] hover:text-[#0077FF] hover:underline font-medium">
                        Sign up
                    </a>
                </p>
            </motion.div>
        </div>
    );
}