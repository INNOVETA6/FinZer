// SignUp.tsx (Updated with Authentication)
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
    ArrowRight,
    ArrowLeft,
    CheckCircle2,
    Eye,
    EyeOff,
    School,
    TrendingUp,
    Shield,
    Target,
    Loader2
} from "lucide-react";
import { authService } from "@/services/authService";

const SignUp = () => {
    const navigate = useNavigate();
    const [step, setStep] = useState(1);
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);
    const [isLoading, setIsLoading] = useState(false);

    // Form state - matches backend schema
    const [formData, setFormData] = useState({
        fullName: "",
        email: "",
        password: "",
        confirmPassword: "",
        dateOfBirth: "",
        phoneNumber: "",
        country: "India",
        monthlyIncome: "",
        financialGoal: "",
        financialStatus: "",
        agreeToTerms: false,
        subscribeNewsletter: false
    });

    const [errors, setErrors] = useState({
        fullName: "",
        email: "",
        password: "",
        confirmPassword: ""
    });

    // Handle input changes
    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
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

    // Password strength checker (unchanged)
    const getPasswordStrength = (password: string) => {
        let strength = 0;
        if (password.length >= 8) strength++;
        if (/[A-Z]/.test(password)) strength++;
        if (/[0-9]/.test(password)) strength++;
        if (/[^A-Za-z0-9]/.test(password)) strength++;
        return strength;
    };

    const passwordStrength = getPasswordStrength(formData.password);
    const strengthColors = ["#ea4335", "#fbbc05", "#fbbc05", "#34a853", "#34a853"];
    const strengthLabels = ["Weak", "Fair", "Fair", "Good", "Strong"];

    // Validation (unchanged)
    const validateStep1 = () => {
        const newErrors = { fullName: "", email: "", password: "", confirmPassword: "" };
        let isValid = true;

        if (!formData.fullName.trim()) {
            newErrors.fullName = "Full name is required";
            isValid = false;
        }

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
        } else if (formData.password.length < 8) {
            newErrors.password = "Password must be at least 8 characters";
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

    const validateStep2 = () => {
        if (!formData.dateOfBirth || !formData.country) {
            return false;
        }
        return true;
    };

    // Handle navigation between steps
    const handleNext = () => {
        if (step === 1 && validateStep1()) {
            setStep(2);
        } else if (step === 2 && validateStep2()) {
            setStep(3);
        }
    };

    const handleBack = () => {
        if (step > 1) setStep(step - 1);
    };

    const handleSkip = () => {
        setStep(3);
    };

    // Updated form submission with backend integration
    const handleSubmit = async () => {
        if (!formData.agreeToTerms) {
            alert("Please accept the Terms & Conditions");
            return;
        }

        setIsLoading(true);

        try {
            // Prepare data for backend API
            const signupData = {
                name: formData.fullName,
                email: formData.email,
                password: formData.password,
                confirm_password: formData.confirmPassword,
                date_of_birth: formData.dateOfBirth || undefined,
                phone_number: formData.phoneNumber || undefined,
                country: formData.country,
                monthly_income_range: formData.monthlyIncome || undefined,
                financial_goal: formData.financialGoal || undefined,
                financial_status: formData.financialStatus || undefined,
                subscribe_newsletter: formData.subscribeNewsletter,
                agree_to_terms: formData.agreeToTerms
            };

            // Call authentication service
            await authService.signUp(signupData);

            // Success notification (you can implement toast here)
            console.log("✅ Account created successfully!");
            alert("Account created successfully! Welcome to FinZer!");

            // Navigate to sign-in page
            navigate('/sign-in');

        } catch (error: any) {
            console.error("❌ Signup failed:", error.message);
            alert(`Registration failed: ${error.message}`);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="min-h-screen flex" style={{ backgroundColor: "#f8f9fa" }}>

            {/* Left Side - Hero Section (unchanged) */}
            <div className="hidden lg:flex lg:w-1/2 bg-gradient-to-br from-blue-950 to-blue-900 p-12 flex-col justify-between text-white relative overflow-hidden">
                {/* All your existing hero section code remains exactly the same */}
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
                            Take Control of Your Financial Future
                        </h1>
                        <p
                            className="text-xl text-white/90 animate-slide-up animation-delay-200"
                            style={{ fontFamily: "Roboto, sans-serif" }}
                        >
                            Join thousands of users managing their finances smarter with personalized budgeting,
                            investment recommendations, and real-time insights.
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
                                        Smart Budget Planning
                                    </h3>
                                    <p
                                        className="text-white/80"
                                        style={{ fontFamily: "Roboto, sans-serif" }}
                                    >
                                        AI-powered recommendations tailored to your spending habits
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
                                        Secure & Private
                                    </h3>
                                    <p
                                        className="text-white/80"
                                        style={{ fontFamily: "Roboto, sans-serif" }}
                                    >
                                        Bank-level encryption to keep your data safe
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
                                        Goal Tracking
                                    </h3>
                                    <p
                                        className="text-white/80"
                                        style={{ fontFamily: "Roboto, sans-serif" }}
                                    >
                                        Set and achieve your financial goals with ease
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
                        Trusted by 10,000+ users worldwide
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
                                    s === step ? "w-12" : "w-8"
                                } ${s <= step ? "bg-blue-500" : "bg-gray-200"}`}
                            />
                        ))}
                    </div>

                    {/* Step 1: Account Creation */}
                    {step === 1 && (
                        <div className="space-y-6 animate-fade-in">
                            <div>
                                <h2
                                    className="text-3xl font-bold mb-2"
                                    style={{
                                        fontFamily: "Google Sans, sans-serif",
                                        color: "#202124"
                                    }}
                                >
                                    Create Account
                                </h2>
                                <p
                                    className="text-gray-600"
                                    style={{ fontFamily: "Roboto, sans-serif" }}
                                >
                                    Start your financial journey today
                                </p>
                            </div>

                            {/* Full Name */}
                            <div>
                                <label
                                    className="block text-sm font-medium mb-2"
                                    style={{
                                        fontFamily: "Roboto, sans-serif",
                                        color: "#5f6368"
                                    }}
                                >
                                    Full Name *
                                </label>
                                <Input
                                    type="text"
                                    name="fullName"
                                    value={formData.fullName}
                                    onChange={handleChange}
                                    placeholder="John Doe"
                                    className="h-12"
                                    style={{ fontFamily: "Roboto, sans-serif" }}
                                    disabled={isLoading}
                                />
                                {errors.fullName && (
                                    <p className="text-red-500 text-sm mt-1">{errors.fullName}</p>
                                )}
                            </div>

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
                                <Input
                                    type="email"
                                    name="email"
                                    value={formData.email}
                                    onChange={handleChange}
                                    placeholder="john@example.com"
                                    className="h-12"
                                    style={{ fontFamily: "Roboto, sans-serif" }}
                                    disabled={isLoading}
                                />
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
                                    Password *
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
                                        disabled={isLoading}
                                    />
                                    <button
                                        type="button"
                                        onClick={() => setShowPassword(!showPassword)}
                                        className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                                        disabled={isLoading}
                                    >
                                        {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                                    </button>
                                </div>
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
                                    Confirm Password *
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
                                        disabled={isLoading}
                                    />
                                    <button
                                        type="button"
                                        onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                                        className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                                        disabled={isLoading}
                                    >
                                        {showConfirmPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                                    </button>
                                </div>
                                {errors.confirmPassword && (
                                    <p className="text-red-500 text-sm mt-1">{errors.confirmPassword}</p>
                                )}
                            </div>

                            <Button
                                onClick={handleNext}
                                disabled={isLoading}
                                className="w-full h-12 text-base rounded-full"
                                style={{
                                    backgroundColor: "#4285f4",
                                    fontFamily: "Roboto, sans-serif",
                                    fontWeight: 500
                                }}
                            >
                                Continue
                                <ArrowRight className="w-5 h-5 ml-2" />
                            </Button>
                        </div>
                    )}

                    {/* Step 2: Profile Setup */}
                    {step === 2 && (
                        <div className="space-y-6 animate-fade-in">
                            <div>
                                <h2
                                    className="text-3xl font-bold mb-2"
                                    style={{
                                        fontFamily: "Google Sans, sans-serif",
                                        color: "#202124"
                                    }}
                                >
                                    Profile Setup
                                </h2>
                                <p
                                    className="text-gray-600"
                                    style={{ fontFamily: "Roboto, sans-serif" }}
                                >
                                    Tell us a bit about yourself
                                </p>
                            </div>

                            {/* Date of Birth */}
                            <div>
                                <label
                                    className="block text-sm font-medium mb-2"
                                    style={{
                                        fontFamily: "Roboto, sans-serif",
                                        color: "#5f6368"
                                    }}
                                >
                                    Date of Birth *
                                </label>
                                <Input
                                    type="date"
                                    name="dateOfBirth"
                                    value={formData.dateOfBirth}
                                    onChange={handleChange}
                                    className="h-12"
                                    style={{ fontFamily: "Roboto, sans-serif" }}
                                    disabled={isLoading}
                                />
                            </div>

                            {/* Phone Number */}
                            <div>
                                <label
                                    className="block text-sm font-medium mb-2"
                                    style={{
                                        fontFamily: "Roboto, sans-serif",
                                        color: "#5f6368"
                                    }}
                                >
                                    Phone Number (Optional)
                                </label>
                                <Input
                                    type="tel"
                                    name="phoneNumber"
                                    value={formData.phoneNumber}
                                    onChange={handleChange}
                                    placeholder="+91 98765 43210"
                                    className="h-12"
                                    style={{ fontFamily: "Roboto, sans-serif" }}
                                    disabled={isLoading}
                                />
                            </div>

                            {/* Country */}
                            <div>
                                <label
                                    className="block text-sm font-medium mb-2"
                                    style={{
                                        fontFamily: "Roboto, sans-serif",
                                        color: "#5f6368"
                                    }}
                                >
                                    Country *
                                </label>
                                <select
                                    name="country"
                                    value={formData.country}
                                    onChange={handleChange}
                                    className="w-full h-12 px-3 border border-gray-300 rounded-md"
                                    style={{ fontFamily: "Roboto, sans-serif" }}
                                    disabled={isLoading}
                                >
                                    <option value="India">India</option>
                                    <option value="United States">United States</option>
                                    <option value="United Kingdom">United Kingdom</option>
                                    <option value="Canada">Canada</option>
                                    <option value="Australia">Australia</option>
                                    <option value="Other">Other</option>
                                </select>
                            </div>

                            <div className="flex gap-3">
                                <Button
                                    onClick={handleBack}
                                    variant="outline"
                                    className="flex-1 h-12 text-base rounded-full"
                                    style={{ fontFamily: "Roboto, sans-serif" }}
                                    disabled={isLoading}
                                >
                                    <ArrowLeft className="w-5 h-5 mr-2" />
                                    Back
                                </Button>
                                <Button
                                    onClick={handleNext}
                                    className="flex-1 h-12 text-base rounded-full"
                                    style={{
                                        backgroundColor: "#4285f4",
                                        fontFamily: "Roboto, sans-serif",
                                        fontWeight: 500
                                    }}
                                    disabled={isLoading}
                                >
                                    Continue
                                    <ArrowRight className="w-5 h-5 ml-2" />
                                </Button>
                            </div>

                            <button
                                onClick={handleSkip}
                                className="w-full text-center text-sm text-gray-500 hover:text-gray-700"
                                style={{ fontFamily: "Roboto, sans-serif" }}
                                disabled={isLoading}
                            >
                                Skip for now
                            </button>
                        </div>
                    )}

                    {/* Step 3: Financial Goals (Optional) */}
                    {step === 3 && (
                        <div className="space-y-6 animate-fade-in">
                            <div>
                                <h2
                                    className="text-3xl font-bold mb-2"
                                    style={{
                                        fontFamily: "Google Sans, sans-serif",
                                        color: "#202124"
                                    }}
                                >
                                    Financial Goals
                                </h2>
                                <p
                                    className="text-gray-600"
                                    style={{ fontFamily: "Roboto, sans-serif" }}
                                >
                                    Help us personalize your experience (Optional)
                                </p>
                            </div>

                            {/* Monthly Income */}
                            <div>
                                <label
                                    className="block text-sm font-medium mb-2"
                                    style={{
                                        fontFamily: "Roboto, sans-serif",
                                        color: "#5f6368"
                                    }}
                                >
                                    Monthly Income Range
                                </label>
                                <select
                                    name="monthlyIncome"
                                    value={formData.monthlyIncome}
                                    onChange={handleChange}
                                    className="w-full h-12 px-3 border border-gray-300 rounded-md"
                                    style={{ fontFamily: "Roboto, sans-serif" }}
                                    disabled={isLoading}
                                >
                                    <option value="">Select range</option>
                                    <option value="below-20k">Below ₹20,000</option>
                                    <option value="20k-40k">₹20,000 - ₹40,000</option>
                                    <option value="40k-60k">₹40,000 - ₹60,000</option>
                                    <option value="60k-100k">₹60,000 - ₹1,00,000</option>
                                    <option value="above-100k">Above ₹1,00,000</option>
                                </select>
                            </div>

                            {/* Financial Goal */}
                            <div>
                                <label
                                    className="block text-sm font-medium mb-2"
                                    style={{
                                        fontFamily: "Roboto, sans-serif",
                                        color: "#5f6368"
                                    }}
                                >
                                    Primary Financial Goal
                                </label>
                                <select
                                    name="financialGoal"
                                    value={formData.financialGoal}
                                    onChange={handleChange}
                                    className="w-full h-12 px-3 border border-gray-300 rounded-md"
                                    style={{ fontFamily: "Roboto, sans-serif" }}
                                    disabled={isLoading}
                                >
                                    <option value="">Select goal</option>
                                    <option value="emergency-fund">Build Emergency Fund</option>
                                    <option value="pay-debt">Pay Off Debt</option>
                                    <option value="save-invest">Save for Investment</option>
                                    <option value="retirement">Plan for Retirement</option>
                                    <option value="other">Other</option>
                                </select>
                            </div>

                            {/* Financial Status */}
                            <div>
                                <label
                                    className="block text-sm font-medium mb-2"
                                    style={{
                                        fontFamily: "Roboto, sans-serif",
                                        color: "#5f6368"
                                    }}
                                >
                                    Current Financial Status
                                </label>
                                <select
                                    name="financialStatus"
                                    value={formData.financialStatus}
                                    onChange={handleChange}
                                    className="w-full h-12 px-3 border border-gray-300 rounded-md"
                                    style={{ fontFamily: "Roboto, sans-serif" }}
                                    disabled={isLoading}
                                >
                                    <option value="">Select status</option>
                                    <option value="starting">Just Starting Out</option>
                                    <option value="some-savings">Have Some Savings</option>
                                    <option value="investing">Actively Investing</option>
                                    <option value="planning">Planning for Future</option>
                                </select>
                            </div>

                            {/* Terms & Conditions */}
                            <div className="space-y-3">
                                <label className="flex items-start gap-3 cursor-pointer">
                                    <input
                                        type="checkbox"
                                        name="agreeToTerms"
                                        checked={formData.agreeToTerms}
                                        onChange={handleChange}
                                        className="mt-1 w-4 h-4 accent-blue-500"
                                        disabled={isLoading}
                                    />
                                    <span
                                        className="text-sm text-gray-600"
                                        style={{ fontFamily: "Roboto, sans-serif" }}
                                    >
                                        I agree to the{" "}
                                        <a href="/terms" className="text-blue-500 hover:underline">
                                            Terms & Conditions
                                        </a>{" "}
                                        and{" "}
                                        <a href="/privacy" className="text-blue-500 hover:underline">
                                            Privacy Policy
                                        </a>
                                    </span>
                                </label>

                                <label className="flex items-start gap-3 cursor-pointer">
                                    <input
                                        type="checkbox"
                                        name="subscribeNewsletter"
                                        checked={formData.subscribeNewsletter}
                                        onChange={handleChange}
                                        className="mt-1 w-4 h-4 accent-blue-500"
                                        disabled={isLoading}
                                    />
                                    <span
                                        className="text-sm text-gray-600"
                                        style={{ fontFamily: "Roboto, sans-serif" }}
                                    >
                                        Subscribe to newsletter for financial tips and updates
                                    </span>
                                </label>
                            </div>

                            <div className="flex gap-3">
                                <Button
                                    onClick={handleBack}
                                    variant="outline"
                                    className="flex-1 h-12 text-base rounded-full"
                                    style={{ fontFamily: "Roboto, sans-serif" }}
                                    disabled={isLoading}
                                >
                                    <ArrowLeft className="w-5 h-5 mr-2" />
                                    Back
                                </Button>
                                <Button
                                    onClick={handleSubmit}
                                    disabled={!formData.agreeToTerms || isLoading}
                                    className="flex-1 h-12 text-base rounded-full"
                                    style={{
                                        backgroundColor: formData.agreeToTerms && !isLoading ? "#4285f4" : "#9aa0a6",
                                        fontFamily: "Roboto, sans-serif",
                                        fontWeight: 500
                                    }}
                                >
                                    {isLoading ? (
                                        <>
                                            <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                                            Creating...
                                        </>
                                    ) : (
                                        <>
                                            Create Account
                                            <CheckCircle2 className="w-5 h-5 ml-2" />
                                        </>
                                    )}
                                </Button>
                            </div>
                        </div>
                    )}

                    {/* Already have account */}
                    <div
                        className="text-center mt-6 pt-6 border-t"
                        style={{ borderColor: "#e8eaed" }}
                    >
                        <p
                            className="text-sm text-gray-600"
                            style={{ fontFamily: "Roboto, sans-serif" }}
                        >
                            Already have an account?{" "}
                            <button
                                onClick={() => navigate("/sign-in")}
                                className="text-blue-500 font-medium hover:underline"
                                disabled={isLoading}
                            >
                                Sign In
                            </button>
                        </p>
                    </div>
                </Card>
            </div>

            {/* All your existing styles remain exactly the same */}
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

export default SignUp;
