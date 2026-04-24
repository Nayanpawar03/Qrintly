import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Shield, Upload, Gift, Printer, CheckCircle2, Plus, Minus, ChevronDown } from 'lucide-react';
import { getShopByShopId } from '../api/shops';
import { uploadJob } from '../api/jobs';

function UploadPage() {
    const { shopId } = useParams();
    const navigate = useNavigate();

    const [shop, setShop] = useState(null);
    const [shopError, setShopError] = useState('');

    const [files, setFiles] = useState([]);
    const [dragging, setDragging] = useState(false);

    const [form, setForm] = useState({
        customerName: '',
        copies: 1,
        color: 'bw',
        pageSize: 'A4',
        sided: 'single',
    });

    const [submitting, setSubmitting] = useState(false);
    const [submitError, setSubmitError] = useState('');

    useEffect(() => {
        getShopByShopId(shopId)
            .then((res) => setShop(res.data))
            .catch(() => setShopError('Shop not found.'));
    }, [shopId]);

    const handleSubmit = async () => {
        if (files.length === 0) {
            setSubmitError('Please select at least one file.');
            return;
        }

        setSubmitting(true);
        setSubmitError('');

        try {
            const formData = new FormData();
            files.forEach((file) => formData.append('files', file));
            formData.append('customerName', form.customerName);
            formData.append('copies', form.copies);
            formData.append('color', form.color);
            formData.append('pageSize', form.pageSize);
            formData.append('sided', form.sided);

            const res = await uploadJob(shopId, formData);
            navigate(`/track/${encodeURIComponent(res.data.jobId)}`);
        } catch (err) {
            setSubmitError(err.response?.data?.message || 'Upload failed. Please try again.');
        } finally {
            setSubmitting(false);
        }
    };


    return (
        <div className="min-h-screen bg-gray-50 dark:bg-gray-950">
            <div className="max-w-lg mx-auto px-4 pb-12">

                {/* Header */}
                <div className="pt-8 pb-4 text-center">
                    <h1 className="text-xl font-bold text-gray-900 dark:text-white">
                        {shopError
                            ? 'Shop not found'
                            : shop
                                ? `Send files to ${shop.shopName}`
                                : 'Loading...'}
                    </h1>
                    <p className="mt-1 text-xs text-gray-500 dark:text-gray-400 flex items-center justify-center gap-1">
                        <Shield className="w-3.5 h-3.5 text-brand" />
                        Your files will be securely uploaded to this shop
                    </p>
                </div>

                {/* Sponsored ticker */}
                <div className="bg-white dark:bg-gray-900 border-y border-gray-100 dark:border-gray-800 py-2 px-4 flex items-center gap-2 text-xs text-gray-500 dark:text-gray-400 mb-6">
                    <span className="font-semibold text-gray-400 dark:text-gray-500">Sponsored</span>
                    <span>Premium paper available – Ask at counter for upgrade</span>
                </div>

                {shopError && (
                    <div className="rounded-xl bg-rose-50 border border-rose-100 text-rose-700 px-4 py-3 text-sm text-center">
                        {shopError}
                    </div>
                )}

                {!shopError && shop && (
                    <>
                        {/* File upload zone */}
                        <div
                            className={`rounded-2xl border-2 border-dashed bg-white dark:bg-gray-900 p-8 text-center transition-colors ${dragging
                                ? 'border-brand bg-indigo-50 dark:bg-indigo-950/20'
                                : 'border-gray-200 dark:border-gray-700'
                                }`}
                            onDragOver={(e) => {
                                e.preventDefault();
                                setDragging(true);
                            }}
                            onDragLeave={() => setDragging(false)}
                            onDrop={(e) => {
                                e.preventDefault();
                                setDragging(false);
                                const droppedFiles = Array.from(e.dataTransfer.files);
                                setFiles((prev) => [...prev, ...droppedFiles]);
                            }}
                        >
                            <div className="w-16 h-16 mx-auto rounded-full bg-indigo-100 dark:bg-indigo-900/30 flex items-center justify-center mb-4">
                                <Upload className="w-8 h-8 text-brand" />
                            </div>
                            <p className="text-sm font-medium text-gray-900 dark:text-white mb-1">
                                Choose files or drag & drop here
                            </p>
                            <p className="text-xs text-gray-500 dark:text-gray-400 mb-4">
                                PDF, DOC, JPG supported · Max 5 files · 10MB each
                            </p>
                            <input
                                type="file"
                                multiple
                                accept=".pdf,.doc,.docx,.jpg,.jpeg,.png"
                                onChange={(e) => {
                                    const selected = Array.from(e.target.files);
                                    setFiles((prev) => {
                                        const combined = [...prev, ...selected];
                                        return combined.slice(0, 5);
                                    });
                                }}
                                className="hidden"
                                id="file-input"
                            />
                            <label
                                htmlFor="file-input"
                                className="inline-flex items-center justify-center px-6 py-2.5 rounded-xl bg-brand text-white text-sm font-medium hover:bg-brand/90 cursor-pointer"
                            >
                                Browse Files
                            </label>

                            {files.length > 0 && (
                                <div className="mt-4 space-y-2">
                                    {files.map((file, idx) => (
                                        <div
                                            key={idx}
                                            className="flex items-center justify-between bg-gray-50 dark:bg-gray-800 rounded-lg px-3 py-2 text-xs"
                                        >
                                            <span className="text-gray-700 dark:text-gray-200 truncate">
                                                {file.name}
                                            </span>
                                            <button
                                                type="button"
                                                onClick={() =>
                                                    setFiles((prev) => prev.filter((_, i) => i !== idx))
                                                }
                                                className="text-rose-500 hover:text-rose-700 ml-2"
                                            >
                                                ✕
                                            </button>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>

                        {/* Sponsored ad */}
                        <div className="mt-4 rounded-xl bg-emerald-50 dark:bg-emerald-950/20 border border-emerald-100 dark:border-emerald-900/30 px-4 py-3 flex items-center justify-between">
                            <div className="flex items-center gap-3">
                                <div className="w-8 h-8 rounded-lg bg-emerald-500 flex items-center justify-center">
                                    <Gift className="w-4 h-4 text-white" />
                                </div>
                                <div>
                                    <p className="text-xs font-semibold text-gray-900 dark:text-white">
                                        Get 20% off on bulk printing
                                    </p>
                                    <p className="text-[11px] text-gray-600 dark:text-gray-400">
                                        Order above 100 prints
                                    </p>
                                </div>
                            </div>
                            <span className="text-[10px] text-gray-400 dark:text-gray-500">Sponsored</span>
                        </div>
                        {/* Print Preferences */}
                        <div className="mt-6">
                            <h2 className="text-base font-semibold text-gray-900 dark:text-white mb-4">
                                Print Preferences
                            </h2>

                            <div className="space-y-5">
                                {/* Your Name */}
                                <div>
                                    <label className="block text-sm text-gray-700 dark:text-gray-300 mb-1.5">
                                        Your Name (Optional)
                                    </label>
                                    <input
                                        type="text"
                                        placeholder="Enter your name"
                                        value={form.customerName}
                                        onChange={(e) => setForm({ ...form, customerName: e.target.value })}
                                        className="w-full h-12 rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 px-4 text-sm text-gray-900 dark:text-gray-100 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-brand/25 focus:border-brand"
                                    />
                                </div>

                                {/* Copies stepper */}
                                <div>
                                    <label className="block text-sm text-gray-700 dark:text-gray-300 mb-1.5">
                                        Number of Copies
                                    </label>
                                    <div className="flex items-center gap-3">
                                        <button
                                            type="button"
                                            onClick={() => setForm((p) => ({ ...p, copies: Math.max(1, p.copies - 1) }))}
                                            className="w-10 h-10 rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 flex items-center justify-center text-gray-600 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800"
                                        >
                                            <Minus className="w-4 h-4" />
                                        </button>
                                        <span className="w-12 h-10 rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 flex items-center justify-center text-sm font-medium text-gray-900 dark:text-white">
                                            {form.copies}
                                        </span>
                                        <button
                                            type="button"
                                            onClick={() => setForm((p) => ({ ...p, copies: p.copies + 1 }))}
                                            className="w-10 h-10 rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 flex items-center justify-center text-gray-600 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800"
                                        >
                                            <Plus className="w-4 h-4" />
                                        </button>
                                    </div>
                                </div>

                                {/* Color toggle */}
                                <div>
                                    <label className="block text-sm text-gray-700 dark:text-gray-300 mb-1.5">
                                        Color
                                    </label>
                                    <div className="grid grid-cols-2 gap-2">
                                        {[
                                            { value: 'bw', label: 'Black & White', emoji: '⚫' },
                                            { value: 'color', label: 'Color', emoji: '🎨' },
                                        ].map((opt) => (
                                            <button
                                                key={opt.value}
                                                type="button"
                                                onClick={() => setForm({ ...form, color: opt.value })}
                                                className={`h-11 rounded-xl border text-sm font-medium flex items-center justify-center gap-2 transition-colors ${form.color === opt.value
                                                    ? 'bg-brand border-brand text-white'
                                                    : 'bg-white dark:bg-gray-900 border-gray-200 dark:border-gray-700 text-gray-700 dark:text-gray-300'
                                                    }`}
                                            >
                                                <span>{opt.emoji}</span>
                                                {opt.label}
                                            </button>
                                        ))}
                                    </div>
                                </div>

                                {/* Page Size */}
                                <div>
                                    <label className="block text-sm text-gray-700 dark:text-gray-300 mb-1.5">
                                        Page Size
                                    </label>
                                    <div className="relative">
                                        <select
                                            value={form.pageSize}
                                            onChange={(e) => setForm({ ...form, pageSize: e.target.value })}
                                            className="w-full h-12 rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 px-4 pr-10 text-sm text-gray-900 dark:text-gray-100 appearance-none focus:outline-none focus:ring-2 focus:ring-brand/25 focus:border-brand"
                                        >
                                            <option value="A4">A4</option>
                                            <option value="A3">A3</option>
                                            <option value="Letter">Letter</option>
                                            <option value="Legal">Legal</option>
                                        </select>
                                        <ChevronDown className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                                    </div>
                                </div>

                                {/* Sided toggle */}
                                <div>
                                    <label className="block text-sm text-gray-700 dark:text-gray-300 mb-1.5">
                                        Sided
                                    </label>
                                    <div className="grid grid-cols-2 gap-2">
                                        {[
                                            { value: 'single', label: 'Single Side' },
                                            { value: 'double', label: 'Double Side' },
                                        ].map((opt) => (
                                            <button
                                                key={opt.value}
                                                type="button"
                                                onClick={() => setForm({ ...form, sided: opt.value })}
                                                className={`h-11 rounded-xl border text-sm font-medium transition-colors ${form.sided === opt.value
                                                    ? 'bg-brand border-brand text-white'
                                                    : 'bg-white dark:bg-gray-900 border-gray-200 dark:border-gray-700 text-gray-700 dark:text-gray-300'
                                                    }`}
                                            >
                                                {opt.label}
                                            </button>
                                        ))}
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Submit error */}
                        {submitError && (
                            <div className="mt-4 rounded-xl bg-rose-50 border border-rose-100 text-rose-700 px-4 py-3 text-sm">
                                {submitError}
                            </div>
                        )}

                        {/* Submit button */}
                        <div className="mt-6">
                            <button
                                type="button"
                                onClick={handleSubmit}
                                disabled={submitting}
                                className="w-full h-13 rounded-xl bg-accent-hover text-white text-sm font-semibold hover:bg-accent-dark disabled:opacity-60 disabled:cursor-not-allowed flex items-center justify-center gap-2 py-4"
                            >
                                {submitting ? (
                                    <span className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                                ) : (
                                    'Send to Shop'
                                )}
                            </button>
                            <p className="mt-2 text-xs text-gray-500 dark:text-gray-400 flex items-center justify-center gap-1.5">
                                <CheckCircle2 className="w-3.5 h-3.5 text-accent-hover" />
                                You'll receive a job ID after submission
                            </p>
                        </div>

                        {/* Bottom sponsored card */}
                        <div className="mt-6 rounded-2xl bg-white dark:bg-gray-900 border border-gray-100 dark:border-gray-800 px-4 py-3 flex items-center gap-3">
                            <div className="w-10 h-10 rounded-xl bg-indigo-50 dark:bg-indigo-900/30 flex items-center justify-center shrink-0">
                                <Printer className="w-5 h-5 text-brand" />
                            </div>
                            <div className="flex-1 min-w-0">
                                <p className="text-xs font-semibold text-gray-900 dark:text-white">
                                    Need business cards or flyers?
                                </p>
                                <p className="text-[11px] text-gray-500 dark:text-gray-400">
                                    Professional printing services available
                                </p>
                            </div>
                            <div className="flex flex-col items-end gap-1 shrink-0">
                                <span className="text-[10px] text-gray-400">Sponsored</span>
                                <button className="px-3 py-1.5 rounded-lg bg-brand text-white text-[11px] font-medium hover:bg-brand/90">
                                    Learn More
                                </button>
                            </div>
                        </div>

                        {/* Footer */}
                        <div className="mt-8 flex items-center justify-center gap-2 text-[11px] text-gray-400 dark:text-gray-500">
                            <Shield className="w-3 h-3" />
                            <span>Files auto-delete after processing</span>
                            <span>•</span>
                            <span>Powered by <span className="text-brand font-medium">Qrintly</span></span>
                        </div>

                    </>
                )}

            </div>
        </div>
    );
}

export default UploadPage;
