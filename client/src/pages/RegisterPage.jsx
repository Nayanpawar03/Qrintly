import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import Input from '../components/Input';
import Button from '../components/Button';
import {
    Shield,
    Zap,
    CheckCircle,
    Lock,
    ShieldCheck,
    MailX,
    QrCode,
} from 'lucide-react';

function RegisterPage() {
    const { register } = useAuth();
    const navigate = useNavigate();

    const [formData, setFormData] = useState({
        name: '',
        email: '',
        password: '',
    });
    const [errors, setErrors] = useState({});
    const [apiError, setApiError] = useState('');
    const [isLoading, setIsLoading] = useState(false);

    const validate = () => {
        const newErrors = {};
        if (!formData.name.trim()) newErrors.name = 'Name is required';
        if (!formData.email.trim()) newErrors.email = 'Email is required';
        else if (!/\S+@\S+\.\S+/.test(formData.email))
            newErrors.email = 'Invalid email format';
        if (!formData.password) newErrors.password = 'Password is required';
        else if (formData.password.length < 6)
            newErrors.password = 'Minimum 6 characters';
        return newErrors;
    };

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
        if (errors[e.target.name]) {
            setErrors({ ...errors, [e.target.name]: '' });
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setApiError('');

        const validationErrors = validate();
        if (Object.keys(validationErrors).length > 0) {
            setErrors(validationErrors);
            return;
        }

        setIsLoading(true);
        try {
            await register(formData);
            navigate('/dashboard');
        } catch (error) {
            setApiError(
                error.response?.data?.message || 'Registration failed. Please try again.'
            );
        } finally {
            setIsLoading(false);
        }
    };

    const handleGoogleLogin = () => {
        window.location.href = `${import.meta.env.VITE_API_URL || 'http://localhost:5000'
            }/api/auth/google`;
    };

    return (
        <div className="min-h-screen lg:h-screen flex overflow-hidden">
            {/* ========== LEFT PANEL ========== */}
            <div className="hidden lg:flex lg:w-[55%] bg-gradient-to-br from-[#4338CA] via-[#4F46E5] to-[#6366F1] relative overflow-hidden flex-col justify-between px-12 py-10">
  {/* Logo */}
  <div className="flex items-center gap-3">
    <div className="w-10 h-10 bg-white rounded-xl flex items-center justify-center shadow-lg">
      <QrCode className="w-6 h-6 text-[#4338CA]" />
    </div>
    <span className="text-white text-xl font-bold">Qrintly</span>
  </div>

  {/* Hero + Illustration */}
  <div className="mt-10 flex flex-col items-start">
    {/* Hero Text */}
    <div className="mb-10">
      <h1 className="text-4xl xl:text-5xl font-bold text-white leading-tight mb-4">
        Organize Print Jobs
        <br />
        with QR Codes
      </h1>
      <p className="text-white/80 text-lg max-w-md">
        The modern way for print shops to track orders, manage workflows,
        and keep customers informed.
      </p>
    </div>

        {/* QR Illustration */}
        <div className="mt-6 w-full flex justify-center">
          <img
            src="/qr-illustration.png"
            alt="QR code preview"
            className="w-[380px] xl:w-[440px] h-auto pointer-events-none select-none drop-shadow-[0_30px_80px_rgba(15,23,42,0.35)]"
          />
        </div>
  </div>

  {/* Decorative semicircle backgrounds */}
  <div className="pointer-events-none select-none absolute -left-40 -bottom-40 w-72 h-72 bg-white/10 rounded-full" />
  <div className="pointer-events-none select-none absolute -right-32 -top-32 w-64 h-64 bg-white/10 rounded-full" />

  {/* Trust Badges */}
  <div className="flex items-center gap-8 text-white/80 text-sm mt-10">
    <span className="flex items-center gap-2">
      <Shield className="w-4 h-4" /> Secure &amp; Encrypted
    </span>
    <span className="flex items-center gap-2">
      <Zap className="w-4 h-4" /> Lightning Fast
    </span>
    <span className="flex items-center gap-2">
      <CheckCircle className="w-4 h-4" /> Easy Setup
    </span>
  </div>
</div>

            {/* ========== RIGHT PANEL ========== */}
            <div className="w-full lg:w-[45%] bg-gray-50 dark:bg-gray-900 flex flex-col h-full px-6 sm:px-12 py-8">
                {/* Centered content (logo + form) */}
                <div className="flex-1 flex flex-col items-center justify-center">
                    {/* Mobile Logo */}
                    <div className="flex items-center gap-3 mb-8 lg:hidden">
                        <div className="w-10 h-10 bg-brand rounded-xl flex items-center justify-center">
                            <QrCode className="w-6 h-6 text-white" />
                        </div>
                        <span className="text-gray-900 dark:text-white text-xl font-bold">
                            Qrintly
                        </span>
                    </div>

                    {/* Form Card */}
                    <div className="w-full max-w-md bg-white dark:bg-gray-800 rounded-card p-8 shadow-sm">
                        <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-1">
                            Create Your Shop Account
                        </h2>
                        <p className="text-gray-500 dark:text-gray-400 text-sm mb-6">
                            Start organizing print jobs professionally.
                        </p>

                        {/* API Error */}
                        {apiError && (
                            <div className="bg-danger/10 text-danger text-sm p-3 rounded-input mb-4">
                                {apiError}
                            </div>
                        )}

                        {/* Form */}
                        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
                            <Input
                                label="Full Name"
                                name="name"
                                placeholder="John Smith"
                                value={formData.name}
                                onChange={handleChange}
                                error={errors.name}
                            />
                            <Input
                                label="Email Address"
                                name="email"
                                type="email"
                                placeholder="you@printshop.com"
                                value={formData.email}
                                onChange={handleChange}
                                error={errors.email}
                            />
                            <Input
                                label="Password"
                                name="password"
                                type="password"
                                placeholder="••••••••"
                                value={formData.password}
                                onChange={handleChange}
                                error={errors.password}
                            showPasswordToggle
                                hint="Minimum 6 characters"
                            />

                            <Button type="submit" isLoading={isLoading} className="mt-2">
                                Create Account
                            </Button>
                        </form>

                        {/* Divider */}
                        <div className="flex items-center gap-4 my-6">
                            <div className="flex-1 h-px bg-gray-200 dark:bg-gray-700" />
                            <span className="text-sm text-gray-400 dark:text-gray-500">
                                Or continue with
                            </span>
                            <div className="flex-1 h-px bg-gray-200 dark:bg-gray-700" />
                        </div>

                        {/* Google Button */}
                        <Button variant="outline" onClick={handleGoogleLogin}>
                            <svg className="w-5 h-5" viewBox="0 0 24 24">
                                <path
                                    d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 0 1-2.2 3.32v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.1z"
                                    fill="#4285F4"
                                />
                                <path
                                    d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                                    fill="#34A853"
                                />
                                <path
                                    d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                                    fill="#FBBC05"
                                />
                                <path
                                    d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                                    fill="#EA4335"
                                />
                            </svg>
                            Continue with Google
                        </Button>

                        {/* Login Link */}
                        <p className="text-center text-sm text-gray-500 dark:text-gray-400 mt-6">
                            Already have an account?{' '}
                            <Link
                                to="/login"
                                className="text-brand font-medium hover:underline"
                            >
                                Log in
                            </Link>
                        </p>
                    </div>
                </div>

                {/* Footer Trust Badges */}
                <div className="flex items-center gap-6 mt-6 text-xs text-gray-400 dark:text-gray-500 justify-center">
                    <span className="flex items-center gap-1.5">
                        <Lock className="w-3.5 h-3.5" /> Secure login
                    </span>
                    <span className="flex items-center gap-1.5">
                        <ShieldCheck className="w-3.5 h-3.5" /> Encrypted data
                    </span>
                    <span className="flex items-center gap-1.5">
                        <MailX className="w-3.5 h-3.5" /> No spam
                    </span>
                </div>
            </div>
        </div>
    );
}

export default RegisterPage;