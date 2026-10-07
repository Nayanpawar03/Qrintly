import { useState } from 'react';
import { Link } from 'react-router-dom';
import { QrCode, Check, X, ChevronDown } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

function PricingPage() {
    const { user } = useAuth();
    const [billing, setBilling] = useState('monthly');
    const [openFaq, setOpenFaq] = useState(null);

    const plans = [
        {
            name: 'Basic',
            price: billing === 'monthly' ? 499 : 399,
            desc: 'Best for small print shops',
            features: ['1 Active Shop QR', 'Unlimited File Uploads', 'Basic Job Dashboard', 'Email Support'],
            cta: 'Get Started',
            ctaLink: user ? `/checkout?plan=basic&billing=${billing}` : '/register',
            highlight: false,
        },
        {
            name: 'Pro',
            price: billing === 'monthly' ? 999 : 799,
            desc: 'Best for growing print centers',
            features: ['Up to 3 Shop QRs', 'Advanced Job Tracking', 'Priority Support', 'Basic Analytics', 'Custom Job Status'],
            cta: 'Start Pro',
            ctaLink: user ? `/checkout?plan=pro&billing=${billing}` : '/register',
            highlight: true,
        },
        {
            name: 'Enterprise',
            price: billing === 'monthly' ? 1999 : 1599,
            desc: 'For multi-location print businesses',
            features: ['Unlimited Shop QRs', 'Admin Roles', 'Advanced Analytics', 'Custom Branding', 'Dedicated Support'],
            cta: 'Get Enterprise',
            ctaLink: user ? `/checkout?plan=enterprise&billing=${billing}` : '/register',
            highlight: false,
        },
    ];

    return (
        <div className="min-h-screen bg-gray-50 dark:bg-gray-950 font-sans">

            {/* ===== NAVBAR ===== */}
            <nav className="sticky top-0 z-50 bg-white/80 dark:bg-gray-950/80 backdrop-blur border-b border-gray-100 dark:border-gray-800">
                <div className="max-w-6xl mx-auto px-4 sm:px-6 h-14 flex items-center justify-between">
                    <Link to="/" className="flex items-center gap-2">
                        <div className="w-7 h-7 rounded-lg bg-brand flex items-center justify-center">
                            <QrCode className="w-4 h-4 text-white" />
                        </div>
                        <span className="text-base font-bold text-gray-900 dark:text-white">Qrintly</span>
                    </Link>

                    <div className="hidden md:flex items-center gap-6 text-sm text-gray-600 dark:text-gray-300">
                        {user && <Link to="/dashboard" className="hover:text-brand transition-colors">Dashboard</Link>}
                        <Link to="/pricing" className="text-brand font-medium">Pricing</Link>
                        <Link to="/security" className="hover:text-brand transition-colors">Security</Link>
                        <Link to="/" className="hover:text-brand transition-colors">About</Link>
                    </div>

                    <div className="flex items-center gap-2">
                        {user ? (
                            <Link to="/generate-qr" className="px-4 py-2 rounded-xl bg-accent-hover text-white text-sm font-medium hover:bg-accent-dark">
                                Generate QR
                            </Link>
                        ) : (
                            <>
                                <Link to="/login" className="px-4 py-2 text-sm font-medium text-gray-700 dark:text-gray-200 hover:text-brand">Login</Link>
                                <Link to="/register" className="px-4 py-2 rounded-xl bg-accent-hover text-white text-sm font-medium hover:bg-accent-dark">Generate QR</Link>
                            </>
                        )}
                    </div>
                </div>
            </nav>

            {/* ===== HERO ===== */}
            <section className="max-w-3xl mx-auto px-4 pt-16 pb-10 text-center">
                <h1 className="text-3xl sm:text-4xl font-bold text-gray-900 dark:text-white mb-3">
                    Simple, Transparent Pricing
                </h1>
                <p className="text-sm text-gray-500 dark:text-gray-400 mb-8">
                    Choose a plan that fits your print shop size. No hidden charges.
                </p>

                {/* Billing toggle */}
                <div className="inline-flex items-center bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-full p-1 gap-1">
                    <button
                        onClick={() => setBilling('monthly')}
                        className={`px-4 py-1.5 rounded-full text-sm font-medium transition-colors ${billing === 'monthly' ? 'bg-brand text-white' : 'text-gray-600 dark:text-gray-300 hover:text-brand'}`}
                    >
                        Monthly
                    </button>
                    <button
                        onClick={() => setBilling('yearly')}
                        className={`px-4 py-1.5 rounded-full text-sm font-medium transition-colors ${billing === 'yearly' ? 'bg-brand text-white' : 'text-gray-600 dark:text-gray-300 hover:text-brand'}`}
                    >
                        Yearly
                    </button>
                </div>
            </section>

            {/* ===== PRICING CARDS ===== */}
            <section className="max-w-6xl mx-auto px-4 pb-16">
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
                    {plans.map((plan) => (
                        <div key={plan.name} className={`rounded-2xl border p-6 flex flex-col ${plan.highlight
                            ? 'bg-brand border-brand text-white shadow-xl shadow-indigo-200 dark:shadow-indigo-900/30 scale-105'
                            : 'bg-white dark:bg-gray-900 border-gray-100 dark:border-gray-800'
                            }`}>
                            <p className={`text-sm font-semibold mb-1 ${plan.highlight ? 'text-white' : 'text-gray-900 dark:text-white'}`}>
                                {plan.name}
                            </p>
                            <div className="flex items-baseline gap-1 mb-1">
                                <span className={`text-3xl font-bold ${plan.highlight ? 'text-white' : 'text-gray-900 dark:text-white'}`}>
                                    ₹{plan.price}
                                </span>
                                <span className={`text-xs ${plan.highlight ? 'text-white/70' : 'text-gray-400'}`}>/month</span>
                            </div>
                            <p className={`text-xs mb-5 ${plan.highlight ? 'text-white/70' : 'text-gray-500 dark:text-gray-400'}`}>
                                {plan.desc}
                            </p>
                            <ul className="space-y-2 mb-6 flex-1">
                                {plan.features.map((f) => (
                                    <li key={f} className={`flex items-center gap-2 text-xs ${plan.highlight ? 'text-white/90' : 'text-gray-600 dark:text-gray-300'}`}>
                                        <Check className={`w-3.5 h-3.5 shrink-0 ${plan.highlight ? 'text-white' : 'text-emerald-500'}`} />
                                        {f}
                                    </li>
                                ))}
                            </ul>
                            <Link
                                to={plan.ctaLink}
                                className={`w-full py-2.5 rounded-xl text-sm font-semibold text-center transition-colors ${plan.highlight
                                    ? 'bg-white text-brand hover:bg-gray-50'
                                    : 'bg-brand text-white hover:bg-brand/90'
                                    }`}
                            >
                                {plan.cta}
                            </Link>
                        </div>
                    ))}
                </div>
            </section>

            {/* ===== COMPARISON TABLE ===== */}
            <section className="max-w-3xl mx-auto px-4 py-16">
                <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 dark:text-white text-center mb-10">
                    Why Choose Qrintly?
                </h2>
                <div className="bg-white dark:bg-gray-900 rounded-2xl border border-gray-100 dark:border-gray-800 overflow-hidden">
                    <table className="w-full text-sm">
                        <thead>
                            <tr className="border-b border-gray-100 dark:border-gray-800">
                                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 dark:text-gray-400">Feature</th>
                                <th className="px-6 py-4 text-center text-xs font-semibold text-brand">Qrintly</th>
                                <th className="px-6 py-4 text-center text-xs font-semibold text-gray-400">WhatsApp</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-100 dark:divide-gray-800">
                            {[
                                'Organised Dashboard',
                                'Job Tracking',
                                'Auto Job ID',
                                'File Privacy',
                                'Professional Workflow',
                            ].map((feature) => (
                                <tr key={feature} className="hover:bg-gray-50 dark:hover:bg-gray-800/40">
                                    <td className="px-6 py-3.5 text-xs text-gray-700 dark:text-gray-300">{feature}</td>
                                    <td className="px-6 py-3.5 text-center">
                                        <Check className="w-4 h-4 text-emerald-500 mx-auto" />
                                    </td>
                                    <td className="px-6 py-3.5 text-center">
                                        <X className="w-4 h-4 text-rose-400 mx-auto" />
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </section>

            {/* ===== FAQ ===== */}
            <section className="max-w-3xl mx-auto px-4 py-8 pb-16">
                <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 dark:text-white text-center mb-10">
                    Frequently Asked Questions
                </h2>
                <div className="space-y-3">
                    {[
                        { q: 'Can I cancel anytime?', a: 'Yes, you can cancel your subscription at any time. You\'ll retain access until the end of your billing period.' },
                        { q: 'Do customers need an account?', a: 'No. Customers just scan the QR code and upload files directly, no account or app required.' },
                        { q: 'Is there a setup fee?', a: 'No setup fee at all. Sign up, generate your QR, and you\'re ready to go in under a minute.' },
                        { q: 'Can I upgrade later?', a: 'Absolutely. You can upgrade or downgrade your plan at any time from your account settings.' },
                        { q: 'Is my data secure?', a: 'Yes. Files are encrypted in transit, stored securely, and automatically deleted after the configured expiry period.' },
                    ].map((faq) => (
                        <div key={faq.q} className="border border-gray-100 dark:border-gray-800 rounded-xl overflow-hidden">
                            <button
                                onClick={() => setOpenFaq(openFaq === faq.q ? null : faq.q)}
                                className="w-full flex items-center justify-between px-5 py-4 text-left bg-white dark:bg-gray-900 hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors"
                            >
                                <span className="text-sm font-medium text-gray-900 dark:text-white">{faq.q}</span>
                                <ChevronDown className={`w-4 h-4 text-gray-400 transition-transform shrink-0 ${openFaq === faq.q ? 'rotate-180' : ''}`} />
                            </button>
                            {openFaq === faq.q && (
                                <div className="px-5 pb-4 bg-white dark:bg-gray-900">
                                    <p className="text-xs text-gray-500 dark:text-gray-400 leading-relaxed">{faq.a}</p>
                                </div>
                            )}
                        </div>
                    ))}
                </div>
            </section>

            {/* ===== CTA BANNER ===== */}
            <section className="bg-brand py-16 px-4 text-center">
                <h2 className="text-2xl sm:text-3xl font-bold text-white mb-6">
                    Upgrade Your Print Shop Today
                </h2>
                <Link
                    to={user ? '/generate-qr' : '/register'}
                    className="inline-flex items-center px-6 py-3 rounded-xl bg-accent-hover text-white text-sm font-semibold hover:bg-accent-dark"
                >
                    Generate Your QR
                </Link>
                <p className="text-white/60 text-xs mt-3">No setup fee. Cancel any time.</p>
            </section>

            {/* ===== FOOTER ===== */}
            <footer className="bg-gray-900 text-gray-400 py-12 px-4">
                <div className="max-w-6xl mx-auto grid grid-cols-2 sm:grid-cols-4 gap-8 mb-10">
                    <div>
                        <div className="flex items-center gap-2 mb-3">
                            <div className="w-6 h-6 rounded-lg bg-brand flex items-center justify-center">
                                <QrCode className="w-3.5 h-3.5 text-white" />
                            </div>
                            <span className="text-white font-semibold text-sm">Qrintly</span>
                        </div>
                        <p className="text-xs leading-relaxed">QR-based print job management for modern print shops.</p>
                    </div>
                    <div>
                        <p className="text-white text-xs font-semibold mb-3">Product</p>
                        <ul className="space-y-2 text-xs">
                            <li><Link to="/" className="hover:text-white">Features</Link></li>
                            <li><Link to="/pricing" className="hover:text-white text-brand">Pricing</Link></li>
                            <li><Link to="/security" className="hover:text-white">Security</Link></li>
                        </ul>
                    </div>
                    <div>
                        <p className="text-white text-xs font-semibold mb-3">Company</p>
                        <ul className="space-y-2 text-xs">
                            <li><a href="#" className="hover:text-white">About</a></li>
                            <li><a href="#" className="hover:text-white">Contact</a></li>
                            <li><a href="#" className="hover:text-white">Support</a></li>
                        </ul>
                    </div>
                    <div>
                        <p className="text-white text-xs font-semibold mb-3">Legal</p>
                        <ul className="space-y-2 text-xs">
                            <li><Link to="/security" className="hover:text-white">Privacy</Link></li>
                            <li><Link to="/security" className="hover:text-white">Terms</Link></li>
                        </ul>
                    </div>
                </div>
                <div className="max-w-6xl mx-auto border-t border-gray-800 pt-6 text-center text-xs">
                    <p>© 2025 Qrintly. All rights reserved.</p>
                </div>
            </footer>

        </div>
    );
}

export default PricingPage;

