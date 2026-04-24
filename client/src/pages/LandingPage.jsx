import { Link } from 'react-router-dom';
import { QrCode, Play } from 'lucide-react';

function LandingPage() {
    return (
        <div className="min-h-screen bg-white dark:bg-gray-950 font-sans">

            {/* ===== NAVBAR ===== */}
            <nav className="sticky top-0 z-50 bg-white/80 dark:bg-gray-950/80 backdrop-blur border-b border-gray-100 dark:border-gray-800">
                <div className="max-w-6xl mx-auto px-4 sm:px-6 h-14 flex items-center justify-between">
                    <div className="flex items-center gap-2">
                        <div className="w-7 h-7 rounded-lg bg-brand flex items-center justify-center">
                            <QrCode className="w-4 h-4 text-white" />
                        </div>
                        <span className="text-base font-bold text-gray-900 dark:text-white">Qrintly</span>
                    </div>

                    <div className="hidden md:flex items-center gap-6 text-sm text-gray-600 dark:text-gray-300">
                        <a href="#how-it-works" className="hover:text-brand transition-colors">About</a>
                        <a href="#features" className="hover:text-brand transition-colors">Plans</a>
                        <a href="#how-it-works" className="hover:text-brand transition-colors">How It Works</a>
                        <a href="#footer" className="hover:text-brand transition-colors">More</a>
                    </div>

                    <div className="flex items-center gap-2">
                        <Link
                            to="/login"
                            className="px-4 py-2 text-sm font-medium text-gray-700 dark:text-gray-200 hover:text-brand"
                        >
                            Login
                        </Link>
                        <Link
                            to="/register"
                            className="px-4 py-2 rounded-xl bg-brand text-white text-sm font-medium hover:bg-brand/90"
                        >
                            Get Started
                        </Link>
                    </div>
                </div>
            </nav>

            {/* ===== HERO ===== */}
            <section className="max-w-6xl mx-auto px-4 sm:px-6 pt-16 pb-12 flex flex-col lg:flex-row items-center gap-12">
                <div className="flex-1">
                    <h1 className="text-4xl sm:text-5xl font-bold text-gray-900 dark:text-white leading-tight mb-4">
                        Stop Taking Print<br />
                        Files on{' '}
                        <span className="text-[#25D366]">WhatsApp.</span>
                    </h1>
                    <p className="text-gray-500 dark:text-gray-400 text-base mb-8 max-w-md">
                        Organize customer print jobs, manage files and track everything with a QR code.
                    </p>
                    <div className="flex items-center gap-3">
                        <Link
                            to="/register"
                            className="px-5 py-2.5 rounded-xl bg-brand text-white text-sm font-semibold hover:bg-brand/90"
                        >
                            Generate My QR
                        </Link>
                        <a
                            href="#how-it-works"
                            className="px-5 py-2.5 rounded-xl border border-gray-200 dark:border-gray-700 text-sm font-medium text-gray-700 dark:text-gray-200 hover:bg-gray-50 dark:hover:bg-gray-800"
                        >
                            See How It Works
                        </a>
                    </div>
                </div>

                {/* Dashboard mockup */}
                <div className="flex-1 w-full max-w-lg">
                    <div className="rounded-2xl border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-900 p-4 shadow-xl">
                        <div className="flex items-center gap-1.5 mb-3">
                            <div className="w-2.5 h-2.5 rounded-full bg-rose-400" />
                            <div className="w-2.5 h-2.5 rounded-full bg-amber-400" />
                            <div className="w-2.5 h-2.5 rounded-full bg-emerald-400" />
                        </div>
                        <div className="rounded-xl bg-white dark:bg-gray-800 p-4 space-y-3">
                            <div className="flex items-center justify-between">
                                <div className="h-3 w-24 rounded bg-gray-100 dark:bg-gray-700" />
                                <div className="h-6 w-16 rounded-full bg-brand/20" />
                            </div>
                            <div className="grid grid-cols-4 gap-2">
                                {[...Array(4)].map((_, i) => (
                                    <div key={i} className="rounded-xl bg-gray-50 dark:bg-gray-700 p-3">
                                        <div className="h-2 w-8 rounded bg-gray-200 dark:bg-gray-600 mb-2" />
                                        <div className="h-5 w-6 rounded bg-brand/30" />
                                    </div>
                                ))}
                            </div>
                            <div className="space-y-2">
                                {[...Array(3)].map((_, i) => (
                                    <div key={i} className="flex items-center gap-3 py-2 border-b border-gray-100 dark:border-gray-700">
                                        <div className="h-2 w-10 rounded bg-gray-200 dark:bg-gray-600" />
                                        <div className="h-2 w-14 rounded bg-gray-200 dark:bg-gray-600" />
                                        <div className="h-2 w-8 rounded bg-gray-200 dark:bg-gray-600 ml-auto" />
                                        <div className="h-5 w-12 rounded-full bg-emerald-100" />
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* ===== VIDEO ===== */}
            <section className="bg-gray-50 dark:bg-gray-900 py-16 px-4">
                <div className="max-w-3xl mx-auto text-center">
                    <p className="text-sm text-gray-500 dark:text-gray-400 mb-6">
                        See How Qrintly Works in 60 Seconds
                    </p>
                    <div className="relative rounded-2xl overflow-hidden bg-gray-200 dark:bg-gray-800 aspect-video flex items-center justify-center shadow-lg">
                        <button className="w-14 h-14 rounded-full bg-white/90 dark:bg-gray-900/90 flex items-center justify-center shadow-md hover:scale-105 transition-transform">
                            <Play className="w-6 h-6 text-brand ml-1" />
                        </button>
                    </div>
                </div>
            </section>

            {/* ===== PAIN POINTS ===== */}
            <section className="py-16 px-4 max-w-6xl mx-auto">
                <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 dark:text-white text-center mb-10">
                    A Day at a Print Shop...
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {/* Shopkeeper Problems */}
                    <div>
                        <p className="text-sm font-semibold text-gray-500 dark:text-gray-400 mb-4">
                            Shopkeeper Problems
                        </p>
                        <div className="space-y-3">
                            {[
                                'Files sent over WhatsApp get lost in chats',
                                'No way to track which job belongs to whom',
                                'Customers keep calling to ask print status',
                                'Need to ask customer mobile no. or email to find attachments',
                            ].map((text, i) => (
                                <div key={i} className="flex items-start gap-3 bg-rose-50 dark:bg-rose-950/20 border border-rose-100 dark:border-rose-900/30 rounded-xl px-4 py-3">
                                    <span className="text-rose-400 mt-0.5">✕</span>
                                    <p className="text-sm text-gray-700 dark:text-gray-300">{text}</p>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Customer Problems */}
                    <div>
                        <p className="text-sm font-semibold text-gray-500 dark:text-gray-400 mb-4">
                            Customer Problems
                        </p>
                        <div className="space-y-3">
                            {[
                                'No confirmation that files were received',
                                'Have to keep asking shopkeeper for print',
                                'Awkward waiting without knowing when it\'s ready',
                                'Have to save whatsapp no. or email of every shops you visit',
                            ].map((text, i) => (
                                <div key={i} className="flex items-start gap-3 bg-rose-50 dark:bg-rose-950/20 border border-rose-100 dark:border-rose-900/30 rounded-xl px-4 py-3">
                                    <span className="text-rose-400 mt-0.5">✕</span>
                                    <p className="text-sm text-gray-700 dark:text-gray-300">{text}</p>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </section>

            {/* ===== MEET QRINTLY ===== */}
            <section className="bg-gray-50 dark:bg-gray-900 py-16 px-4">
                <div className="max-w-6xl mx-auto text-center">
                    <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 dark:text-white mb-2">
                        Meet Qrintly.
                    </h2>
                    <p className="text-sm text-gray-500 dark:text-gray-400 mb-10">
                        One QR code. That's all it takes to get started.
                    </p>
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
                        {[
                            { step: '1. Scan', desc: 'Customer scans your shop QR code with their phone', icon: '📱' },
                            { step: '2. Upload', desc: 'They upload files and set print preferences instantly', icon: '📤' },
                            { step: '3. Dashboard', desc: 'You see the job on your dashboard, ready to print', icon: '🖥️' },
                        ].map((item) => (
                            <div key={item.step} className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-100 dark:border-gray-700 p-6 text-center">
                                <div className="text-3xl mb-3">{item.icon}</div>
                                <p className="text-sm font-semibold text-gray-900 dark:text-white mb-1">{item.step}</p>
                                <p className="text-xs text-gray-500 dark:text-gray-400">{item.desc}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* ===== HOW IT WORKS ===== */}
            <section id="how-it-works" className="py-16 px-4 max-w-6xl mx-auto">
                <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 dark:text-white text-center mb-10">
                    How It Works
                </h2>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-8">
                    {[
                        { num: '1', title: 'Generate your shop QR', desc: 'Sign up, create your shop, and get a unique QR code in seconds.' },
                        { num: '2', title: 'Customer uploads files', desc: 'They scan, upload files, pick preferences, no app needed.' },
                        { num: '3', title: 'You manage from dashboard', desc: 'Print jobs appear instantly. Track status, print, and done.' },
                    ].map((item) => (
                        <div key={item.num} className="flex flex-col items-center text-center">
                            <div className="w-10 h-10 rounded-full bg-brand text-white flex items-center justify-center text-sm font-bold mb-4 shadow-md shadow-indigo-200">
                                {item.num}
                            </div>
                            <p className="text-sm font-semibold text-gray-900 dark:text-white mb-1">{item.title}</p>
                            <p className="text-xs text-gray-500 dark:text-gray-400">{item.desc}</p>
                        </div>
                    ))}
                </div>
            </section>

            {/* ===== WHY PRINT SHOPS LOVE QRINTLY ===== */}
            <section id="features" className="bg-gray-50 dark:bg-gray-900 py-16 px-4">
                <div className="max-w-6xl mx-auto">
                    <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 dark:text-white text-center mb-10">
                        Why Print Shops Love Qrintly
                    </h2>
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
                        {[
                            { icon: '📁', title: 'No more WhatsApp chaos', desc: 'All files come in organized with job IDs, not buried in chat.' },
                            { icon: '🎫', title: 'Job ID instead of phone numbers', desc: 'Call out customers by their Job ID, no need to ask for phone numbers or emails in a crowded shop.' },
                            { icon: '🔒', title: 'Auto file deletion', desc: 'Files are automatically deleted after processing. No storage bloat.' },
                            { icon: '📊', title: 'Analytics at a glance', desc: 'See today\'s jobs, completed count, and pending work in one view.' },
                            { icon: '🎯', title: 'Real-time status tracking', desc: 'Customers track their job status live without calling the shop.' },
                            { icon: '⚡', title: 'Instant job visibility', desc: 'New jobs appear on your dashboard the moment a customer uploads.' },
                        ].map((item) => (
                            <div key={item.title} className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-100 dark:border-gray-700 p-5">
                                <div className="text-2xl mb-3">{item.icon}</div>
                                <p className="text-sm font-semibold text-gray-900 dark:text-white mb-1">{item.title}</p>
                                <p className="text-xs text-gray-500 dark:text-gray-400">{item.desc}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* ===== CTA BANNER ===== */}
            <section className="bg-brand py-16 px-4 text-center">
                <h2 className="text-2xl sm:text-3xl font-bold text-white mb-2">
                    Make Your Print Shop Professional.
                </h2>
                <p className="text-white/70 text-sm mb-8">
                    Join print shops already using Qrintly to manage their workflow.
                </p>
                <Link
                    to="/register"
                    className="inline-flex items-center px-6 py-3 rounded-xl bg-white text-brand text-sm font-semibold hover:bg-gray-50"
                >
                    Generate My QR
                </Link>
            </section>

            {/* ===== FOOTER ===== */}
            <footer id="footer" className="bg-gray-900 text-gray-400 py-12 px-4">
                <div className="max-w-6xl mx-auto grid grid-cols-2 sm:grid-cols-4 gap-8 mb-10">
                    <div>
                        <div className="flex items-center gap-2 mb-3">
                            <div className="w-6 h-6 rounded-lg bg-brand flex items-center justify-center">
                                <QrCode className="w-3.5 h-3.5 text-white" />
                            </div>
                            <span className="text-white font-semibold text-sm">Qrintly</span>
                        </div>
                        <p className="text-xs leading-relaxed">
                            The modern way to manage print shop jobs with QR codes.
                        </p>
                    </div>

                    <div>
                        <p className="text-white text-xs font-semibold mb-3">Product</p>
                        <ul className="space-y-2 text-xs">
                            <li><a href="#features" className="hover:text-white transition-colors">Features</a></li>
                            <li><a href="#how-it-works" className="hover:text-white transition-colors">How It Works</a></li>
                            <li><Link to="/register" className="hover:text-white transition-colors">Get Started</Link></li>
                        </ul>
                    </div>

                    <div>
                        <p className="text-white text-xs font-semibold mb-3">Manual</p>
                        <ul className="space-y-2 text-xs">
                            <li><a href="#" className="hover:text-white transition-colors">Setup Guide</a></li>
                            <li><a href="#" className="hover:text-white transition-colors">FAQ</a></li>
                            <li><a href="#" className="hover:text-white transition-colors">Support</a></li>
                        </ul>
                    </div>

                    <div>
                        <p className="text-white text-xs font-semibold mb-3">Legal</p>
                        <ul className="space-y-2 text-xs">
                            <li><a href="#" className="hover:text-white transition-colors">Privacy Policy</a></li>
                            <li><a href="#" className="hover:text-white transition-colors">Terms of Service</a></li>
                            <li><a href="#" className="hover:text-white transition-colors">Security</a></li>
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

export default LandingPage;

