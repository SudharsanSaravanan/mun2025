"use client";
import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { supabase } from "@/lib/supabase";
import { useRouter } from "next/navigation";

export default function SignUpPage() {  
  const router = useRouter();

  useEffect(() => {
    const checkAuth = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (session) {
        router.replace("/dashboard");
      }
    };

    checkAuth();
  }, [router]);

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    password: "",
    confirmPassword: ""
  });
  
  const [errors, setErrors] = useState({
    password: "",
    confirmPassword: "",
    phone: ""
  });  
  
  const validatePhone = (phone: string) => {
    return /^\d{10}$/.test(phone);
  };

  const validatePassword = (password: string) => {
    const issues = [];
    if (password.length < 6) issues.push("6+ characters");
    if (!/[A-Z]/.test(password)) issues.push("uppercase letter");
    if (!/\d/.test(password)) issues.push("number");
    if (!/[!@#$%^&*]/.test(password)) issues.push("special character");
    return issues;
  };   

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));

    if (name === "phone") {
      if (!validatePhone(value) && value !== "") {
        setErrors(prev => ({
          ...prev,
          phone: "Valid phone number must be 10 digits"
        }));
      } else {
        setErrors(prev => ({ ...prev, phone: "" }));
      }
    }
    
    if (name === "password") {
      const passwordIssues = validatePassword(value);
      if (passwordIssues.length > 0) {
        setErrors(prev => ({
          ...prev,
          password: `Passwords must have: ${passwordIssues.join(", ")}`
        }));
      } else {
        setErrors(prev => ({ ...prev, password: "" }));
      }
    }
    
    if (name === "confirmPassword" || (name === "password" && formData.confirmPassword)) {
      if (name === "confirmPassword" && value !== formData.password) {
        setErrors(prev => ({ ...prev, confirmPassword: "Passwords do not match" }));
      } else if (name === "password" && value !== formData.confirmPassword) {
        setErrors(prev => ({ ...prev, confirmPassword: "Passwords do not match" }));
      } else {
        setErrors(prev => ({ ...prev, confirmPassword: "" }));
      }     
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // console.log(formData)
  };
  
  return (
    <div className="min-h-screen py-10 md:py-24 flex items-center justify-center bg-gradient-to-br from-sky-100 to-sky-200 p-4">
      <motion.div
        className="bg-white/90 backdrop-blur-2xl rounded-xl shadow-[0_8px_32px_rgb(0,0,0,0.15)] border border-sky-200 p-6 sm:p-8 w-full max-w-2xl"
        initial={{ opacity: 0, y: 40 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, ease: "easeOut" }}
      >
        <h2 className="text-2xl sm:text-3xl font-bold text-center text-gray-800 mb-6">
          Create your Account
        </h2>
        <form className="space-y-4" onSubmit={handleSubmit}>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Full Name
              </label>
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleInputChange}
                className="w-full px-4 py-2 border text-gray-800 border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-200 bg-gray-50/50"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Email
              </label>
              <input
                type="email"
                name="email"
                value={formData.email}
                placeholder="roll@cb.students.amrita.edu"
                onChange={handleInputChange}
                className="w-full px-4 py-2 border text-gray-800 border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-200 bg-gray-50/50"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Phone
              </label>
              <input
                type="tel"
                name="phone"
                value={formData.phone}
                onChange={handleInputChange}
                className="w-full px-4 py-2 border text-gray-800 border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-200 bg-gray-50/50"                required
                pattern="\d{10}"
                title="Please enter exactly 10 digits"
              />
              {errors.phone && (
                <p className="text-red-500 text-sm mt-1">{errors.phone}</p>
              )}
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Password
              </label>
              <input
                type="password"
                name="password"
                value={formData.password}
                onChange={handleInputChange}
                className="w-full px-4 py-2 border text-gray-800 border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-200 bg-gray-50/50"
                required
              />
              {errors.password && (
                <p className="text-red-500 text-sm mt-1">{errors.password}</p>
              )}
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Confirm Password
              </label>
              <input
                type="password"
                name="confirmPassword"
                value={formData.confirmPassword}
                onChange={handleInputChange}
                className="w-full px-4 py-2 border text-gray-800 border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-200 bg-gray-50/50"
                required
              />
              {errors.confirmPassword && (
                <p className="text-red-500 text-sm mt-1">{errors.confirmPassword}</p>
              )}
            </div>
          </div>
          <motion.button
            type="submit"
            className="w-full mt-4 py-2 px-4 cursor-pointer bg-[#00B7FF] hover:bg-[#0077FF] text-white font-semibold rounded-lg shadow-sm transition-colors"
            whileTap={{ scale: 0.97 }}
          >
            Sign Up
          </motion.button>
        </form>
        <p className="mt-6 text-center text-sm text-gray-600">
          Already have an account?{" "}
          <a href="/login" className="text-[#00B7FF] hover:text-[#0077FF] hover:underline font-medium">
            Sign in
          </a>
        </p>
      </motion.div>
    </div>
  );
}
