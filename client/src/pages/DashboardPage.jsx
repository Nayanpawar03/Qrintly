import { useEffect, useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import {
    Bell,
    ChevronDown,
    Clock,
    HelpCircle,
    Home,
    Layers,
    LogOut,
    Printer,
    Settings,
    Star,
  } from 'lucide-react';
  import { getJobs, getAnalytics, updateJobStatus } from '../api/jobs';
  import { getMyShop } from '../api/shops';

  function DashboardPage() {
    const [jobs, setJobs] = useState([]);
    const [analytics, setAnalytics] = useState(null);
    const [shopSettings, setShopSettings] = useState(null);
    const [autoDeleteHours, setAutoDeleteHours] = useState(1);
    const [statusFilter, setStatusFilter] = useState('all');
    const [searchQuery, setSearchQuery] = useState('');
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    const statusBadgeClasses = {
      success: 'bg-emerald-50 text-emerald-700',
      warning: 'bg-amber-50 text-amber-700',
      info: 'bg-indigo-50 text-indigo-700',
    };

    const fetchDashboardData = async() => {
      setLoading(true);
      setError('');
      try {
        const [jobRes, analyticsRes, shopRes] = await Promise.allSettled([
          getJobs(),
          getAnalytics(),
          getMyShop(),
        ]);
        if (jobRes.status === 'fulfilled') {
          setJobs(jobRes.value.data || []);
        } else {
          setJobs([]);
        }

        if (analyticsRes.status === 'fulfilled') {
          setAnalytics(analyticsRes.value.data || null);
        } else {
          setAnalytics({ todayJobs: 0, completed: 0, total: 0 });
        }

        if (shopRes.status === 'fulfilled') {
          const settings = shopRes.value.data?.settings || {};
          setShopSettings(settings);
          setAutoDeleteHours(settings.autoDeleteHours || 1);
        } else {
          setShopSettings(null);
        }

        const firstNon404Error = [jobRes, analyticsRes, shopRes].find(
          (result) =>
            result.status === 'rejected' &&
            result.reason?.response?.status !== 404
        );
        if (firstNon404Error) {
          setError(
            firstNon404Error.reason?.response?.data?.message ||
              'Failed to load dashboard data.'
          );
        }
      } catch(err) {
        setError(err.response?.data?.message || 'Failed to load dashboard data.');
      } finally {
        setLoading(false);
      }
    };

    useEffect(() => {
      fetchDashboardData();
    }, []);

    const statCards = useMemo(() => {
      const todayJobs = analytics?.todayJobs ?? 0;
      const completed = analytics?.completed ?? 0;
      const total = analytics?.total ?? 0;

      const pending = jobs.filter((job) => 
        ['uploaded', 'viewed', 'printing', 'ready'].includes(job.status)
      ).length;

      return [
        {
          label: "Today's Jobs",
          value: todayJobs,
          helper: '+12% from yesterday', // placeholder helper text
          helperVariant: 'success',
        },
        {
          label: 'Completed',
          value: completed,
          helper: '+8% from yesterday',
          helperVariant: 'success',
        },
        {
          label: 'Total Jobs',
          value: total,
          helper: 'This month',
          helperVariant: 'muted',
        },
        {
          label: 'Pending',
          value: pending,
          helper: 'Needs attention',
          helperVariant: 'warning',
        },
      ];
    }, [analytics, jobs]);

    const filteredJobs = useMemo(() => {
      const q = searchQuery.trim().toLowerCase();

      return jobs.filter((job) => {
        if(statusFilter !== 'all' && job.status !== statusFilter) return false;

        if(!q) return true;

        return (
          job.jobId.toLowerCase().includes(q) || 
          (job.customerName || '').toLowerCase().includes(q)
        );
      });
    }, [jobs, statusFilter, searchQuery]);

    const formatFiles = (files = []) => {
      const count = files.length || 0;
      if(count == 1) return '1 file';
      return `${count} files`;
    };

    const formatRelativeTime = (isoString) => {
      if (!isoString) return '--';
      const date = new Date(isoString);
      const diffMs = Date.now() - date.getTime();
      if (diffMs < 0) return 'Just now';
  
      const diffHours = Math.floor(diffMs / (1000 * 60 * 60));
      if (diffHours < 1) {
        const mins = Math.max(1, Math.floor(diffMs / (1000 * 60)));
        return `${mins} min${mins > 1 ? 's' : ''} ago`;
      }
      return `${diffHours} hour${diffHours > 1 ? 's' : ''} ago`;
    };

    const formatExpiresIn = (expiresAt) => {
      if(!expiresAt) return '--';
      const diffMs = new Date(expiresAt).getTime() - Date.now();
      const absMs = Math.abs(diffMs);
      const hours = Math.floor(absMs / (1000 * 60 * 60));
      const minutes = Math.floor((absMs % (1000 * 60 * 60)) / (1000 * 60));
      return `${hours}h ${minutes.toString().padStart(2, '0')}m`;
    };

    const getStatusVariant = (status) => {
      switch(status) {
        case 'ready':
        case 'collected':
          return 'success';
        case 'viewed':
        case 'printing':
          return 'warning';
        default:
          return 'info';
      }
    };

    const handlePrintClick = async(jobId) => {
      try {
        const res = await updateJobStatus(jobId, 'printing');
        const updated = res.data;
        setJobs((prev) => 
          prev.map((job) => (job.jobId === updated.jobId ? updated : job))
        );
      } catch (err) {
        console.error(err);
      }
    };

    const handleStatusFilterChange = (value) => {
      setStatusFilter(value);
    };

    const handleAutoDeleteChange = (value) => {
      setAutoDeleteHours(Number(value));
    };

    if (loading) {
      return (
        <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-950">
          <div className="w-6 h-6 border-2 border-gray-300 border-t-brand rounded-full animate-spin" />
        </div>
      );
    }
  
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-950 flex text-sm">
        {/* ========== SIDEBAR ========== */}
        <aside className="hidden lg:flex w-64 flex-col border-r border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900">
          {/* Logo */}
          <div className="px-6 py-5 flex items-center gap-3 border-b border-gray-100 dark:border-gray-800">
            <div className="w-9 h-9 rounded-2xl bg-brand text-white flex items-center justify-center shadow-sm">
              {/* Simple QR-like icon block */}
              <div className="w-5 h-5 rounded-md border border-white/60 flex items-center justify-center text-[10px] font-semibold">
                QR
              </div>
            </div>
            <span className="text-base font-semibold text-gray-900 dark:text-white">
              Qrintly
            </span>
          </div>
  
          {/* Main nav */}
          <nav className="flex-1 px-3 py-4 space-y-1">
            <button className="w-full flex items-center gap-3 px-3 py-2 rounded-xl bg-indigo-50 text-indigo-600 dark:bg-indigo-500/15 dark:text-indigo-300 font-medium">
              <Layers className="w-4 h-4" />
              <span>Dashboard</span>
            </button>
            <button className="w-full flex items-center gap-3 px-3 py-2 rounded-xl text-gray-600 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800">
              <Home className="w-4 h-4" />
              <span>Home</span>
            </button>
            <button className="w-full flex items-center gap-3 px-3 py-2 rounded-xl text-gray-600 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800">
              <Star className="w-4 h-4" />
              <span>My Plans</span>
            </button>
            <button className="w-full flex items-center gap-3 px-3 py-2 rounded-xl text-gray-600 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800">
              <Settings className="w-4 h-4" />
              <span>Settings</span>
            </button>
            <button className="w-full flex items-center gap-3 px-3 py-2 rounded-xl text-gray-600 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800">
              <HelpCircle className="w-4 h-4" />
              <span>Support</span>
            </button>
  
            {/* Sponsored card */}
            <div className="mt-6 rounded-2xl border border-dashed border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-900/40 px-4 py-3">
              <p className="text-[11px] font-semibold uppercase tracking-wide text-gray-400 mb-1">
                Sponsored
              </p>
              <p className="text-xs font-medium text-gray-800 dark:text-gray-100 mb-1">
                Premium Paper Available
              </p>
              <p className="text-[11px] text-gray-500 dark:text-gray-400">
                High-quality prints for your customers.
              </p>
            </div>
          </nav>
  
          {/* Logout */}
          <div className="border-t border-gray-100 dark:border-gray-800 px-4 py-4">
            <button className="w-full flex items-center gap-3 px-3 py-2 rounded-xl text-gray-600 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800">
              <LogOut className="w-4 h-4" />
              <span>Logout</span>
            </button>
          </div>
        </aside>
  
        {/* ========== MAIN AREA ========== */}
        <main className="flex-1 flex flex-col">
          {/* Top bar */}
          <header className="h-16 px-4 sm:px-8 flex items-center justify-between border-b border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900">
            <div className="flex items-center gap-3">
              <h1 className="text-lg sm:text-xl font-semibold text-gray-900 dark:text-white">
                Dashboard
              </h1>
              <Link
                to="/generate-qr"
                className="inline-flex items-center rounded-full bg-brand text-white px-3 py-1.5 text-xs font-medium hover:bg-brand/90"
              >
                Generate QR
              </Link>
            </div>
            <div className="flex items-center gap-4">
              <button className="relative text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200">
                <Bell className="w-5 h-5" />
                <span className="absolute -top-1 -right-1 w-2 h-2 rounded-full bg-rose-500" />
              </button>
              {/* Avatar – ADD ASSET */}
              {/* Put an avatar image at: public/avatar.png */}
              <img
                src="/avatar.jpg"
                alt="User avatar"
                className="w-8 h-8 rounded-full object-cover border border-white shadow-sm"
              />
            </div>
          </header>
  
          {/* Content scroll area */}
          <div className="flex-1 overflow-y-auto px-4 sm:px-8 py-6 space-y-6">
            {error && (
              <div className="rounded-xl border border-rose-200 bg-rose-50 px-4 py-3 text-sm text-rose-700">
                {error}
              </div>
            )}
            {/* Stat cards */}
            <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              {statCards.map((card) => (
                <div
                  key={card.label}
                  className="rounded-2xl bg-white dark:bg-gray-900 border border-gray-100 dark:border-gray-800 px-5 py-4"
                >
                  <p className="text-xs text-gray-500 dark:text-gray-400 mb-1">
                    {card.label}
                  </p>
                  <p className="text-2xl font-semibold text-gray-900 dark:text-white">
                    {card.value}
                  </p>
                  <p
                    className={
                      'mt-1 text-xs ' +
                      (card.helperVariant === 'success'
                        ? 'text-emerald-600'
                        : card.helperVariant === 'warning'
                        ? 'text-amber-600'
                        : 'text-gray-500 dark:text-gray-400')
                    }
                  >
                    {card.helper}
                  </p>
                </div>
              ))}
            </section>
  
            {/* Upgrade banner */}
            <section className="rounded-2xl bg-indigo-50 border border-indigo-100 px-5 py-4 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
              <div>
                <p className="text-xs font-semibold uppercase tracking-wide text-indigo-500 mb-1">
                  Sponsored
                </p>
                <p className="text-sm font-medium text-gray-900 mb-1">
                  Upgrade to Pro – Get unlimited storage
                </p>
                <p className="text-xs text-gray-600">
                  30-day free trial available for new teams.
                </p>
              </div>
              <button className="inline-flex items-center justify-center px-4 py-2 rounded-full bg-indigo-600 text-xs font-medium text-white hover:bg-indigo-700">
                Learn More
              </button>
            </section>
  
            {/* Jobs controls + table */}
            <section className="rounded-2xl bg-white dark:bg-gray-900 border border-gray-100 dark:border-gray-800">
              {/* Controls row */}
              <div className="px-5 pt-4 pb-3 flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between border-b border-gray-100 dark:border-gray-800">
              <div className="flex flex-wrap items-center gap-3">
                <span className="text-xs text-gray-500">Auto Delete After:</span>
                <div className="relative">
                  <select
                    value={autoDeleteHours}
                    onChange={(e) => handleAutoDeleteChange(e.target.value)}
                    className="appearance-none inline-flex items-center rounded-full border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 px-3 py-1.5 text-xs text-gray-700 dark:text-gray-200 pr-7 focus:outline-none focus:ring-2 focus:ring-indigo-100 focus:border-indigo-400"
                  >
                    <option value={0.1667}>10 mins</option>
                    <option value={0.5}>30 mins</option>
                    <option value={0.75}>45 mins</option>
                    <option value={1}>1 hour</option>
                  </select>
                  <ChevronDown className="pointer-events-none absolute right-2 top-1/2 -translate-y-1/2 w-3 h-3 text-gray-400" />
                </div>

                <button className="inline-flex items-center rounded-full bg-rose-50 text-rose-600 px-3 py-1.5 text-xs font-medium border border-rose-100 hover:bg-rose-100">
                  Clear All Completed
                </button>
              </div>

              <div className="flex flex-wrap items-center gap-3">
                <div className="relative">
                  <select
                    value={statusFilter}
                    onChange={(e) => handleStatusFilterChange(e.target.value)}
                    className="appearance-none inline-flex items-center rounded-full border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 px-3 py-1.5 text-xs text-gray-700 dark:text-gray-200 pr-7 focus:outline-none focus:ring-2 focus:ring-indigo-100 focus:border-indigo-400"
                  >
                    <option value="all">All Status</option>
                    <option value="uploaded">Uploaded</option>
                    <option value="viewed">Viewed</option>
                    <option value="printing">Printing</option>
                    <option value="ready">Ready</option>
                    <option value="collected">Collected</option>
                    <option value="expired">Expired</option>
                  </select>
                  <ChevronDown className="pointer-events-none absolute right-2 top-1/2 -translate-y-1/2 w-3 h-3 text-gray-400" />
                </div>

                <div className="relative">
                  <input
                    type="text"
                    placeholder="Search Job ID or Customer..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-56 lg:w-64 rounded-full border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-900/60 px-3 py-1.5 text-xs text-gray-700 dark:text-gray-200 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-100 focus:border-indigo-400"
                  />
                  <span className="pointer-events-none absolute inset-y-0 right-3 flex items-center text-gray-400">
                    <Clock className="w-3.5 h-3.5" />
                  </span>
                </div>
              </div>
            </div>
  
              {/* Table */}
              <div className="overflow-x-auto">
                <table className="min-w-full text-xs">
                  <thead>
                    <tr className="border-b border-gray-100 dark:border-gray-800 text-gray-400 dark:text-gray-500">
                      <th className="px-5 py-3 text-left font-medium">Job ID</th>
                      <th className="px-4 py-3 text-left font-medium">Customer</th>
                      <th className="px-4 py-3 text-left font-medium">Files</th>
                      <th className="px-4 py-3 text-left font-medium">Preferences</th>
                      <th className="px-4 py-3 text-left font-medium">Status</th>
                      <th className="px-4 py-3 text-left font-medium">Created</th>
                      <th className="px-4 py-3 text-left font-medium">Expires In</th>
                      <th className="px-4 py-3 text-center font-medium">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-100 dark:divide-gray-800">
                  {filteredJobs.map((job) => {
                    const overdue = new Date(job.expiresAt) < new Date();
                    const statusVariant = statusBadgeClasses[getStatusVariant(job.status)];

                    return (
                      <tr
                        key={job._id || job.jobId}
                        className="hover:bg-gray-50/60 dark:hover:bg-gray-800/40"
                      >
                        <td className="px-5 py-3 whitespace-nowrap font-medium text-gray-900 dark:text-gray-100">
                          {job.jobId}
                        </td>
                        <td className="px-4 py-3 whitespace-nowrap text-gray-700 dark:text-gray-200">
                          {job.customerName}
                        </td>
                        <td className="px-4 py-3 whitespace-nowrap text-gray-600 dark:text-gray-300">
                          {formatFiles(job.files)}
                        </td>
                        <td className="px-4 py-3 whitespace-nowrap text-gray-600 dark:text-gray-300">
                          <span className="inline-flex items-center gap-2">
                            <span className="rounded-full bg-gray-100 dark:bg-gray-800 px-2 py-0.5 text-[11px]">
                              {job.preferences?.pageSize?.toUpperCase()}
                            </span>
                            <span className="rounded-full bg-gray-100 dark:bg-gray-800 px-2 py-0.5 text-[11px] capitalize">
                              {job.preferences?.sided}
                            </span>
                          </span>
                        </td>
                        <td className="px-4 py-3 whitespace-nowrap">
                          <span
                            className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-[11px] font-medium ${statusVariant}`}
                          >
                            {job.status.charAt(0).toUpperCase() + job.status.slice(1)}
                          </span>
                        </td>
                        <td className="px-4 py-3 whitespace-nowrap text-gray-600 dark:text-gray-300">
                          {formatRelativeTime(job.createdAt)}
                        </td>
                        <td
                          className={`px-4 py-3 whitespace-nowrap ${
                            overdue ? 'text-rose-500 font-medium' : 'text-gray-600 dark:text-gray-300'
                          }`}
                        >
                          {formatExpiresIn(job.expiresAt)}
                        </td>
                        <td className="px-4 py-3 whitespace-nowrap text-center">
                          <button
                            onClick={() => handlePrintClick(job.jobId)}
                            className="inline-flex items-center gap-1.5 rounded-full bg-emerald-500 text-white px-4 py-1.5 text-[11px] font-medium hover:bg-emerald-600 mx-auto"
                          >
                            <Printer className="w-3.5 h-3.5" />
                            Print
                          </button>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
                </table>
              </div>
            </section>
          </div>
        </main>
      </div>
    );
  }
  
  export default DashboardPage;