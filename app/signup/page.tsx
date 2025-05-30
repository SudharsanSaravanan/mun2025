"use client";
import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { supabase } from "@/lib/supabase";
import { useRouter } from "next/navigation";
import { Eye, EyeOff } from "lucide-react";

export default function SignUpPage() {  
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.name || !formData.phone) {
      setError("Full name and phone number are required.");
      return;
    }

    if (errors.password || errors.confirmPassword || errors.phone) {
      setError("Please fix the form errors before submitting.");
      return;
    }

    setLoading(true);
    setError("");
    setMessage("");

    const { data: signUpData, error: signUpError } = await supabase.auth.signUp({
      email: formData.email,
      password: formData.password,
      options: {
        data: {
          full_name: formData.name,
          phone_number: formData.phone
        },
        emailRedirectTo: `${window.location.origin}/dashboard`
      }
    });

    setLoading(false);

    if (signUpError) {
      setError(signUpError.message);
      return;
    }

    setMessage("Sign up successful! Please check your email to confirm your account.");
    
    setFormData({
      name: "",
      email: "",
      phone: "",
      password: "",
      confirmPassword: ""
    });
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
        {error && (
          <div className="mb-4 p-3 rounded bg-red-50 border border-red-200">
            <p className="text-red-600 text-sm">{error}</p>
          </div>
        )}
        {message && (
          <div className="mb-4 p-3 rounded bg-green-50 border border-green-200">
            <p className="text-green-600 text-sm">{message}</p>
          </div>
        )}
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
                className="w-full px-4 py-2 border text-gray-800 border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-200 bg-gray-50/50 disabled:opacity-50"
                required
                disabled={loading}
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
                className="w-full px-4 py-2 border text-gray-800 border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-200 bg-gray-50/50 disabled:opacity-50"
                required
                disabled={loading}
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
                className="w-full px-4 py-2 border text-gray-800 border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-200 bg-gray-50/50 disabled:opacity-50"
                required
                pattern="\d{10}"
                disabled={loading}
              />
              {errors.phone && (
                <p className="text-red-500 text-sm mt-1">{errors.phone}</p>
              )}
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Password
              </label>
              <div className="relative">
                <input
                  type={showPassword ? "text" : "password"}
                  name="password"
                  value={formData.password}
                  onChange={handleInputChange}
                  className="w-full px-4 py-2 border text-gray-800 border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-200 bg-gray-50/50 disabled:opacity-50"
                  required
                  disabled={loading}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(prev => !prev)}
                  className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-500 hover:text-gray-700 cursor-pointer"
                  tabIndex={-1}
                >                  {showPassword ? (
                    <EyeOff className="h-5 w-5" />
                  ) : (
                    <Eye className="h-5 w-5" />
                  )}
                </button>
              </div>
              {errors.password && (
                <p className="text-red-500 text-sm mt-1">{errors.password}</p>
              )}
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Confirm Password
              </label>
              <div className="relative">
                <input
                  type={showConfirmPassword ? "text" : "password"}
                  name="confirmPassword"
                  value={formData.confirmPassword}
                  onChange={handleInputChange}
                  className="w-full px-4 py-2 border text-gray-800 border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-200 bg-gray-50/50 disabled:opacity-50"
                  required
                  disabled={loading}
                />
                <button
                  type="button"
                  onClick={() => setShowConfirmPassword(prev => !prev)}
                  className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-500 hover:text-gray-700 cursor-pointer"
                  tabIndex={-1}
                >                  {showConfirmPassword ? (
                    <EyeOff className="h-5 w-5" />
                  ) : (
                    <Eye className="h-5 w-5" />
                  )}
                </button>
              </div>
              {errors.confirmPassword && (
                <p className="text-red-500 text-sm mt-1">{errors.confirmPassword}</p>
              )}
            </div>
          </div>      

          <motion.button
            type="submit"
            className="w-full mt-4 py-2 px-4 cursor-pointer bg-[#00B7FF] hover:bg-[#0077FF] text-white font-semibold rounded-lg shadow-sm transition-colors disabled:opacity-50 disabled:cursor-not-allowed relative"
            whileTap={{ scale: 0.97 }}
            disabled={loading}
          >
            {loading ? (
              <div className="h-5 w-5 border-2 border-white border-t-transparent rounded-full animate-spin mx-auto" />
            ) : (
              "Sign Up"
            )}
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
