"use client";
import { useState } from "react";
import { motion } from "framer-motion";

export default function SignUpPage() {
    return (
        <div className="min-h-screen flex items-center justify-center bg-gradient-to-r from-[#00B7FF] to-[#00B7FF]/50">
            <motion.div
                className="bg-white/80 text-gray-800 backdrop-blur-md rounded-xl shadow-lg p-8 m-10 w-full max-w-md"
                initial={{ opacity: 0, y: 40 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, ease: "easeOut" }}
            >
                <h2 className="text-3xl font-bold text-center text-[#00B7FF] mb-6">
                    Create your account
                </h2>
                <form className="space-y-5">
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                            Full Name
                        </label>
                        <input
                            type="text"
                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#00B7FF] text-gray-900"
                            required
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                            Phone
                        </label>
                        <input
                            type="tel"
                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#00B7FF] text-gray-900"
                            required
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                            Email
                        </label>
                        <input
                            type="email"
                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#00B7FF] text-gray-900"
                            required
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                            Password
                        </label>
                        <input
                            type="password"
                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#00B7FF] text-gray-900"
                            required
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                            Confirm Password
                        </label>
                        <input
                            type="password"
                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#00B7FF] text-gray-900"
                            required
                        />
                    </div>
                    <motion.button
                        type="submit"
                        className="w-full py-2 px-4 bg-[#00B7FF] hover:bg-indigo-700 text-white font-semibold rounded-lg shadow-md transition-colors"
                        whileTap={{ scale: 0.97 }}
                    >
                        Sign Up
                    </motion.button>
                </form>
                <p className="mt-6 text-center text-sm text-gray-700">
                    Already have an account?{" "}
                    <a href="/login" className="text-[#00B7FF] hover:underline font-medium">
                        Sign in
                    </a>
                </p>
            </motion.div>
        </div>
    );
}
