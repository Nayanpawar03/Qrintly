import { useEffect, useState } from 'react';
import { Lock, Mail, Save, User, Clock } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { getMyShop } from '../api/shops';
import API from '../api/axios';

function ProfilePage() {
  const { user, logout } = useAuth();
  const [form, setForm] = useState({
    name: user?.name || '',
    email: user?.email || '',
    phone: user?.phone || '',
  });
  const [shopSettings, setShopSettings] = useState(null);
  const [autoDeleteHours, setAutoDeleteHours] = useState(24);

  const [passwordForm, setPasswordForm] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: '',
  });

  const [savingProfile, setSavingProfile] = useState(false);
  const [savingPassword, setSavingPassword] = useState(false);
  const [savingShop, setSavingShop] = useState(false);
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');

  useEffect(() => {
    const loadShop = async () => {
      try {
        const res = await getMyShop();
        const settings = res.data?.settings || {};
        setShopSettings(res.data);
        setAutoDeleteHours(settings.autoDeleteHours || 24);
      } catch (err) {
        // shop is optional; ignore 404 here
      }
    };
    loadShop();
  }, []);

  const handleProfileChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handlePasswordChange = (e) => {
    const { name, value } = e.target;
    setPasswordForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSaveProfile = async (e) => {
    e.preventDefault();
    setError('');
    setMessage('');
    setSavingProfile(true);
    try {
      await API.patch('/auth/profile', { name: form.name, phone: form.phone });
      setMessage('Profile updated successfully.');
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to update profile.');
    } finally {
      setSavingProfile(false);
    }
  };

  const handleSavePassword = async (e) => {
    e.preventDefault();
    setError('');
    setMessage('');

    if (passwordForm.newPassword !== passwordForm.confirmPassword) {
      setError('New password and confirm password do not match.');
      return;
    }

    setSavingPassword(true);
    try {
      await API.patch('/auth/password', {
        currentPassword: passwordForm.currentPassword,
        newPassword: passwordForm.newPassword,
      });
      setMessage('Password updated successfully.');
      setPasswordForm({
        currentPassword: '',
        newPassword: '',
        confirmPassword: '',
      });
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to update password.');
    } finally {
      setSavingPassword(false);
    }
  };

  const handleSaveShopSettings = async (e) => {
    e.preventDefault();
    if (!shopSettings) return;
    setError('');
    setMessage('');
    setSavingShop(true);
    try {
      await API.patch('/shops/settings', {
        autoDeleteHours: Number(autoDeleteHours),
      });
      setMessage('Shop preferences updated.');
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to update shop settings.');
    } finally {
      setSavingShop(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-950 flex">
      <main className="flex-1 px-4 sm:px-8 py-8 max-w-5xl mx-auto">
        <header className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-xl sm:text-2xl font-semibold text-gray-900 dark:text-white">
              Profile
            </h1>
            <p className="text-sm text-gray-500 dark:text-gray-400">
              Manage your account information and shop preferences.
            </p>
          </div>
        </header>

        {(message || error) && (
          <div
            className={`mb-5 rounded-lg px-4 py-3 text-sm ${
              error
                ? 'bg-rose-50 text-rose-700 border border-rose-100'
                : 'bg-emerald-50 text-emerald-700 border border-emerald-100'
            }`}
          >
            {error || message}
          </div>
        )}

        <div className="grid gap-6 lg:grid-cols-3">
          {/* Account info */}
          <section className="lg:col-span-2 rounded-2xl bg-white dark:bg-gray-900 border border-gray-100 dark:border-gray-800 p-6">
            <h2 className="text-sm font-semibold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
              <User className="w-4 h-4" />
              Account
            </h2>

            <form onSubmit={handleSaveProfile} className="space-y-4">
              <div>
                <label className="block text-xs font-medium text-gray-500 mb-1">
                  Full Name
                </label>
                <input
                  type="text"
                  name="name"
                  value={form.name}
                  onChange={handleProfileChange}
                  className="w-full rounded-input border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 px-3 py-2 text-sm text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-brand/20 focus:border-brand"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-gray-500 mb-1">
                  Phone Number
                </label>
                <input
                  type="tel"
                  name="phone"
                  value={form.phone}
                  onChange={handleProfileChange}
                  className="w-full rounded-input border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 px-3 py-2 text-sm text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-brand/20 focus:border-brand"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-gray-500 mb-1">
                  Email
                </label>
                <div className="flex items-center gap-2 rounded-input border border-gray-100 dark:border-gray-700 bg-gray-50/80 dark:bg-gray-900/60 px-3 py-2 text-sm text-gray-600 dark:text-gray-300">
                  <Mail className="w-4 h-4 text-gray-400" />
                  <span>{form.email}</span>
                </div>
              </div>

              <div className="pt-2 flex items-center justify-between">
                <button
                  type="submit"
                  disabled={savingProfile}
                  className="inline-flex items-center gap-2 rounded-full bg-brand text-white px-4 py-2 text-xs font-medium hover:bg-brand/90 disabled:opacity-60"
                >
                  <Save className="w-3.5 h-3.5" />
                  Save changes
                </button>
                <button
                  type="button"
                  onClick={logout}
                  className="text-xs text-rose-500 hover:underline"
                >
                  Logout
                </button>
              </div>
            </form>
          </section>

          {/* Password & shop */}
          <div className="space-y-6">
            <section className="rounded-2xl bg-white dark:bg-gray-900 border border-gray-100 dark:border-gray-800 p-6">
              <h2 className="text-sm font-semibold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
                <Lock className="w-4 h-4" />
                Security
              </h2>

              <form onSubmit={handleSavePassword} className="space-y-3">
                <div>
                  <label className="block text-xs font-medium text-gray-500 mb-1">
                    Current password
                  </label>
                  <input
                    type="password"
                    name="currentPassword"
                    value={passwordForm.currentPassword}
                    onChange={handlePasswordChange}
                    className="w-full rounded-input border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 px-3 py-2 text-sm text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-brand/20 focus:border-brand"
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-gray-500 mb-1">
                    New password
                  </label>
                  <input
                    type="password"
                    name="newPassword"
                    value={passwordForm.newPassword}
                    onChange={handlePasswordChange}
                    className="w-full rounded-input border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 px-3 py-2 text-sm text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-brand/20 focus:border-brand"
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-gray-500 mb-1">
                    Confirm new password
                  </label>
                  <input
                    type="password"
                    name="confirmPassword"
                    value={passwordForm.confirmPassword}
                    onChange={handlePasswordChange}
                    className="w-full rounded-input border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 px-3 py-2 text-sm text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-brand/20 focus:border-brand"
                  />
                </div>

                <button
                  type="submit"
                  disabled={savingPassword}
                  className="mt-2 inline-flex items-center gap-2 rounded-full bg-gray-900 text-white px-4 py-2 text-xs font-medium hover:bg-gray-800 disabled:opacity-60"
                >
                  <Save className="w-3.5 h-3.5" />
                  Update password
                </button>
              </form>
            </section>

            <section className="rounded-2xl bg-white dark:bg-gray-900 border border-gray-100 dark:border-gray-800 p-6">
              <h2 className="text-sm font-semibold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
                <Clock className="w-4 h-4" />
                Job auto‑deletion
              </h2>

              {shopSettings ? (
                <form onSubmit={handleSaveShopSettings} className="space-y-3">
                  <p className="text-xs text-gray-500 dark:text-gray-400">
                    Control how long uploaded files are kept before being
                    automatically deleted from storage.
                  </p>
                  <select
                    value={autoDeleteHours}
                    onChange={(e) => setAutoDeleteHours(e.target.value)}
                    className="mt-2 w-full rounded-input border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 px-3 py-2 text-sm text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-brand/20 focus:border-brand"
                  >
                    <option value={0.1667}>10 mins</option>
                    <option value={0.5}>30 mins</option>
                    <option value={0.75}>45 mins</option>
                    <option value={1}>1 hour</option>
                    <option value={24}>24 hours</option>
                  </select>

                  <button
                    type="submit"
                    disabled={savingShop}
                    className="mt-3 inline-flex items-center gap-2 rounded-full bg-brand text-white px-4 py-2 text-xs font-medium hover:bg-brand/90 disabled:opacity-60"
                  >
                    <Save className="w-3.5 h-3.5" />
                    Save preference
                  </button>
                </form>
              ) : (
                <p className="text-xs text-gray-500 dark:text-gray-400">
                  Create a shop first to configure auto‑delete settings.
                </p>
              )}
            </section>
          </div>
        </div>
      </main>
    </div>
  );
}

export default ProfilePage;