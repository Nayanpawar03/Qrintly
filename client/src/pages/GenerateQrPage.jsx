import { useEffect, useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import {
  ArrowRight,
  CheckCircle2,
  Copy,
  Download,
  MessageCircle,
  QrCode,
} from 'lucide-react';
import { createShop, getMyShop } from '../api/shops';

function GenerateQrPage() {
  const [shopName, setShopName] = useState('');
  const [shop, setShop] = useState(null);
  const [loadingShop, setLoadingShop] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');
  const [notice, setNotice] = useState('');
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    const loadExistingShop = async () => {
      setLoadingShop(true);
      setError('');

      try {
        const res = await getMyShop();
        setShop(res.data);
        setShopName(res.data?.shopName || '');
      } catch (err) {
        if (err.response?.status !== 404) {
          setError(err.response?.data?.message || 'Failed to load your shop.');
        }
      } finally {
        setLoadingShop(false);
      }
    };

    loadExistingShop();
  }, []);

  const uploadUrl = useMemo(() => {
    if (!shop?.shopId) return '';
    return `${window.location.origin}/upload/${shop.shopId}`;
  }, [shop]);

  const handleGenerate = async (e) => {
    e.preventDefault();

    if (!shopName.trim()) {
      setError('Shop name is required.');
      return;
    }

    setSubmitting(true);
    setError('');
    setNotice('');

    try {
      const res = await createShop({ shopName: shopName.trim() });
      setShop(res.data);
      setShopName(res.data?.shopName || shopName.trim());
      setNotice('Shop QR generated successfully.');
    } catch (err) {
      const status = err.response?.status;
      const message = err.response?.data?.message;

      if (status === 400 && message?.toLowerCase().includes('already')) {
        try {
          const existing = await getMyShop();
          setShop(existing.data);
          setShopName(existing.data?.shopName || shopName.trim());
          setNotice('You already have a shop. Loaded your existing QR.');
          return;
        } catch {
          setError('Shop already exists, but failed to load it.');
          return;
        }
      }

      setError(message || 'Failed to generate QR.');
    } finally {
      setSubmitting(false);
    }
  };

  const handleDownloadPng = () => {
    if (!shop?.qrCodeUrl) return;

    const a = document.createElement('a');
    a.href = shop.qrCodeUrl;
    a.download = `${shop.shopId || 'shop'}-qr.png`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
  };

  const handleDownloadPdf = () => {
    if (!shop?.qrCodeUrl || !shop?.shopId) return;

    const printWindow = window.open('', '_blank', 'width=800,height=900');
    if (!printWindow) return;

    const safeShopName = shop.shopName || 'Shop';
    const safeShopId = shop.shopId;
    const safeUploadUrl = uploadUrl;
    const safeQr = shop.qrCodeUrl;

    printWindow.document.write(`
      <!doctype html>
      <html>
        <head>
          <meta charset="utf-8" />
          <title>${safeShopName} QR</title>
          <style>
            body { font-family: Inter, Arial, sans-serif; margin: 24px; color: #111827; }
            .card { border: 1px solid #e5e7eb; border-radius: 16px; padding: 24px; max-width: 560px; margin: 0 auto; text-align: center; }
            .brand { font-size: 28px; font-weight: 700; margin-bottom: 8px; color: #4f46e5; }
            .meta { color: #6b7280; font-size: 14px; margin-bottom: 20px; }
            .qr { width: 280px; height: 280px; object-fit: contain; }
            .url { font-size: 12px; margin-top: 16px; color: #374151; word-break: break-all; }
            .hint { margin-top: 10px; font-size: 14px; color: #4b5563; }
          </style>
        </head>
        <body>
          <div class="card">
            <div class="brand">${safeShopName}</div>
            <div class="meta">Shop ID: ${safeShopId}</div>
            <img class="qr" src="${safeQr}" alt="Shop QR Code" />
            <div class="hint">Scan to upload files for printing</div>
            <div class="url">${safeUploadUrl}</div>
          </div>
          <script>
            window.onload = function () { window.print(); };
          </script>
        </body>
      </html>
    `);
    printWindow.document.close();
  };

  const handleCopyLink = async () => {
    if (!uploadUrl) return;

    try {
      await navigator.clipboard.writeText(uploadUrl);
      setCopied(true);
      setTimeout(() => setCopied(false), 1500);
    } catch {
      setError('Could not copy link. Please copy manually.');
    }
  };

  const handleShareWhatsApp = () => {
    if (!uploadUrl) return;
    const text = `Upload files for ${shop?.shopName || 'our print shop'}: ${uploadUrl}`;
    window.open(`https://wa.me/?text=${encodeURIComponent(text)}`, '_blank');
  };

  return (
    <div className="min-h-screen bg-gray-100 dark:bg-gray-950">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 sm:py-6">
        <div className="mb-6 rounded-xl bg-emerald-600 text-white px-5 py-4 flex items-center justify-between">
          <div>
            <p className="font-semibold text-base">
              Payment Successful. Let&apos;s Generate Your Shop QR.
            </p>
            <p className="text-emerald-100 text-sm">Your subscription is active.</p>
          </div>
          <CheckCircle2 className="w-6 h-6" />
        </div>

        {(error || notice) && (
          <div
            className={`mb-4 rounded-lg border px-4 py-3 text-sm ${
              error
                ? 'border-rose-200 bg-rose-50 text-rose-700'
                : 'border-emerald-200 bg-emerald-50 text-emerald-700'
            }`}
          >
            {error || notice}
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-[1fr_1fr] gap-6">
          <section className="rounded-2xl bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 p-7">
            <h1 className="text-4xl font-bold text-gray-900 dark:text-gray-100">
              Create Your Shop QR
            </h1>
            <p className="mt-2 text-sm text-gray-500 dark:text-gray-400">
              One QR per shop. Customers scan this to upload files directly.
            </p>

            <form onSubmit={handleGenerate} className="mt-8 space-y-5">
              <div>
                <label
                  htmlFor="shopName"
                  className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5"
                >
                  Shop Name <span className="text-rose-500">*</span>
                </label>
                <input
                  id="shopName"
                  name="shopName"
                  type="text"
                  placeholder="Enter your shop name"
                  value={shopName}
                  onChange={(e) => setShopName(e.target.value)}
                  className="w-full h-12 rounded-xl border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 px-4 text-gray-900 dark:text-gray-100 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-brand/25 focus:border-brand"
                />
              </div>

              <button
                type="submit"
                disabled={submitting || loadingShop || Boolean(shop)}
                className="w-full h-11 rounded-xl bg-emerald-600 text-white font-medium hover:bg-emerald-700 disabled:opacity-60 disabled:cursor-not-allowed"
              >
                {loadingShop
                  ? 'Loading...'
                  : submitting
                  ? 'Generating...'
                  : shop
                  ? 'QR Already Generated'
                  : 'Generate QR Code'}
              </button>
            </form>
          </section>

          <section className="rounded-2xl bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 p-6">
            <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-100">
              Live Preview
            </h2>

            <div className="mt-4 rounded-2xl border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 p-5">
              <div className="rounded-2xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 p-6 text-center">
                <span className="inline-flex items-center rounded-xl bg-brand text-white px-4 py-2 text-sm font-semibold">
                  Qrintly
                </span>
                <p className="mt-4 text-sm text-gray-500 dark:text-gray-400">
                  Scan to Upload Your Files
                </p>

                <div className="mt-4 rounded-xl border border-dashed border-gray-300 dark:border-gray-600 h-52 flex items-center justify-center bg-gray-50 dark:bg-gray-800">
                  {shop?.qrCodeUrl ? (
                    <img
                      src={shop.qrCodeUrl}
                      alt="Shop QR code"
                      className="w-44 h-44 object-contain"
                    />
                  ) : (
                    <div className="text-center text-gray-400 dark:text-gray-500">
                      <QrCode className="w-12 h-12 mx-auto mb-2" />
                      <p className="text-sm">QR will appear here</p>
                    </div>
                  )}
                </div>

                <h3 className="mt-5 text-2xl font-bold text-gray-900 dark:text-gray-100">
                  {shop?.shopName || 'Shop Name'}
                </h3>
                <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
                  Shop ID: {shop?.shopId || 'QR-1024'}
                </p>

                <p className="mt-6 text-sm text-gray-500 dark:text-gray-400">
                  Scan this QR to upload files for printing
                </p>
              </div>
            </div>

            <div className="mt-4 grid grid-cols-1 sm:grid-cols-2 gap-3">
              <button
                type="button"
                onClick={handleDownloadPdf}
                disabled={!shop?.qrCodeUrl}
                className="h-11 rounded-xl bg-indigo-300 text-white font-medium hover:bg-indigo-400 disabled:opacity-50 disabled:cursor-not-allowed inline-flex items-center justify-center gap-2"
              >
                <Download className="w-4 h-4" />
                Download PDF
              </button>

              <button
                type="button"
                onClick={handleDownloadPng}
                disabled={!shop?.qrCodeUrl}
                className="h-11 rounded-xl bg-gray-400 text-white font-medium hover:bg-gray-500 disabled:opacity-50 disabled:cursor-not-allowed inline-flex items-center justify-center gap-2"
              >
                <Download className="w-4 h-4" />
                Download PNG
              </button>

              <button
                type="button"
                onClick={handleCopyLink}
                disabled={!shop?.shopId}
                className="h-11 rounded-xl bg-blue-300 text-white font-medium hover:bg-blue-400 disabled:opacity-50 disabled:cursor-not-allowed inline-flex items-center justify-center gap-2"
              >
                <Copy className="w-4 h-4" />
                {copied ? 'Copied' : 'Copy Link'}
              </button>

              <button
                type="button"
                onClick={handleShareWhatsApp}
                disabled={!shop?.shopId}
                className="h-11 rounded-xl bg-emerald-300 text-white font-medium hover:bg-emerald-400 disabled:opacity-50 disabled:cursor-not-allowed inline-flex items-center justify-center gap-2"
              >
                <MessageCircle className="w-4 h-4" />
                Share WhatsApp
              </button>
            </div>
          </section>
        </div>

        <div className="mt-10 flex justify-center">
          <Link
            to="/dashboard"
            className="inline-flex items-center gap-2 rounded-xl bg-brand text-white px-8 py-3.5 font-medium hover:bg-brand/90"
          >
            Go to Dashboard
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </div>
    </div>
  );
}

export default GenerateQrPage;
