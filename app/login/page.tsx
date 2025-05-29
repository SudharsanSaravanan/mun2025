"use client";
import { useState } from "react";
import { motion } from "framer-motion";

export default function LoginPage() {
    return (
        <div className="min-h-screen flex items-center justify-center bg-[#00B7FF]">
            <motion.div
                className="bg-white rounded-xl shadow-lg p-8 w-full max-w-md"
                initial={{ opacity: 0, y: 40 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, ease: "easeOut" }}
            >
                <h2 className="text-3xl font-bold text-center text-[#00B7FF] mb-6">
                    Sign in to your account
                </h2>
                <form className="space-y-5">
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                            Email address
                        </label>
                        <input
                            type="email"
                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#00B7FF]"
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
                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#00B7FF]"
                            placeholder="••••••••"
                            required
                        />
                    </div>
                    <div className="flex items-center justify-between">
                        <div className="flex items-center">
                            <input
                                id="remember"
                                type="checkbox"
                                className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded"
                            />
                            <label htmlFor="remember" className="ml-2 block text-sm text-gray-600">
                                Remember me
                            </label>
                        </div>
                        <a href="#" className="text-sm text-[#00B7FF] hover:underline">
                            Forgot password?
                        </a>
                    </div>
                    <motion.button
                        type="submit"
                        className="w-full py-2 px-4 bg-[#00B7FF] hover:bg-indigo-700 text-white font-semibold rounded-lg shadow-md transition-colors"
                        whileTap={{ scale: 0.97 }}
                    >
                        Sign In
                    </motion.button>
                </form>
                <p className="mt-6 text-center text-sm text-gray-600">
                    Don't have an account?{" "}
                    <a href="#" className="text-[#00B7FF] hover:underline font-medium">
                        Sign up
                    </a>
                </p>
            </motion.div>
        </div>
    );
}