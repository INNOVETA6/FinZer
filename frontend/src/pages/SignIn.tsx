// SignIn.tsx (Updated with Authentication)
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import {
    Eye,
    EyeOff,
    School,
    TrendingUp,
    Shield,
    Target,
    ArrowRight,
    Mail,
    Lock,
    Loader2
} from "lucide-react";
import { authService } from "@/services/authService";

const SignIn = () => {
    const navigate = useNavigate();
    const { toast } = useToast();
    const [showPassword, setShowPassword] = useState(false);
    const [isLoading, setIsLoading] = useState(false);

    // Form state
    const [formData, setFormData] = useState({
        email: "",
        password: "",
        rememberMe: false
    });

    const [errors, setErrors] = useState({
        email: "",
        password: ""
    });

    // Handle input changes
    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value, type } = e.target;
        const checked = (e.target as HTMLInputElement).checked;

        setFormData(prev => ({
            ...prev,
            [name]: type === "checkbox" ? checked : value
        }));

        // Clear error when user types
        if (errors[name as keyof typeof errors]) {
            setErrors(prev => ({ ...prev, [name]: "" }));
        }
    };

    // Validation
    const validateForm = () => {
        const newErrors = { email: "", password: "" };
        let isValid = true;

        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!formData.email.trim()) {
            newErrors.email = "Email is required";
            isValid = false;
        } else if (!emailRegex.test(formData.email)) {
            newErrors.email = "Please enter a valid email";
            isValid = false;
        }

        if (!formData.password) {
            newErrors.password = "Password is required";
            isValid = false;
        }

        setErrors(newErrors);
        return isValid;
    };

    // Handle form submission with authentication
    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        
        if (!validateForm()) return;

        setIsLoading(true);
        
        try {
            await authService.signIn({
                email: formData.email,
                password: formData.password,
                remember_me: formData.rememberMe
            });

            toast({
                title: "Welcome back! 👋",
                description: "You have successfully signed in to your account.",
            });
            
            // Navigate to dashboard
            navigate('/dashboard');

        } catch (error: any) {
            toast({
                title: "Sign In Failed",
                description: error.message || "Please check your credentials and try again.",
                variant: "destructive"
            });
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="min-h-screen flex" style={{ backgroundColor: "#f8f9fa" }}>

            {/* Left Side - Hero Section (unchanged) */}
            <div className="hidden lg:flex lg:w-1/2 bg-gradient-to-br from-blue-950 to-blue-900 p-12 flex-col justify-between text-white relative overflow-hidden">
                {/* All your existing hero section code remains the same */}
                <div className="absolute inset-0 opacity-30">
                    <div className="absolute top-20 left-10 w-72 h-72 bg-blue-900 rounded-full mix-blend-overlay filter blur-3xl animate-blob"></div>
                    <div className="absolute top-40 right-10 w-72 h-72 bg-blue-800 rounded-full mix-blend-overlay filter blur-3xl animate-blob animation-delay-2000"></div>
                    <div className="absolute -bottom-8 left-20 w-72 h-72 bg-indigo-900 rounded-full mix-blend-overlay filter blur-3xl animate-blob animation-delay-4000"></div>
                </div>

                <div className="relative z-10">
                    {/* Logo */}
                    <div className="flex items-center gap-3 mb-16 animate-fade-in">
                        <div className="w-12 h-12 bg-white/20 rounded-full flex items-center justify-center backdrop-blur-sm shadow-lg">
                            <School className="w-6 h-6" />
                        </div>
                        <span
                            className="text-3xl font-bold"
                            style={{ fontFamily: "Google Sans, sans-serif" }}
                        >
                            FinZer
                        </span>
                    </div>

                    {/* Hero Content */}
                    <div className="space-y-8">
                        <h1
                            className="text-5xl font-bold leading-tight animate-slide-up"
                            style={{ fontFamily: "Google Sans, sans-serif" }}
                        >
                            Welcome Back to Your Financial Journey
                        </h1>
                        <p
                            className="text-xl text-white/90 animate-slide-up animation-delay-200"
                            style={{ fontFamily: "Roboto, sans-serif" }}
                        >
                            Continue managing your finances with personalized insights,
                            smart budgeting tools, and investment recommendations.
                        </p>

                        {/* Features */}
                        <div className="space-y-4 mt-12">
                            <div className="flex items-start gap-3 animate-slide-up animation-delay-400 hover:translate-x-2 transition-transform duration-300">
                                <div className="w-10 h-10 bg-white/20 rounded-lg flex items-center justify-center flex-shrink-0 backdrop-blur-sm shadow-lg">
                                    <TrendingUp className="w-5 h-5" />
                                </div>
                                <div>
                                    <h3
                                        className="font-semibold text-lg"
                                        style={{ fontFamily: "Google Sans, sans-serif" }}
                                    >
                                        Real-time Insights
                                    </h3>
                                    <p
                                        className="text-white/80"
                                        style={{ fontFamily: "Roboto, sans-serif" }}
                                    >
                                        Track your spending patterns and financial goals
                                    </p>
                                </div>
                            </div>

                            <div className="flex items-start gap-3 animate-slide-up animation-delay-600 hover:translate-x-2 transition-transform duration-300">
                                <div className="w-10 h-10 bg-white/20 rounded-lg flex items-center justify-center flex-shrink-0 backdrop-blur-sm shadow-lg">
                                    <Shield className="w-5 h-5" />
                                </div>
                                <div>
                                    <h3
                                        className="font-semibold text-lg"
                                        style={{ fontFamily: "Google Sans, sans-serif" }}
                                    >
                                        Secure Access
                                    </h3>
                                    <p
                                        className="text-white/80"
                                        style={{ fontFamily: "Roboto, sans-serif" }}
                                    >
                                        Your data is protected with bank-level security
                                    </p>
                                </div>
                            </div>

                            <div className="flex items-start gap-3 animate-slide-up animation-delay-800 hover:translate-x-2 transition-transform duration-300">
                                <div className="w-10 h-10 bg-white/20 rounded-lg flex items-center justify-center flex-shrink-0 backdrop-blur-sm shadow-lg">
                                    <Target className="w-5 h-5" />
                                </div>
                                <div>
                                    <h3
                                        className="font-semibold text-lg"
                                        style={{ fontFamily: "Google Sans, sans-serif" }}
                                    >
                                        Personalized Dashboard
                                    </h3>
                                    <p
                                        className="text-white/80"
                                        style={{ fontFamily: "Roboto, sans-serif" }}
                                    >
                                        Customized experience based on your preferences
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Right Side - Form */}
            <div className="w-full lg:w-1/2 flex items-center justify-center p-8">
                <Card className="w-full max-w-md p-8 shadow-xl border-none">
                    <div className="space-y-6 animate-fade-in">
                        <div className="text-center">
                            <h2
                                className="text-3xl font-bold mb-2"
                                style={{
                                    fontFamily: "Google Sans, sans-serif",
                                    color: "#202124"
                                }}
                            >
                                Welcome Back
                            </h2>
                            <p
                                className="text-gray-600"
                                style={{ fontFamily: "Roboto, sans-serif" }}
                            >
                                Sign in to your account
                            </p>
                        </div>

                        <form onSubmit={handleSubmit} className="space-y-6">
                            {/* Email */}
                            <div>
                                <label
                                    className="block text-sm font-medium mb-2"
                                    style={{
                                        fontFamily: "Roboto, sans-serif",
                                        color: "#5f6368"
                                    }}
                                >
                                    Email Address
                                </label>
                                <div className="relative">
                                    <Input
                                        type="email"
                                        name="email"
                                        value={formData.email}
                                        onChange={handleChange}
                                        placeholder="john@example.com"
                                        className="h-12 pl-12"
                                        style={{ fontFamily: "Roboto, sans-serif" }}
                                        disabled={isLoading}
                                    />
                                    <Mail className="w-5 h-5 absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                                </div>
                                {errors.email && (
                                    <p className="text-red-500 text-sm mt-1">{errors.email}</p>
                                )}
                            </div>

                            {/* Password */}
                            <div>
                                <label
                                    className="block text-sm font-medium mb-2"
                                    style={{
                                        fontFamily: "Roboto, sans-serif",
                                        color: "#5f6368"
                                    }}
                                >
                                    Password
                                </label>
                                <div className="relative">
                                    <Input
                                        type={showPassword ? "text" : "password"}
                                        name="password"
                                        value={formData.password}
                                        onChange={handleChange}
                                        placeholder="••••••••"
                                        className="h-12 pl-12 pr-12"
                                        style={{ fontFamily: "Roboto, sans-serif" }}
                                        disabled={isLoading}
                                    />
                                    <Lock className="w-5 h-5 absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                                    <button
                                        type="button"
                                        onClick={() => setShowPassword(!showPassword)}
                                        className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                                        disabled={isLoading}
                                    >
                                        {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                                    </button>
                                </div>
                                {errors.password && (
                                    <p className="text-red-500 text-sm mt-1">{errors.password}</p>
                                )}
                            </div>

                            {/* Remember Me & Forgot Password */}
                            <div className="flex items-center justify-between">
                                <label className="flex items-center gap-2 cursor-pointer">
                                    <input
                                        type="checkbox"
                                        name="rememberMe"
                                        checked={formData.rememberMe}
                                        onChange={handleChange}
                                        className="w-4 h-4 accent-blue-500"
                                        disabled={isLoading}
                                    />
                                    <span
                                        className="text-sm text-gray-600"
                                        style={{ fontFamily: "Roboto, sans-serif" }}
                                    >
                                        Remember me
                                    </span>
                                </label>
                                <button
                                    type="button"
                                    className="text-sm text-blue-500 hover:underline"
                                    style={{ fontFamily: "Roboto, sans-serif" }}
                                    onClick={() => navigate("/forgot-password")}
                                    disabled={isLoading}
                                >
                                    Forgot password?
                                </button>
                            </div>

                            {/* Sign In Button */}
                            <Button
                                type="submit"
                                disabled={isLoading}
                                className="w-full h-12 text-base rounded-full"
                                style={{
                                    backgroundColor: "#4285f4",
                                    fontFamily: "Roboto, sans-serif",
                                    fontWeight: 500
                                }}
                            >
                                {isLoading ? (
                                    <>
                                        <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                                        Signing In...
                                    </>
                                ) : (
                                    <>
                                        Sign In
                                        <ArrowRight className="w-5 h-5 ml-2" />
                                    </>
                                )}
                            </Button>

                            {/* Divider */}
                            <div className="relative">
                                <div className="absolute inset-0 flex items-center">
                                    <div className="w-full border-t" style={{ borderColor: "#e8eaed" }}></div>
                                </div>
                                <div className="relative flex justify-center text-sm">
                                    <span
                                        className="px-4 bg-white text-gray-500"
                                        style={{ fontFamily: "Roboto, sans-serif" }}
                                    >
                                        or continue with
                                    </span>
                                </div>
                            </div>

                           
                        </form>

                        {/* Don't have account */}
                        <div
                            className="text-center pt-6 border-t"
                            style={{ borderColor: "#e8eaed" }}
                        >
                            <p
                                className="text-sm text-gray-600"
                                style={{ fontFamily: "Roboto, sans-serif" }}
                            >
                                Don't have an account?{" "}
                                <button
                                    onClick={() => navigate("/sign-up")}
                                    className="text-blue-500 font-medium hover:underline"
                                    disabled={isLoading}
                                >
                                    Sign Up
                                </button>
                            </p>
                        </div>
                    </div>
                </Card>
            </div>

            {/* All your existing styles remain the same */}
            <style>{`
                @keyframes fade-in {
                    from {
                        opacity: 0;
                        transform: translateY(10px);
                    }
                    to {
                        opacity: 1;
                        transform: translateY(0);
                    }
                }

                .animate-fade-in {
                    animation: fade-in 0.3s ease-out;
                }

                @keyframes blob {
                    0%, 100% {
                        transform: translate(0, 0) scale(1);
                    }
                    33% {
                        transform: translate(30px, -50px) scale(1.1);
                    }
                    66% {
                        transform: translate(-20px, 20px) scale(0.9);
                    }
                }

                @keyframes slide-up {
                    from {
                        opacity: 0;
                        transform: translateY(20px);
                    }
                    to {
                        opacity: 1;
                        transform: translateY(0);
                    }
                }

                .animate-blob {
                    animation: blob 7s infinite;
                }

                .animate-slide-up {
                    animation: slide-up 0.6s ease-out;
                }

                .animation-delay-200 {
                    animation-delay: 0.2s;
                    opacity: 0;
                    animation-fill-mode: forwards;
                }

                .animation-delay-400 {
                    animation-delay: 0.4s;
                    opacity: 0;
                    animation-fill-mode: forwards;
                }

                .animation-delay-600 {
                    animation-delay: 0.6s;
                    opacity: 0;
                    animation-fill-mode: forwards;
                }

                .animation-delay-800 {
                    animation-delay: 0.8s;
                    opacity: 0;
                    animation-fill-mode: forwards;
                }

                .animation-delay-2000 {
                    animation-delay: 2s;
                }

                .animation-delay-4000 {
                    animation-delay: 4s;
                }
            `}</style>
        </div>
    );
};

export default SignIn;
