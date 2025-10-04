import { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import {
    ArrowRight,
    Eye,
    EyeOff,
    CheckCircle2,
    School,
    Shield,
    Lock,
    AlertTriangle
} from "lucide-react";

const ResetPassword = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const userEmail = location.state?.email || "user@example.com";

    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);
    const [isSuccess, setIsSuccess] = useState(false);

    // Form state
    const [formData, setFormData] = useState({
        password: "",
        confirmPassword: ""
    });

    const [errors, setErrors] = useState({
        password: "",
        confirmPassword: "",
        general: ""
    });

    const [isLoading, setIsLoading] = useState(false);

    // Handle input changes
    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));

        // Clear error when user types
        if (errors[name as keyof typeof errors]) {
            setErrors(prev => ({ ...prev, [name]: "", general: "" }));
        }
    };

    // Password strength checker (same as signup page)
    const getPasswordStrength = (password: string) => {
        let strength = 0;
        if (password.length >= 8) strength++;
        if (/[A-Z]/.test(password)) strength++;
        if (/[a-z]/.test(password)) strength++;
        if (/[0-9]/.test(password)) strength++;
        if (/[^A-Za-z0-9]/.test(password)) strength++;
        return strength;
    };

    const passwordStrength = getPasswordStrength(formData.password);
    const strengthColors = ["#ea4335", "#fbbc05", "#fbbc05", "#34a853", "#34a853"];
    const strengthLabels = ["Weak", "Fair", "Fair", "Good", "Strong"];

    // Validation
    const validateForm = () => {
        const newErrors = { password: "", confirmPassword: "", general: "" };
        let isValid = true;

        if (!formData.password) {
            newErrors.password = "Password is required";
            isValid = false;
        } else if (formData.password.length < 8) {
            newErrors.password = "Password must be at least 8 characters";
            isValid = false;
        } else if (passwordStrength < 3) {
            newErrors.password = "Password must include uppercase, lowercase, and numbers";
            isValid = false;
        }

        if (!formData.confirmPassword) {
            newErrors.confirmPassword = "Please confirm your password";
            isValid = false;
        } else if (formData.password !== formData.confirmPassword) {
            newErrors.confirmPassword = "Passwords do not match";
            isValid = false;
        }

        setErrors(newErrors);
        return isValid;
    };

    // Handle form submission
    const handleSubmit = async () => {
        if (!validateForm()) return;

        setIsLoading(true);

        try {
            // TODO: Replace with actual API call
            await new Promise(resolve => setTimeout(resolve, 2000)); // Simulate API call
            
            // For demo purposes
            console.log("Password reset for:", userEmail, "New password:", formData.password);
            
            // Show success state
            setIsSuccess(true);
            
            // Auto-redirect after 3 seconds
            setTimeout(() => {
                navigate('/sign-in', { 
                    state: { 
                        message: "Password reset successfully! Please sign in with your new password.",
                        email: userEmail 
                    } 
                });
            }, 3000);
            
        } catch (error) {
            setErrors(prev => ({ 
                ...prev, 
                general: "Failed to reset password. Please try again." 
            }));
        } finally {
            setIsLoading(false);
        }
    };

    const handleBackToLogin = () => {
        navigate('/sign-in');
    };

    // Check if we have a valid reset session (in real app, verify token)
    useEffect(() => {
        // In a real app, you would verify the reset token here
        const hasValidToken = true; // Placeholder
        if (!hasValidToken) {
            navigate('/forgot-password');
        }
    }, [navigate]);

    return (
        <div className="min-h-screen flex" style={{ backgroundColor: "#f8f9fa" }}>

            {/* Left Side - Hero Section */}
            <div className="hidden lg:flex lg:w-1/2 bg-gradient-to-br from-blue-950 to-blue-900 p-12 flex-col justify-between text-white relative overflow-hidden">
                {/* Animated background elements */}
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
                            Create Your New Secure Password
                        </h1>
                        <p
                            className="text-xl text-white/90 animate-slide-up animation-delay-200"
                            style={{ fontFamily: "Roboto, sans-serif" }}
                        >
                            Set a strong, unique password to protect your financial data and 
                            ensure secure access to your account.
                        </p>

                        {/* Security Features */}
                        <div className="space-y-4 mt-12">
                            <div className="flex items-start gap-3 animate-slide-up animation-delay-400 hover:translate-x-2 transition-transform duration-300">
                                <div className="w-10 h-10 bg-white/20 rounded-lg flex items-center justify-center flex-shrink-0 backdrop-blur-sm shadow-lg">
                                    <Lock className="w-5 h-5" />
                                </div>
                                <div>
                                    <h3
                                        className="font-semibold text-lg"
                                        style={{ fontFamily: "Google Sans, sans-serif" }}
                                    >
                                        Strong Encryption
                                    </h3>
                                    <p
                                        className="text-white/80"
                                        style={{ fontFamily: "Roboto, sans-serif" }}
                                    >
                                        Your password is secured with advanced encryption
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
                                        Account Protection
                                    </h3>
                                    <p
                                        className="text-white/80"
                                        style={{ fontFamily: "Roboto, sans-serif" }}
                                    >
                                        Multi-layer security keeps your data safe
                                    </p>
                                </div>
                            </div>

                            <div className="flex items-start gap-3 animate-slide-up animation-delay-800 hover:translate-x-2 transition-transform duration-300">
                                <div className="w-10 h-10 bg-white/20 rounded-lg flex items-center justify-center flex-shrink-0 backdrop-blur-sm shadow-lg">
                                    <CheckCircle2 className="w-5 h-5" />
                                </div>
                                <div>
                                    <h3
                                        className="font-semibold text-lg"
                                        style={{ fontFamily: "Google Sans, sans-serif" }}
                                    >
                                        Instant Access
                                    </h3>
                                    <p
                                        className="text-white/80"
                                        style={{ fontFamily: "Roboto, sans-serif" }}
                                    >
                                        Immediate access to your account once complete
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Trust Indicators */}
                <div className="border-t border-white/20 pt-1 relative z-10">
                    <p
                        className="text-white/70 text-sm"
                        style={{ fontFamily: "Roboto, sans-serif" }}
                    >
                        Secured with enterprise-grade protection
                    </p>
                </div>
            </div>

            {/* Right Side - Form */}
            <div className="w-full lg:w-1/2 flex items-center justify-center p-8">
                <Card className="w-full max-w-md p-8 shadow-xl border-none">

                    {!isSuccess ? (
                        /* Password Reset Form */
                        <div className="space-y-6 animate-fade-in">
                            <div className="text-center">
                                <h2
                                    className="text-3xl font-bold mb-2"
                                    style={{
                                        fontFamily: "Google Sans, sans-serif",
                                        color: "#202124"
                                    }}
                                >
                                    Reset Your Password
                                </h2>
                                <p
                                    className="text-gray-600 mb-2"
                                    style={{ fontFamily: "Roboto, sans-serif" }}
                                >
                                    Create a new secure password for{" "}
                                    <span className="font-semibold text-blue-600">{userEmail}</span>
                                </p>
                            </div>

                            {/* Security Requirements */}
                            <div className="bg-amber-50 border border-amber-200 rounded-lg p-4">
                                <div className="flex items-start gap-2">
                                    <AlertTriangle className="w-5 h-5 text-amber-600 flex-shrink-0 mt-0.5" />
                                    <div>
                                        <p
                                            className="text-sm text-amber-800 font-medium mb-1"
                                            style={{ fontFamily: "Roboto, sans-serif" }}
                                        >
                                            Password Requirements:
                                        </p>
                                        <ul
                                            className="text-xs text-amber-700 space-y-1"
                                            style={{ fontFamily: "Roboto, sans-serif" }}
                                        >
                                            <li>• At least 8 characters long</li>
                                            <li>• Include uppercase and lowercase letters</li>
                                            <li>• Include at least one number</li>
                                            <li>• Consider using special characters</li>
                                        </ul>
                                    </div>
                                </div>
                            </div>

                            {/* General Error */}
                            {errors.general && (
                                <div className="bg-red-50 border border-red-200 rounded-lg p-3">
                                    <p className="text-red-800 text-sm" style={{ fontFamily: "Roboto, sans-serif" }}>
                                        {errors.general}
                                    </p>
                                </div>
                            )}

                            {/* New Password */}
                            <div>
                                <label
                                    className="block text-sm font-medium mb-2"
                                    style={{
                                        fontFamily: "Roboto, sans-serif",
                                        color: "#5f6368"
                                    }}
                                >
                                    New Password *
                                </label>
                                <div className="relative">
                                    <Input
                                        type={showPassword ? "text" : "password"}
                                        name="password"
                                        value={formData.password}
                                        onChange={handleChange}
                                        placeholder="••••••••"
                                        className="h-12 pr-12"
                                        style={{ fontFamily: "Roboto, sans-serif" }}
                                    />
                                    <button
                                        type="button"
                                        onClick={() => setShowPassword(!showPassword)}
                                        className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                                    >
                                        {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                                    </button>
                                </div>

                                {/* Password Strength Indicator */}
                                {formData.password && (
                                    <div className="mt-2">
                                        <div className="flex gap-1 mb-1">
                                            {[...Array(4)].map((_, i) => (
                                                <div
                                                    key={i}
                                                    className="h-1 flex-1 rounded-full transition-all duration-300"
                                                    style={{
                                                        backgroundColor: i < passwordStrength ? strengthColors[passwordStrength] : "#e8eaed"
                                                    }}
                                                />
                                            ))}
                                        </div>
                                        <p
                                            className="text-xs"
                                            style={{
                                                color: strengthColors[passwordStrength],
                                                fontFamily: "Roboto, sans-serif"
                                            }}
                                        >
                                            {strengthLabels[passwordStrength]} password
                                        </p>
                                    </div>
                                )}

                                {errors.password && (
                                    <p className="text-red-500 text-sm mt-1">{errors.password}</p>
                                )}
                            </div>

                            {/* Confirm Password */}
                            <div>
                                <label
                                    className="block text-sm font-medium mb-2"
                                    style={{
                                        fontFamily: "Roboto, sans-serif",
                                        color: "#5f6368"
                                    }}
                                >
                                    Confirm New Password *
                                </label>
                                <div className="relative">
                                    <Input
                                        type={showConfirmPassword ? "text" : "password"}
                                        name="confirmPassword"
                                        value={formData.confirmPassword}
                                        onChange={handleChange}
                                        placeholder="••••••••"
                                        className="h-12 pr-12"
                                        style={{ fontFamily: "Roboto, sans-serif" }}
                                    />
                                    <button
                                        type="button"
                                        onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                                        className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                                    >
                                        {showConfirmPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                                    </button>
                                </div>
                                {errors.confirmPassword && (
                                    <p className="text-red-500 text-sm mt-1">{errors.confirmPassword}</p>
                                )}
                            </div>

                            {/* Reset Button */}
                            <Button
                                onClick={handleSubmit}
                                disabled={isLoading || !formData.password || !formData.confirmPassword}
                                className="w-full h-12 text-base rounded-full"
                                style={{
                                    backgroundColor: isLoading || !formData.password || !formData.confirmPassword 
                                        ? "#9aa0a6" 
                                        : "#4285f4",
                                    fontFamily: "Roboto, sans-serif",
                                    fontWeight: 500
                                }}
                            >
                                {isLoading ? (
                                    <div className="flex items-center gap-2">
                                        <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                                        Resetting Password...
                                    </div>
                                ) : (
                                    <>
                                        Reset Password
                                        <ArrowRight className="w-5 h-5 ml-2" />
                                    </>
                                )}
                            </Button>

                            {/* Back to Login */}
                            <div className="text-center">
                                <button
                                    onClick={handleBackToLogin}
                                    className="text-sm text-blue-500 hover:text-blue-600 hover:underline"
                                    style={{ fontFamily: "Roboto, sans-serif" }}
                                >
                                    Back to Sign In
                                </button>
                            </div>
                        </div>
                    ) : (
                        /* Success State */
                        <div className="space-y-6 animate-fade-in text-center">
                            <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto">
                                <CheckCircle2 className="w-8 h-8 text-green-600" />
                            </div>

                            <div>
                                <h2
                                    className="text-3xl font-bold mb-2"
                                    style={{
                                        fontFamily: "Google Sans, sans-serif",
                                        color: "#202124"
                                    }}
                                >
                                    Password Reset Complete!
                                </h2>
                                <p
                                    className="text-gray-600 mb-4"
                                    style={{ fontFamily: "Roboto, sans-serif" }}
                                >
                                    Your password has been successfully reset. You'll be redirected to the sign-in page automatically.
                                </p>
                                <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                                    <p
                                        className="text-sm text-green-800"
                                        style={{ fontFamily: "Roboto, sans-serif" }}
                                    >
                                        <strong>Next Steps:</strong> Use your new password to sign in and access your account.
                                    </p>
                                </div>
                            </div>

                            <Button
                                onClick={handleBackToLogin}
                                className="w-full h-12 text-base rounded-full"
                                style={{
                                    backgroundColor: "#4285f4",
                                    fontFamily: "Roboto, sans-serif",
                                    fontWeight: 500
                                }}
                            >
                                Continue to Sign In
                                <ArrowRight className="w-5 h-5 ml-2" />
                            </Button>
                        </div>
                    )}
                </Card>
            </div>

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

export default ResetPassword;
