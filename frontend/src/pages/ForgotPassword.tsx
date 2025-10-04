import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import {
    ArrowRight,
    ArrowLeft,
    Mail,
    CheckCircle2,
    School,
    Shield,
    Clock,
    RefreshCw
} from "lucide-react";

const ForgotPassword = () => {
    const navigate = useNavigate();
    const [step, setStep] = useState(1); // 1: Email, 2: Verification, 3: Success

    // Form state
    const [formData, setFormData] = useState({
        email: "",
        verificationCode: ""
    });

    const [errors, setErrors] = useState({
        email: "",
        verificationCode: "",
        general: ""
    });

    const [isLoading, setIsLoading] = useState(false);
    const [resendCooldown, setResendCooldown] = useState(0);

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

    // Validation
    const validateEmail = () => {
        const newErrors = { email: "", verificationCode: "", general: "" };
        let isValid = true;

        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!formData.email.trim()) {
            newErrors.email = "Email is required";
            isValid = false;
        } else if (!emailRegex.test(formData.email)) {
            newErrors.email = "Please enter a valid email";
            isValid = false;
        }

        setErrors(newErrors);
        return isValid;
    };

    const validateVerificationCode = () => {
        const newErrors = { email: "", verificationCode: "", general: "" };
        let isValid = true;

        if (!formData.verificationCode.trim()) {
            newErrors.verificationCode = "Verification code is required";
            isValid = false;
        } else if (formData.verificationCode.length !== 6) {
            newErrors.verificationCode = "Please enter a valid 6-digit code";
            isValid = false;
        }

        setErrors(newErrors);
        return isValid;
    };

    // Handle form submission
    const handleSendCode = async () => {
        if (!validateEmail()) return;

        setIsLoading(true);

        try {
            // TODO: Replace with actual API call
            await new Promise(resolve => setTimeout(resolve, 1500)); // Simulate API call
            
            // For demo purposes
            console.log("Sending reset code to:", formData.email);
            setStep(2);
            startResendCooldown();
        } catch (error) {
            setErrors(prev => ({ 
                ...prev, 
                general: "Failed to send reset code. Please try again." 
            }));
        } finally {
            setIsLoading(false);
        }
    };

    const handleVerifyCode = async () => {
        if (!validateVerificationCode()) return;

        setIsLoading(true);

        try {
            // TODO: Replace with actual API call
            await new Promise(resolve => setTimeout(resolve, 1500)); // Simulate API call
            
            // For demo purposes - accept "123456" as valid code
            if (formData.verificationCode === "123456") {
                setStep(3);
            } else {
                setErrors(prev => ({ 
                    ...prev, 
                    verificationCode: "Invalid verification code. Please try again." 
                }));
            }
        } catch (error) {
            setErrors(prev => ({ 
                ...prev, 
                general: "Verification failed. Please try again." 
            }));
        } finally {
            setIsLoading(false);
        }
    };

    const handleResendCode = async () => {
        if (resendCooldown > 0) return;

        setIsLoading(true);

        try {
            // TODO: Replace with actual API call
            await new Promise(resolve => setTimeout(resolve, 1000));
            console.log("Resending reset code to:", formData.email);
            startResendCooldown();
        } catch (error) {
            setErrors(prev => ({ 
                ...prev, 
                general: "Failed to resend code. Please try again." 
            }));
        } finally {
            setIsLoading(false);
        }
    };

    const startResendCooldown = () => {
        setResendCooldown(60);
        const timer = setInterval(() => {
            setResendCooldown(prev => {
                if (prev <= 1) {
                    clearInterval(timer);
                    return 0;
                }
                return prev - 1;
            });
        }, 1000);
    };

    const handleBack = () => {
        if (step === 1) {
            navigate('/sign-in');
        } else {
            setStep(step - 1);
        }
    };

    const handleCreateNewPassword = () => {
        // TODO: Navigate to reset password page with token
        navigate('/reset-password', { state: { email: formData.email } });
    };

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
                            Reset Your Password Securely
                        </h1>
                        <p
                            className="text-xl text-white/90 animate-slide-up animation-delay-200"
                            style={{ fontFamily: "Roboto, sans-serif" }}
                        >
                            We'll help you get back into your account quickly and securely. 
                            Your financial data remains protected throughout the process.
                        </p>

                        {/* Features */}
                        <div className="space-y-4 mt-12">
                            <div className="flex items-start gap-3 animate-slide-up animation-delay-400 hover:translate-x-2 transition-transform duration-300">
                                <div className="w-10 h-10 bg-white/20 rounded-lg flex items-center justify-center flex-shrink-0 backdrop-blur-sm shadow-lg">
                                    <Shield className="w-5 h-5" />
                                </div>
                                <div>
                                    <h3
                                        className="font-semibold text-lg"
                                        style={{ fontFamily: "Google Sans, sans-serif" }}
                                    >
                                        Secure Process
                                    </h3>
                                    <p
                                        className="text-white/80"
                                        style={{ fontFamily: "Roboto, sans-serif" }}
                                    >
                                        Multi-layer verification keeps your account safe
                                    </p>
                                </div>
                            </div>

                            <div className="flex items-start gap-3 animate-slide-up animation-delay-600 hover:translate-x-2 transition-transform duration-300">
                                <div className="w-10 h-10 bg-white/20 rounded-lg flex items-center justify-center flex-shrink-0 backdrop-blur-sm shadow-lg">
                                    <Mail className="w-5 h-5" />
                                </div>
                                <div>
                                    <h3
                                        className="font-semibold text-lg"
                                        style={{ fontFamily: "Google Sans, sans-serif" }}
                                    >
                                        Email Verification
                                    </h3>
                                    <p
                                        className="text-white/80"
                                        style={{ fontFamily: "Roboto, sans-serif" }}
                                    >
                                        Receive a secure code in your registered email
                                    </p>
                                </div>
                            </div>

                            <div className="flex items-start gap-3 animate-slide-up animation-delay-800 hover:translate-x-2 transition-transform duration-300">
                                <div className="w-10 h-10 bg-white/20 rounded-lg flex items-center justify-center flex-shrink-0 backdrop-blur-sm shadow-lg">
                                    <Clock className="w-5 h-5" />
                                </div>
                                <div>
                                    <h3
                                        className="font-semibold text-lg"
                                        style={{ fontFamily: "Google Sans, sans-serif" }}
                                    >
                                        Quick Recovery
                                    </h3>
                                    <p
                                        className="text-white/80"
                                        style={{ fontFamily: "Roboto, sans-serif" }}
                                    >
                                        Get back to managing your finances in minutes
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
                        Secured with bank-level encryption
                    </p>
                </div>
            </div>

            {/* Right Side - Form */}
            <div className="w-full lg:w-1/2 flex items-center justify-center p-8">
                <Card className="w-full max-w-md p-8 shadow-xl border-none">

                    {/* Progress Indicator */}
                    <div className="flex items-center justify-center gap-2 mb-8">
                        {[1, 2, 3].map((s) => (
                            <div
                                key={s}
                                className={`h-2 rounded-full transition-all duration-300 ${
                                    s <= step ? "w-12" : "w-8"
                                } ${
                                    s <= step ? "bg-blue-500" : "bg-gray-200"
                                }`}
                            />
                        ))}
                    </div>

                    {/* Step 1: Email Input */}
                    {step === 1 && (
                        <div className="space-y-6 animate-fade-in">
                            <div className="text-center">
                                <h2
                                    className="text-3xl font-bold mb-2"
                                    style={{
                                        fontFamily: "Google Sans, sans-serif",
                                        color: "#202124"
                                    }}
                                >
                                    Forgot Password?
                                </h2>
                                <p
                                    className="text-gray-600"
                                    style={{ fontFamily: "Roboto, sans-serif" }}
                                >
                                    Enter your email address and we'll send you a verification code
                                </p>
                            </div>

                            {/* General Error */}
                            {errors.general && (
                                <div className="bg-red-50 border border-red-200 rounded-lg p-3">
                                    <p className="text-red-800 text-sm" style={{ fontFamily: "Roboto, sans-serif" }}>
                                        {errors.general}
                                    </p>
                                </div>
                            )}

                            {/* Email */}
                            <div>
                                <label
                                    className="block text-sm font-medium mb-2"
                                    style={{
                                        fontFamily: "Roboto, sans-serif",
                                        color: "#5f6368"
                                    }}
                                >
                                    Email Address *
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
                                    />
                                    <Mail className="w-5 h-5 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
                                </div>
                                {errors.email && (
                                    <p className="text-red-500 text-sm mt-1">{errors.email}</p>
                                )}
                            </div>

                            {/* Buttons */}
                            <div className="space-y-3">
                                <Button
                                    onClick={handleSendCode}
                                    disabled={isLoading}
                                    className="w-full h-12 text-base rounded-full"
                                    style={{
                                        backgroundColor: isLoading ? "#9aa0a6" : "#4285f4",
                                        fontFamily: "Roboto, sans-serif",
                                        fontWeight: 500
                                    }}
                                >
                                    {isLoading ? (
                                        <div className="flex items-center gap-2">
                                            <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                                            Sending Code...
                                        </div>
                                    ) : (
                                        <>
                                            Send Verification Code
                                            <ArrowRight className="w-5 h-5 ml-2" />
                                        </>
                                    )}
                                </Button>

                                <Button
                                    onClick={handleBack}
                                    variant="outline"
                                    className="w-full h-12 text-base rounded-full"
                                    style={{ fontFamily: "Roboto, sans-serif" }}
                                >
                                    <ArrowLeft className="w-5 h-5 mr-2" />
                                    Back to Sign In
                                </Button>
                            </div>
                        </div>
                    )}

                    {/* Step 2: Verification Code */}
                    {step === 2 && (
                        <div className="space-y-6 animate-fade-in">
                            <div className="text-center">
                                <h2
                                    className="text-3xl font-bold mb-2"
                                    style={{
                                        fontFamily: "Google Sans, sans-serif",
                                        color: "#202124"
                                    }}
                                >
                                    Check Your Email
                                </h2>
                                <p
                                    className="text-gray-600"
                                    style={{ fontFamily: "Roboto, sans-serif" }}
                                >
                                    We sent a 6-digit code to{" "}
                                    <span className="font-semibold text-blue-600">{formData.email}</span>
                                </p>
                            </div>

                            {/* Demo Code Helper */}
                            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                                <p
                                    className="text-sm text-blue-800"
                                    style={{ fontFamily: "Roboto, sans-serif" }}
                                >
                                    <strong>Demo Code:</strong> 123456
                                </p>
                            </div>

                            {/* General Error */}
                            {errors.general && (
                                <div className="bg-red-50 border border-red-200 rounded-lg p-3">
                                    <p className="text-red-800 text-sm" style={{ fontFamily: "Roboto, sans-serif" }}>
                                        {errors.general}
                                    </p>
                                </div>
                            )}

                            {/* Verification Code */}
                            <div>
                                <label
                                    className="block text-sm font-medium mb-2"
                                    style={{
                                        fontFamily: "Roboto, sans-serif",
                                        color: "#5f6368"
                                    }}
                                >
                                    Verification Code *
                                </label>
                                <Input
                                    type="text"
                                    name="verificationCode"
                                    value={formData.verificationCode}
                                    onChange={handleChange}
                                    placeholder="Enter 6-digit code"
                                    maxLength={6}
                                    className="h-12 text-center text-2xl tracking-widest"
                                    style={{ fontFamily: "Roboto, sans-serif" }}
                                />
                                {errors.verificationCode && (
                                    <p className="text-red-500 text-sm mt-1">{errors.verificationCode}</p>
                                )}
                            </div>

                            {/* Resend Code */}
                            <div className="text-center">
                                <p
                                    className="text-sm text-gray-600 mb-2"
                                    style={{ fontFamily: "Roboto, sans-serif" }}
                                >
                                    Didn't receive the code?
                                </p>
                                <button
                                    onClick={handleResendCode}
                                    disabled={resendCooldown > 0 || isLoading}
                                    className={`text-sm font-medium ${
                                        resendCooldown > 0 ? 'text-gray-400' : 'text-blue-600 hover:text-blue-800 hover:underline'
                                    }`}
                                    style={{ fontFamily: "Roboto, sans-serif" }}
                                >
                                    {resendCooldown > 0 ? (
                                        `Resend in ${resendCooldown}s`
                                    ) : (
                                        <>
                                            <RefreshCw className="w-4 h-4 inline mr-1" />
                                            Resend Code
                                        </>
                                    )}
                                </button>
                            </div>

                            {/* Buttons */}
                            <div className="space-y-3">
                                <Button
                                    onClick={handleVerifyCode}
                                    disabled={isLoading}
                                    className="w-full h-12 text-base rounded-full"
                                    style={{
                                        backgroundColor: isLoading ? "#9aa0a6" : "#4285f4",
                                        fontFamily: "Roboto, sans-serif",
                                        fontWeight: 500
                                    }}
                                >
                                    {isLoading ? (
                                        <div className="flex items-center gap-2">
                                            <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                                            Verifying...
                                        </div>
                                    ) : (
                                        <>
                                            Verify Code
                                            <ArrowRight className="w-5 h-5 ml-2" />
                                        </>
                                    )}
                                </Button>

                                <Button
                                    onClick={handleBack}
                                    variant="outline"
                                    className="w-full h-12 text-base rounded-full"
                                    style={{ fontFamily: "Roboto, sans-serif" }}
                                >
                                    <ArrowLeft className="w-5 h-5 mr-2" />
                                    Change Email
                                </Button>
                            </div>
                        </div>
                    )}

                    {/* Step 3: Success */}
                    {step === 3 && (
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
                                    Verification Successful
                                </h2>
                                <p
                                    className="text-gray-600"
                                    style={{ fontFamily: "Roboto, sans-serif" }}
                                >
                                    Your email has been verified. You can now create a new password.
                                </p>
                            </div>

                            <Button
                                onClick={handleCreateNewPassword}
                                className="w-full h-12 text-base rounded-full"
                                style={{
                                    backgroundColor: "#4285f4",
                                    fontFamily: "Roboto, sans-serif",
                                    fontWeight: 500
                                }}
                            >
                                Create New Password
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

export default ForgotPassword;
