import { useState, useEffect } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { QrCode, Lock, Check, ArrowLeft } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { createOrder, verifyPayment } from '../api/payments';

const PLANS = {
    basic: { name: 'Basic Plan', monthly: 499, yearly: 399 },
    pro: { name: 'Professional Plan', monthly: 999, yearly: 799 },
    enterprise: { name: 'Enterprise Plan', monthly: 1999, yearly: 1599 },
};

const PLAN_FEATURES = {
    basic: ['1 Active Shop QR', 'Unlimited File Uploads', 'Basic Job Dashboard', 'Email Support'],
    pro: ['Up to 3 Shop QRs', 'Advanced Job Tracking', 'Priority Support', 'Basic Analytics', 'Custom Job Status'],
    enterprise: ['Unlimited Shop QRs', 'Admin Roles', 'Advanced Analytics', 'Custom Branding', 'Dedicated Support'],
};

const GST_RATE = 0.18;

function CheckoutPage() {
    const { user } = useAuth();
    const navigate = useNavigate();
    const [searchParams] = useSearchParams();

    const planKey = searchParams.get('plan') || 'pro';
    const billing = searchParams.get('billing') || 'monthly';
    const plan = PLANS[planKey] || PLANS.pro;
    const features = PLAN_FEATURES[planKey] || PLAN_FEATURES.pro;

    const basePrice = plan[billing];
    const gst = +(basePrice * GST_RATE).toFixed(2);
    const total = +(basePrice + gst).toFixed(2);

    const [form, setForm] = useState({
        name: user?.name || '',
        email: user?.email || '',
        business: '',
        phone: user?.phone || '',
    });
    const [processing, setProcessing] = useState(false);
    const [error, setError] = useState('');

    // Load Razorpay script
    useEffect(() => {
        const script = document.createElement('script');
        script.src = 'https://checkout.razorpay.com/v1/checkout.js';
        script.async = true;
        document.body.appendChild(script);
        return () => document.body.removeChild(script);
    }, []);

    const handleChange = (e) => {
        setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
    };

    const handlePay = async () => {
        if (!form.name || !form.email) {
            setError('Full name and email are required.');
            return;
        }

        setError('');
        setProcessing(true);

        try {
            const orderRes = await createOrder({ plan: planKey, billing });
            const { orderId, amount, currency } = orderRes.data;

            const options = {
                key: import.meta.env.VITE_RAZORPAY_KEY_ID,
                amount,
                currency,
                name: 'Qrintly',
                description: `${plan.name} - ${billing}`,
                order_id: orderId,
                prefill: {
                    name: form.name,
                    email: form.email,
                    contact: form.phone,
                },
                theme: { color: '#5B5FEF' },
                handler: async (response) => {
                    try {
                        await verifyPayment({
                            razorpay_order_id: response.razorpay_order_id,
                            razorpay_payment_id: response.razorpay_payment_id,
                            razorpay_signature: response.razorpay_signature,
                            plan: planKey,
                            billing,
                            amount,
                        });
                        navigate('/generate-qr?payment=success');
                    } catch {
                        setError('Payment verified but activation failed. Contact support.');
                    } finally {
                        setProcessing(false);
                    }
                },
                modal: {
                    ondismiss: () => setProcessing(false),
                },
            };

            const rzp = new window.Razorpay(options);
            rzp.open();
        } catch (err) {
            setError(err.response?.data?.message || 'Failed to initiate payment.');
            setProcessing(false);
        }
    };

    return (
        <div className="min-h-screen bg-gray-50 dark:bg-gray-950 font-sans">
            {/* Navbar */}
            <nav className="bg-white dark:bg-gray-900 border-b border-gray-100 dark:border-gray-800 px-6 h-14 flex items-center justify-between">
                <div className="flex items-center gap-3">
                    <button
                        onClick={() => navigate(-1)}
                        className="w-8 h-8 rounded-full border border-gray-200 dark:border-gray-700 flex items-center justify-center text-gray-500 hover:bg-gray-100 dark:hover:bg-gray-800"
                    >
                        <ArrowLeft className="w-4 h-4" />
                    </button>
                    <div className="flex items-center gap-2">
                        <div className="w-7 h-7 rounded-lg bg-brand flex items-center justify-center">
                            <QrCode className="w-4 h-4 text-white" />
                        </div>
                        <span className="text-base font-bold text-gray-900 dark:text-white">Qrintly</span>
                    </div>
                </div>
                <div className="flex items-center gap-1.5 text-xs text-gray-500 dark:text-gray-400">
                    <Lock className="w-3.5 h-3.5" /> Secure Checkout
                </div>
            </nav>

            <div className="max-w-5xl mx-auto px-4 py-10 grid grid-cols-1 lg:grid-cols-[1fr_360px] gap-8">
                {/* Left — Form */}
                <div className="bg-white dark:bg-gray-900 rounded-2xl border border-gray-100 dark:border-gray-800 p-8">
                    <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-1">
                        Complete Your Subscription
                    </h1>

                    {/* Steps */}
                    <div className="flex items-center gap-3 mb-8 text-xs">
                        <span className="flex items-center gap-1.5">
                            <span className="w-5 h-5 rounded-full bg-brand text-white flex items-center justify-center font-semibold">1</span>
                            <span className="font-medium text-gray-900 dark:text-white">Plan</span>
                        </span>
                        <div className="flex-1 h-px bg-gray-200 dark:bg-gray-700" />
                        <span className="flex items-center gap-1.5">
                            <span className="w-5 h-5 rounded-full bg-brand text-white flex items-center justify-center font-semibold">2</span>
                            <span className="font-medium text-gray-900 dark:text-white">Payment</span>
                        </span>
                        <div className="flex-1 h-px bg-gray-200 dark:bg-gray-700" />
                        <span className="flex items-center gap-1.5 text-gray-400">
                            <span className="w-5 h-5 rounded-full border border-gray-300 dark:border-gray-600 flex items-center justify-center font-semibold">3</span>
                            <span>Confirmation</span>
                        </span>
                    </div>

                    {error && (
                        <div className="mb-5 rounded-xl bg-rose-50 border border-rose-100 text-rose-700 px-4 py-3 text-sm">
                            {error}
                        </div>
                    )}

                    {/* Customer info */}
                    <h2 className="text-sm font-semibold text-gray-900 dark:text-white mb-4">Customer Information</h2>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-8">
                        <div>
                            <label className="block text-xs text-gray-500 dark:text-gray-400 mb-1.5">Full Name *</label>
                            <input
                                name="name"
                                value={form.name}
                                onChange={handleChange}
                                placeholder="John Doe"
                                className="w-full h-11 rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 px-4 text-sm text-gray-900 dark:text-gray-100 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-brand/25 focus:border-brand"
                            />
                        </div>
                        <div>
                            <label className="block text-xs text-gray-500 dark:text-gray-400 mb-1.5">Email Address *</label>
                            <input
                                name="email"
                                type="email"
                                value={form.email}
                                onChange={handleChange}
                                placeholder="john@example.com"
                                className="w-full h-11 rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 px-4 text-sm text-gray-900 dark:text-gray-100 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-brand/25 focus:border-brand"
                            />
                        </div>
                        <div>
                            <label className="block text-xs text-gray-500 dark:text-gray-400 mb-1.5">Business Name</label>
                            <input
                                name="business"
                                value={form.business}
                                onChange={handleChange}
                                placeholder="Optional"
                                className="w-full h-11 rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 px-4 text-sm text-gray-900 dark:text-gray-100 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-brand/25 focus:border-brand"
                            />
                        </div>
                        <div>
                            <label className="block text-xs text-gray-500 dark:text-gray-400 mb-1.5">Phone Number</label>
                            <input
                                name="phone"
                                value={form.phone}
                                onChange={handleChange}
                                placeholder="Optional"
                                className="w-full h-11 rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 px-4 text-sm text-gray-900 dark:text-gray-100 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-brand/25 focus:border-brand"
                            />
                        </div>
                    </div>

                    <div className="border-t border-gray-100 dark:border-gray-800 pt-6">
                        <h2 className="text-sm font-semibold text-gray-900 dark:text-white mb-4">Payment Method</h2>
                        <div className="bg-indigo-50 dark:bg-indigo-950/20 border border-brand/20 rounded-xl px-4 py-3 flex items-center gap-3 text-sm text-gray-700 dark:text-gray-300 mb-6">
                            <Lock className="w-4 h-4 text-brand shrink-0" />
                            Secure payment powered by Razorpay — supports Card, UPI, Net Banking & more
                        </div>
                    </div>

                    {/* Trust badges */}
                    <div className="flex flex-wrap gap-4 text-xs text-gray-400 dark:text-gray-500 border-t border-gray-100 dark:border-gray-800 pt-5">
                        {['🔒 Secure payment', '🔑 Encrypted checkout', '📄 GST invoice', '⚡ Instant activation'].map((b) => (
                            <span key={b}>{b}</span>
                        ))}
                    </div>
                </div>

                {/* Right — Order Summary */}
                <div className="space-y-4">
                    <div className="bg-white dark:bg-gray-900 rounded-2xl border border-gray-100 dark:border-gray-800 p-6">
                        <h2 className="text-base font-semibold text-gray-900 dark:text-white mb-4">Order Summary</h2>

                        <div className="flex items-start justify-between mb-1">
                            <div>
                                <p className="text-sm font-semibold text-gray-900 dark:text-white">{plan.name}</p>
                                <p className="text-xs text-brand capitalize">Billed {billing}</p>
                            </div>
                            <span className="text-xs bg-indigo-50 dark:bg-indigo-900/30 text-brand px-2 py-0.5 rounded-full capitalize">{billing}</span>
                        </div>

                        <div className="border-t border-gray-100 dark:border-gray-800 mt-4 pt-4 space-y-2 text-sm">
                            <div className="flex justify-between text-gray-600 dark:text-gray-300">
                                <span>Plan Price</span>
                                <span>₹{basePrice.toFixed(2)}</span>
                            </div>
                            <div className="flex justify-between text-gray-600 dark:text-gray-300">
                                <span>GST (18%)</span>
                                <span>₹{gst.toFixed(2)}</span>
                            </div>
                            <div className="flex justify-between font-bold text-gray-900 dark:text-white text-base pt-2 border-t border-gray-100 dark:border-gray-800">
                                <span>Total</span>
                                <span>₹{total.toFixed(2)}</span>
                            </div>
                        </div>

                        <button
                            onClick={handlePay}
                            disabled={processing}
                            className="mt-5 w-full h-12 rounded-xl bg-accent-hover text-white font-semibold text-sm hover:bg-accent-dark disabled:opacity-60 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                        >
                            {processing ? (
                                <span className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                            ) : (
                                `Pay ₹${total.toFixed(2)}`
                            )}
                        </button>
                        <p className="text-center text-xs text-gray-400 dark:text-gray-500 mt-2">
                            Cancel anytime. No hidden charges.
                        </p>

                        <div className="border-t border-gray-100 dark:border-gray-800 mt-4 pt-4">
                            <p className="text-xs font-semibold text-gray-700 dark:text-gray-300 mb-2">What's included:</p>
                            <ul className="space-y-1.5">
                                {features.map((f) => (
                                    <li key={f} className="flex items-center gap-2 text-xs text-gray-600 dark:text-gray-400">
                                        <Check className="w-3.5 h-3.5 text-emerald-500 shrink-0" />
                                        {f}
                                    </li>
                                ))}
                            </ul>
                        </div>
                    </div>

                    {/* Footer */}
                    <div className="text-center text-xs text-gray-400 dark:text-gray-500">
                        © 2025 Qrintly. All rights reserved.
                    </div>
                    <div className="flex justify-center gap-4 text-xs text-gray-400 dark:text-gray-500">
                        <a href="/security" className="hover:text-brand">Privacy Policy</a>
                        <a href="/security" className="hover:text-brand">Terms of Service</a>
                        <a href="/security" className="hover:text-brand">Support</a>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default CheckoutPage;
