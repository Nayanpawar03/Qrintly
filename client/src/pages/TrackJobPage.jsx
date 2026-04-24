import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { submitFeedback } from '../api/feedback';
import {
    CheckCircle2,
    Circle,
    Copy,
    Gift,
    Info,
    Loader2,
    Share2,
    Shield,
} from 'lucide-react';
import { trackJob } from '../api/jobs';

const STEPS = [
    { key: 'uploaded', label: 'Uploaded', desc: 'Files successfully received' },
    { key: 'viewed', label: 'Viewed', desc: 'Shop has opened your files' },
    { key: 'printing', label: 'Printing', desc: 'Your files are being printed' },
    { key: 'ready', label: 'Ready', desc: 'Your prints are ready for pickup' },
];

const STATUS_ORDER = ['uploaded', 'viewed', 'printing', 'ready'];

function TrackJobPage() {
    const { jobId } = useParams();
    const [job, setJob] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [copied, setCopied] = useState(false);
    const [showFeedback, setShowFeedback] = useState(false);
    const [rating, setRating] = useState(0);
    const [comment, setComment] = useState('');
    const [feedbackSubmitted, setFeedbackSubmitted] = useState(false);
    const [submittingFeedback, setSubmittingFeedback] = useState(false);

    useEffect(() => {
        trackJob(decodeURIComponent(jobId))
            .then((res) => setJob(res.data))
            .catch(() => setError('Job not found. Please check your Job ID.'))
            .finally(() => setLoading(false));
    }, [jobId]);

    // Auto-refresh every 6 seconds
    useEffect(() => {
        if (!job || job.status === 'collected' || job.status === 'expired') return;

        const interval = setInterval(() => {
            trackJob(decodeURIComponent(jobId))
                .then((res) => setJob(res.data))
                .catch(() => { });
        }, 6000);

        return () => clearInterval(interval);
    }, [job, jobId]);

    // When job becomes ready, show feedback after 30s
    useEffect(() => {
        if (job?.status !== 'ready') return;
        const timer = setTimeout(() => setShowFeedback(true), 30 * 1000);
        return () => clearTimeout(timer);
    }, [job?.status]);



    const currentIndex = job ? STATUS_ORDER.indexOf(job.status) : -1;

    const formatTime = (iso) => {
        if (!iso) return null;
        return new Date(iso).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    };

    const handleCopy = async () => {
        await navigator.clipboard.writeText(job.jobId);
        setCopied(true);
        setTimeout(() => setCopied(false), 1500);
    };

    const handleShare = async () => {
        const url = window.location.href;
        if (navigator.share) {
            await navigator.share({ title: 'Job Status', text: `Track my print job ${job.jobId}`, url });
        } else {
            await navigator.clipboard.writeText(url);
        }
    };

    const handleFeedbackSubmit = async () => {
        if (!rating) return;
        setSubmittingFeedback(true);
        try {
            await submitFeedback({ jobId: job.jobId, rating, comment });
            setFeedbackSubmitted(true);
        } catch {
            setFeedbackSubmitted(true);
        } finally {
            setSubmittingFeedback(false);
        }
    };

    if (showFeedback) {
        return (
            <div className="min-h-screen bg-gray-50 dark:bg-gray-950 flex items-center justify-center px-4">
                <div className="w-full max-w-sm bg-white dark:bg-gray-900 rounded-2xl p-8 shadow-sm text-center">
                    {feedbackSubmitted ? (
                        <>
                            <div className="text-4xl mb-4">🎉</div>
                            <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-2">
                                Thanks for your feedback!
                            </h2>
                            <p className="text-sm text-gray-500 dark:text-gray-400">
                                It helps us make Qrintly better.
                            </p>
                        </>
                    ) : (
                        <>
                            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
                                Thank You for Using Qrintly 🙌
                            </h2>
                            <p className="text-sm text-gray-500 dark:text-gray-400 mb-6">
                                We hope your printing experience was smooth and easy.
                            </p>

                            <p className="text-sm font-semibold text-gray-900 dark:text-white mb-3">
                                How was your experience?
                            </p>

                            {/* Stars */}
                            <div className="flex items-center justify-center gap-2 mb-6">
                                {[1, 2, 3, 4, 5].map((star) => (
                                    <button
                                        key={star}
                                        onClick={() => setRating(star)}
                                        className={`text-4xl transition-transform hover:scale-110 ${star <= rating ? 'text-amber-400' : 'text-gray-200 dark:text-gray-700'
                                            }`}
                                    >
                                        ★
                                    </button>
                                ))}
                            </div>

                            {/* Comment */}
                            <div className="text-left mb-4">
                                <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
                                    Help us improve{' '}
                                    <span className="text-xs text-gray-400 font-normal">(optional)</span>
                                </label>
                                <textarea
                                    rows={4}
                                    maxLength={300}
                                    placeholder="Tell us what we can do better..."
                                    value={comment}
                                    onChange={(e) => setComment(e.target.value)}
                                    className="mt-1.5 w-full rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 px-4 py-3 text-sm text-gray-900 dark:text-gray-100 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-brand/25 focus:border-brand resize-none"
                                />
                                <p className="text-right text-xs text-gray-400 mt-1">{comment.length}/300</p>
                            </div>

                            {/* Info banner */}
                            <div className="rounded-xl bg-indigo-50 dark:bg-indigo-950/20 px-4 py-3 mb-5 text-xs text-indigo-600 dark:text-indigo-400">
                                <p className="font-semibold">Qrintly is still growing.</p>
                                <p className="text-indigo-500 dark:text-indigo-500">Your feedback directly helps us improve.</p>
                            </div>

                            {/* Buttons */}
                            <div className="grid grid-cols-2 gap-3">
                                <button
                                    onClick={() => setFeedbackSubmitted(true)}
                                    className="h-11 rounded-xl bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-300 text-sm font-medium hover:bg-gray-200 dark:hover:bg-gray-700"
                                >
                                    Skip
                                </button>
                                <button
                                    onClick={handleFeedbackSubmit}
                                    disabled={!rating || submittingFeedback}
                                    className="h-11 rounded-xl bg-accent-hover text-white text-sm font-medium hover:bg-accent-dark disabled:opacity-50 disabled:cursor-not-allowed"
                                >
                                    {submittingFeedback ? 'Submitting...' : 'Submit Feedback'}
                                </button>
                            </div>
                        </>
                    )}
                </div>
            </div>
        );
    }


    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-950">
                <Loader2 className="w-6 h-6 animate-spin text-brand" />
            </div>
        );
    }

    if (error) {
        return (
            <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50 dark:bg-gray-950 px-6 gap-3">
                <p className="text-sm text-danger text-center">{error}</p>
                <a href="/" className="text-sm text-brand font-medium hover:underline">Go Home</a>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-50 dark:bg-gray-950 pb-24">
            <div className="max-w-lg mx-auto px-4">

                {/* Success header */}
                <div className="pt-10 pb-6 text-center">
                    <div className="w-14 h-14 rounded-full bg-emerald-500 flex items-center justify-center mx-auto mb-4 shadow-lg shadow-emerald-200">
                        <CheckCircle2 className="w-8 h-8 text-white" />
                    </div>
                    <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
                        Upload Successful 🎉
                    </h1>
                    <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
                        Your files have been received and are being processed
                    </p>
                </div>

                {/* Job ID card */}
                <div className="bg-white dark:bg-gray-900 rounded-2xl border border-gray-100 dark:border-gray-800 px-6 py-4 text-center shadow-sm mb-4">
                    <p className="text-xs text-gray-400 dark:text-gray-500 mb-1">Job ID</p>
                    <div className="flex items-center justify-center gap-2">
                        <span className="text-4xl font-bold text-brand">{job.jobId}</span>
                        <button
                            onClick={handleCopy}
                            className="text-gray-400 hover:text-brand transition-colors"
                            aria-label="Copy Job ID"
                        >
                            <Copy className="w-5 h-5" />
                        </button>
                    </div>
                    {copied && <p className="text-xs text-emerald-500 mt-1">Copied!</p>}
                    <p className="text-xs text-gray-400 dark:text-gray-500 mt-2">
                        Save this ID to track your job later
                    </p>
                </div>

                {/* Info banner */}
                <div className="bg-blue-50 dark:bg-blue-950/20 border border-blue-100 dark:border-blue-900/30 rounded-xl px-4 py-3 flex items-start gap-2 mb-6">
                    <Info className="w-4 h-4 text-blue-500 mt-0.5 shrink-0" />
                    <div>
                        <p className="text-xs text-blue-700 dark:text-blue-300 font-medium">
                            Check back here to see when your prints are ready
                        </p>
                        <p className="text-xs text-blue-500 dark:text-blue-400 mt-0.5">
                            Page auto-refreshes every 6 seconds
                        </p>
                    </div>
                </div>

                {/* Status timeline */}
                <div className="space-y-1 mb-4">
                    {STEPS.map((step, idx) => {
                        const isDone = currentIndex > idx;
                        const isActive = currentIndex === idx;
                        const isPending = currentIndex < idx;
                        const isLast = idx === STEPS.length - 1;

                        // Insert sponsored card between viewed and printing
                        const showAd = idx === 2;

                        return (
                            <div key={step.key}>
                                {showAd && (
                                    <div className="my-3 rounded-xl bg-amber-50 dark:bg-amber-950/20 border border-amber-100 dark:border-amber-900/30 px-4 py-3">
                                        <p className="text-[10px] font-semibold text-amber-500 uppercase tracking-wide mb-1">
                                            🎁 Sponsored
                                        </p>
                                        <p className="text-sm font-semibold text-gray-900 dark:text-white">
                                            20% Off Premium Paper
                                        </p>
                                        <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">
                                            Upgrade your prints with high-quality glossy or matte finish
                                        </p>
                                        <button className="mt-2 text-xs text-amber-600 font-medium flex items-center gap-1 hover:underline">
                                            Learn More →
                                        </button>
                                    </div>
                                )}

                                <div className="flex items-start gap-4">
                                    {/* Icon + line */}
                                    <div className="flex flex-col items-center">
                                        <div className={`w-9 h-9 rounded-full flex items-center justify-center shrink-0 transition-all ${isDone
                                            ? 'bg-emerald-500 shadow-sm shadow-emerald-200'
                                            : isActive
                                                ? 'bg-brand shadow-sm shadow-indigo-200'
                                                : 'bg-gray-100 dark:bg-gray-800'
                                            }`}>
                                            {isDone ? (
                                                <CheckCircle2 className="w-5 h-5 text-white" />
                                            ) : isActive ? (
                                                <Loader2 className="w-5 h-5 text-white animate-spin" />
                                            ) : (
                                                <Circle className="w-5 h-5 text-gray-300 dark:text-gray-600" />
                                            )}
                                        </div>
                                        {!isLast && (
                                            <div className={`w-0.5 h-8 mt-1 rounded-full ${isDone ? 'bg-emerald-300' : 'bg-gray-200 dark:bg-gray-700'
                                                }`} />
                                        )}
                                    </div>

                                    {/* Text */}
                                    <div className="pt-1.5 pb-6">
                                        <p className={`text-sm font-semibold ${isPending
                                            ? 'text-gray-400 dark:text-gray-500'
                                            : 'text-gray-900 dark:text-white'
                                            }`}>
                                            {step.label}
                                        </p>
                                        <p className={`text-xs mt-0.5 ${isPending
                                            ? 'text-gray-300 dark:text-gray-600'
                                            : 'text-gray-500 dark:text-gray-400'
                                            }`}>
                                            {step.desc}
                                        </p>
                                        {isActive && step.key === 'printing' && (
                                            <div className="mt-2 h-1.5 w-32 rounded-full bg-gray-200 dark:bg-gray-700 overflow-hidden">
                                                <div className="h-full w-1/2 rounded-full bg-brand animate-pulse" />
                                            </div>
                                        )}
                                        {(isDone || isActive) && formatTime(job[`${step.key}At`] || job.createdAt) && (
                                            <p className="text-[11px] text-gray-400 dark:text-gray-500 mt-1">
                                                {formatTime(step.key === 'uploaded' ? job.createdAt : job[`${step.key}At`])}
                                            </p>
                                        )}
                                    </div>
                                </div>
                            </div>
                        );
                    })}
                </div>

                {/* Info cards */}
                <div className="grid grid-cols-2 gap-3 mb-4">
                    <div className="bg-white dark:bg-gray-900 rounded-xl border border-gray-100 dark:border-gray-800 px-4 py-3">
                        <div className="flex items-center gap-2 mb-1">
                            <div className="w-6 h-6 rounded-lg bg-indigo-50 dark:bg-indigo-900/30 flex items-center justify-center">
                                <svg className="w-3.5 h-3.5 text-brand" fill="currentColor" viewBox="0 0 20 20">
                                    <path d="M10 2a6 6 0 00-6 6v3.586l-.707.707A1 1 0 004 14h12a1 1 0 00.707-1.707L16 11.586V8a6 6 0 00-6-6z" />
                                </svg>
                            </div>
                            <span className="text-xs text-gray-400 dark:text-gray-500">Estimated Wait Time</span>
                        </div>
                        <p className="text-lg font-bold text-brand">15-20 mins</p>
                        <p className="text-[10px] text-gray-400 dark:text-gray-500 mt-0.5">Based on current queue</p>
                    </div>

                    <div className="bg-white dark:bg-gray-900 rounded-xl border border-gray-100 dark:border-gray-800 px-4 py-3">
                        <div className="flex items-center gap-2 mb-1">
                            <div className="w-6 h-6 rounded-lg bg-emerald-50 dark:bg-emerald-900/30 flex items-center justify-center">
                                <svg className="w-3.5 h-3.5 text-emerald-500" fill="currentColor" viewBox="0 0 20 20">
                                    <path fillRule="evenodd" d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z" clipRule="evenodd" />
                                </svg>
                            </div>
                            <span className="text-xs text-gray-400 dark:text-gray-500">Shop Contact</span>
                        </div>
                        <p className="text-sm font-semibold text-gray-900 dark:text-white">Qrinty Print Hub</p>
                        <p className="text-[10px] text-gray-500 dark:text-gray-400 mt-0.5">+1 (845) 123-4567</p>
                        <button className="text-[10px] text-brand font-medium mt-1 hover:underline">
                            Call Shop →
                        </button>
                    </div>
                </div>

                {/* Sponsored card */}
                <div className="bg-gradient-to-r from-purple-50 to-pink-50 dark:from-purple-950/20 dark:to-pink-950/20 border border-purple-100 dark:border-purple-900/30 rounded-2xl px-5 py-4 mb-4">
                    <div className="flex items-center gap-2 mb-2">
                        <Gift className="w-4 h-4 text-purple-500" />
                        <span className="text-[10px] font-semibold text-purple-500 uppercase tracking-wide">Sponsored</span>
                    </div>
                    <p className="text-base font-bold text-gray-900 dark:text-white mb-1">
                        Grab a Coffee While You Wait
                    </p>
                    <p className="text-xs text-gray-600 dark:text-gray-400 mb-3">
                        Redeem this code - <span className="font-mono font-semibold text-purple-600">PRINT15</span> - and get 15% off
                    </p>
                    <p className="text-xs font-semibold text-purple-600 mb-2">
                        15% off with this Job ID
                    </p>
                    <button className="w-full h-10 rounded-xl bg-purple-600 text-white text-sm font-medium hover:bg-purple-700">
                        Get Directions
                    </button>
                </div>

                {/* Share button */}
                <button
                    onClick={handleShare}
                    className="w-full h-12 rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 text-gray-700 dark:text-gray-200 text-sm font-medium flex items-center justify-center gap-2 hover:bg-gray-50 dark:hover:bg-gray-800 mb-6"
                >
                    <Share2 className="w-4 h-4" />
                    Share job status with someone
                </button>

                {/* Footer */}
                <div className="flex items-center justify-center gap-2 text-[11px] text-gray-400 dark:text-gray-500 pb-4">
                    <Shield className="w-3 h-3" />
                    <span>Your files are secure and will auto-delete after processing</span>
                </div>
                <p className="text-center text-[11px] text-gray-400 dark:text-gray-500">
                    Powered by <span className="text-brand font-medium">Qrintly</span>
                </p>
            </div>

            {/* Fixed bottom bar */}
            <div className="fixed bottom-0 left-0 right-0 bg-emerald-500 text-white px-4 py-3 flex items-center justify-between shadow-lg">
                <div className="flex items-center gap-2">
                    <div className="w-5 h-5 rounded-full bg-white/20 flex items-center justify-center">
                        <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
                            <path d="M2 3a1 1 0 011-1h2.153a1 1 0 01.986.836l.74 4.435a1 1 0 01-.54 1.06l-1.548.773a11.037 11.037 0 006.105 6.105l.774-1.548a1 1 0 011.059-.54l4.435.74a1 1 0 01.836.986V17a1 1 0 01-1 1h-2C7.82 18 2 12.18 2 5V3z" />
                        </svg>
                    </div>
                    <div>
                        <p className="text-xs font-semibold">Need Assistance?</p>
                        <p className="text-[10px] text-white/80">Call shop for help</p>
                    </div>
                </div>
                <button className="px-4 py-2 rounded-lg bg-white text-emerald-600 text-xs font-semibold hover:bg-emerald-50">
                    Ring Now
                </button>
            </div>
        </div>
    );
}

export default TrackJobPage;
