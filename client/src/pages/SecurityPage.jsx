import { useState } from 'react';
import { Link } from 'react-router-dom';
import { QrCode, Shield, ChevronDown } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

function SecurityPage() {
    const [openTerm, setOpenTerm] = useState(null);
    const { user } = useAuth();

    return (
        <div className="min-h-screen bg-white dark:bg-gray-950 font-sans">

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
                        <Link to="/" className="hover:text-brand transition-colors">Features</Link>
                        <Link to="/" className="hover:text-brand transition-colors">Pricing</Link>
                        <Link to="/security" className="text-brand font-medium">Security</Link>
                        <Link to="/" className="hover:text-brand transition-colors">Contact Us</Link>
                    </div>

                    <div className="flex items-center gap-2">
                        {user ? (
                            <Link to="/dashboard" className="px-4 py-2 rounded-xl bg-brand text-white text-sm font-medium hover:bg-brand/90">
                                Go to Dashboard
                            </Link>
                        ) : (
                            <>
                                <Link to="/login" className="px-4 py-2 text-sm font-medium text-gray-700 dark:text-gray-200 hover:text-brand">
                                    Login
                                </Link>
                                <Link to="/register" className="px-4 py-2 rounded-xl bg-brand text-white text-sm font-medium hover:bg-brand/90">
                                    Get Started
                                </Link>
                            </>
                        )}
                    </div>
                </div>
            </nav>

            {/* ===== HERO ===== */}
            <section className="max-w-3xl mx-auto px-4 pt-16 pb-12 text-center">
                <div className="w-14 h-14 rounded-2xl bg-indigo-50 dark:bg-indigo-900/30 flex items-center justify-center mx-auto mb-6">
                    <Shield className="w-7 h-7 text-brand" />
                </div>
                <h1 className="text-3xl sm:text-4xl font-bold text-gray-900 dark:text-white mb-3">
                    Your Files. Your Control.
                </h1>
                <p className="text-sm text-gray-500 dark:text-gray-400 mb-8 max-w-md mx-auto">
                    Qrintly is designed with privacy-first principles to protect both shop owners and their customers.
                </p>

                {/* Trust badges */}
                <div className="flex flex-wrap items-center justify-center gap-3 text-xs text-gray-600 dark:text-gray-300">
                    {[
                        { icon: '🔒', label: 'End-to-End Secure Upload' },
                        { icon: '🗑️', label: 'Automatic File Deletion' },
                        { icon: '🚫', label: 'No Third-Party Data Sharing' },
                        { icon: '🔐', label: 'Privacy-First Design' },
                        { icon: '👤', label: 'Anonymous Customer Data' },
                    ].map((badge) => (
                        <span key={badge.label} className="flex items-center gap-1.5 bg-gray-50 dark:bg-gray-800 border border-gray-100 dark:border-gray-700 rounded-full px-3 py-1.5">
                            {badge.icon} {badge.label}
                        </span>
                    ))}
                </div>
            </section>

            {/* ===== SECURITY FEATURES ===== */}
            <section className="bg-gray-50 dark:bg-gray-900 py-16 px-4">
                <div className="max-w-6xl mx-auto grid grid-cols-1 sm:grid-cols-2 gap-5">
                    {[
                        {
                            icon: '🔒',
                            title: 'Secure File Upload',
                            desc: 'All files are encrypted during transfer and stored securely on Cloudinary.',
                            points: ['Files encrypted in transit', 'No local file storage', 'Accessible only to shop owner'],
                        },
                        {
                            icon: '👥',
                            title: 'Controlled Access',
                            desc: 'Only the print shop owner can view and access customer files.',
                            points: ['Role-based access', 'JWT authentication', 'Owner-only visibility'],
                        },
                        {
                            icon: '🗑️',
                            title: 'Automatic File Deletion',
                            desc: 'Files are automatically deleted after the set expiry period.',
                            points: ['Configurable auto-delete', 'Secure cloud deletion', 'No residual data left'],
                        },
                        {
                            icon: '🚫',
                            title: 'No Data Selling',
                            desc: 'We never sell or share personal data with third-party advertisers.',
                            points: ['No third-party sharing', 'No ad tracking', 'Strict data discipline'],
                        },
                    ].map((card) => (
                        <div key={card.title} className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-100 dark:border-gray-700 p-6">
                            <div className="text-2xl mb-3">{card.icon}</div>
                            <p className="text-sm font-semibold text-gray-900 dark:text-white mb-1">{card.title}</p>
                            <p className="text-xs text-gray-500 dark:text-gray-400 mb-4">{card.desc}</p>
                            <ul className="space-y-1.5">
                                {card.points.map((pt) => (
                                    <li key={pt} className="flex items-center gap-2 text-xs text-gray-600 dark:text-gray-300">
                                        <span className="text-emerald-500">✓</span> {pt}
                                    </li>
                                ))}
                            </ul>
                        </div>
                    ))}
                </div>
            </section>

            {/* ===== WHAT DATA WE STORE ===== */}
            <section className="py-16 px-4 max-w-6xl mx-auto">
                <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 dark:text-white text-center mb-2">
                    What Data We Store
                </h2>
                <p className="text-sm text-gray-500 dark:text-gray-400 text-center mb-10">
                    We only collect what is necessary to run the service.
                </p>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                    <div className="bg-indigo-50 dark:bg-indigo-950/20 border border-indigo-100 dark:border-indigo-900/30 rounded-2xl p-6">
                        <p className="text-sm font-semibold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
                            👤 For Customers
                        </p>
                        <ul className="space-y-2">
                            {['Name (optional)', 'Files', 'Print preferences'].map((item) => (
                                <li key={item} className="flex items-center gap-2 text-xs text-gray-600 dark:text-gray-300">
                                    <span className="w-1.5 h-1.5 rounded-full bg-brand shrink-0" /> {item}
                                </li>
                            ))}
                        </ul>
                    </div>
                    <div className="bg-purple-50 dark:bg-purple-950/20 border border-purple-100 dark:border-purple-900/30 rounded-2xl p-6">
                        <p className="text-sm font-semibold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
                            🏪 For Shop Owners
                        </p>
                        <ul className="space-y-2">
                            {['Account details', 'Shop info', 'Job history'].map((item) => (
                                <li key={item} className="flex items-center gap-2 text-xs text-gray-600 dark:text-gray-300">
                                    <span className="w-1.5 h-1.5 rounded-full bg-purple-500 shrink-0" /> {item}
                                </li>
                            ))}
                        </ul>
                    </div>
                </div>
            </section>

            {/* ===== ABOUT ADS ===== */}
            <section className="py-6 px-4 max-w-6xl mx-auto mb-8">
                <div className="bg-amber-50 dark:bg-amber-950/20 border border-amber-100 dark:border-amber-900/30 rounded-2xl p-6 max-w-2xl mx-auto">
                    <p className="text-sm font-semibold text-gray-900 dark:text-white mb-2 flex items-center gap-2">
                        🎯 About Ads on Qrintly
                    </p>
                    <p className="text-xs text-gray-600 dark:text-gray-400 mb-2">
                        Qrintly may display non-intrusive sponsored content to keep the platform free.
                    </p>
                    <p className="text-xs text-gray-500 dark:text-gray-500">
                        We never share your files or personal data with advertisers.
                    </p>
                </div>
            </section>

            {/* ===== TERMS & CONDITIONS ===== */}
            <section className="py-16 px-4 max-w-3xl mx-auto">
                <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 dark:text-white text-center mb-2">
                    Terms & Conditions
                </h2>
                <p className="text-sm text-gray-500 dark:text-gray-400 text-center mb-10">
                    Expand sections to learn more
                </p>

                <div className="space-y-3">
                    {[
                        {
                            title: 'User Responsibilities',
                            content: 'Users are responsible for the files they upload. You must not upload illegal, copyrighted, or harmful content. Qrintly is not liable for the content of uploaded files.',
                        },
                        {
                            title: 'Acceptable File Use',
                            content: 'Files uploaded to Qrintly must be intended for legitimate printing purposes only. Files are accessible only to the shop owner and are automatically deleted after the configured expiry period.',
                        },
                        {
                            title: 'Prohibited Content',
                            content: 'You may not upload content that is illegal, defamatory, obscene, or infringes on intellectual property rights. Qrintly reserves the right to terminate accounts that violate these terms.',
                        },
                        {
                            title: 'Refund & Subscription Policy',
                            content: 'Subscription fees are non-refundable once the billing period has started. You may cancel your subscription at any time and will retain access until the end of the billing period.',
                        },
                        {
                            title: 'Ad Content Limitations',
                            content: 'Sponsored content displayed on Qrintly is clearly labeled. We do not allow ads that are misleading, harmful, or target minors. Advertisers do not have access to user data.',
                        },
                        {
                            title: 'Liability Disclaimer',
                            content: 'Qrintly provides the platform as-is. We are not responsible for print quality, shop owner actions, or any loss of data beyond our control. Use the service at your own discretion.',
                        },
                    ].map((term) => (
                        <div key={term.title} className="border border-gray-100 dark:border-gray-800 rounded-xl overflow-hidden">
                            <button
                                onClick={() => setOpenTerm(openTerm === term.title ? null : term.title)}
                                className="w-full flex items-center justify-between px-5 py-4 text-left bg-white dark:bg-gray-900 hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors"
                            >
                                <span className="text-sm font-medium text-gray-900 dark:text-white">{term.title}</span>
                                <ChevronDown className={`w-4 h-4 text-gray-400 transition-transform ${openTerm === term.title ? 'rotate-180' : ''}`} />
                            </button>
                            {openTerm === term.title && (
                                <div className="px-5 pb-4 bg-white dark:bg-gray-900">
                                    <p className="text-xs text-gray-500 dark:text-gray-400 leading-relaxed">{term.content}</p>
                                </div>
                            )}
                        </div>
                    ))}
                </div>

                <p className="text-center text-xs text-gray-400 dark:text-gray-500 mt-8">
                    Last updated: April 2025 ·{' '}
                    <a href="mailto:support@qrintly.com" className="text-brand hover:underline">Contact Us</a>
                    {' · '}
                    <a href="#" className="text-brand hover:underline">Download Terms (PDF)</a>
                </p>
            </section>

            {/* ===== CTA BANNER ===== */}
            <section className="bg-brand py-16 px-4 text-center">
                <h2 className="text-2xl sm:text-3xl font-bold text-white mb-2">
                    Your Privacy Matters
                </h2>
                <p className="text-white/70 text-sm mb-8">
                    Have questions about how we handle your data? We're here to help.
                </p>
                <div className="flex items-center justify-center gap-3 flex-wrap">
                    <Link to="/register" className="px-5 py-2.5 rounded-xl bg-white text-brand text-sm font-semibold hover:bg-gray-50">
                        Contact Support
                    </Link>
                    <a href="#" className="px-5 py-2.5 rounded-xl border border-white/30 text-white text-sm font-medium hover:bg-white/10">
                        Download Terms (PDF)
                    </a>
                </div>
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
                        <p className="text-xs leading-relaxed">The modern way to manage print shop jobs with QR codes.</p>
                    </div>
                    <div>
                        <p className="text-white text-xs font-semibold mb-3">Product</p>
                        <ul className="space-y-2 text-xs">
                            <li><Link to="/" className="hover:text-white">Features</Link></li>
                            <li><Link to="/" className="hover:text-white">How It Works</Link></li>
                            <li><Link to="/register" className="hover:text-white">Get Started</Link></li>
                        </ul>
                    </div>
                    <div>
                        <p className="text-white text-xs font-semibold mb-3">Company</p>
                        <ul className="space-y-2 text-xs">
                            <li><a href="#" className="hover:text-white">About Us</a></li>
                            <li><a href="#" className="hover:text-white">Blog</a></li>
                            <li><a href="#" className="hover:text-white">Careers</a></li>
                            <li><a href="#" className="hover:text-white">Contact</a></li>
                        </ul>
                    </div>
                    <div>
                        <p className="text-white text-xs font-semibold mb-3">Legal</p>
                        <ul className="space-y-2 text-xs">
                            <li><Link to="/security" className="hover:text-white text-brand">Privacy Policy</Link></li>
                            <li><Link to="/security" className="hover:text-white text-brand">Terms of Service</Link></li>
                            <li><Link to="/security" className="hover:text-white text-brand">Security</Link></li>
                        </ul>
                    </div>
                </div>
                <div className="max-w-6xl mx-auto border-t border-gray-800 pt-6 flex flex-col sm:flex-row items-center justify-between gap-2 text-xs">
                    <p>© 2025 Qrintly. All rights reserved.</p>
                    <p>Built for print shops, by developers who care.</p>
                </div>
            </footer>

        </div>
    );
}

export default SecurityPage;
