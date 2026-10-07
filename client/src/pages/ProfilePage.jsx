import { useEffect, useRef, useState } from 'react';
import { Camera, Lock, Mail, Save, User, Clock } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import { getMyShop } from '../api/shops';
import { uploadAvatar, getMe } from '../api/auth';
import API from '../api/axios';

function ProfilePage() {
  const { user, logout, setUserFromToken } = useAuth();
  const navigate = useNavigate();
  const fileInputRef = useRef(null);
  const [avatarPreview, setAvatarPreview] = useState(user?.avatar || null);
  const [uploadingAvatar, setUploadingAvatar] = useState(false);
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

  // Fetch fresh user data to get latest avatar
  useEffect(() => {
    getMe().then((res) => {
      const freshUser = { ...res.data, token: user?.token };
      localStorage.setItem('user', JSON.stringify(freshUser));
      setUserFromToken(freshUser);
      setAvatarPreview(res.data.avatar || null);
      setForm((prev) => ({
        ...prev,
        name: res.data.name || '',
        email: res.data.email || '',
        phone: res.data.phone || '',
      }));
    }).catch(() => { });
  }, []);

  const handleProfileChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleAvatarChange = async (e) => {
    const file = e.target.files[0];
    if (!file) return;
    setAvatarPreview(URL.createObjectURL(file));
    setUploadingAvatar(true);
    try {
      const formData = new FormData();
      formData.append('avatar', file);
      const res = await uploadAvatar(formData);
      const updatedUser = { ...user, avatar: res.data.avatar };
      localStorage.setItem('user', JSON.stringify(updatedUser));
      setUserFromToken(updatedUser);
      setMessage('Profile picture updated.');
    } catch (err) {
      setError('Failed to upload avatar.');
    } finally {
      setUploadingAvatar(false);
    }
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
          <div className="flex items-center gap-3">
            <button
              onClick={() => navigate(-1)}
              className="w-8 h-8 rounded-full border border-gray-200 dark:border-gray-700 flex items-center justify-center text-gray-500 hover:bg-gray-100 dark:hover:bg-gray-800"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
            </button>
            <div>
              <h1 className="text-xl sm:text-2xl font-semibold text-gray-900 dark:text-white">
                Profile
              </h1>
              <p className="text-sm text-gray-500 dark:text-gray-400">
                Manage your account information and shop preferences.
              </p>
            </div>
          </div>
        </header>

        {(message || error) && (
          <div
            className={`mb-5 rounded-lg px-4 py-3 text-sm ${error
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
              {/* Avatar */}
              <div className="flex items-center gap-4 pb-2">
                <div className="relative">
                  <div className="w-16 h-16 rounded-full bg-gray-100 dark:bg-gray-700 overflow-hidden">
                    {avatarPreview ? (
                      <img src={avatarPreview} alt="Avatar" className="w-full h-full object-cover" />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-gray-400">
                        <User className="w-7 h-7" />
                      </div>
                    )}
                  </div>
                  <button
                    type="button"
                    onClick={() => fileInputRef.current?.click()}
                    className="absolute -bottom-1 -right-1 w-6 h-6 rounded-full bg-brand text-white flex items-center justify-center shadow"
                  >
                    <Camera className="w-3 h-3" />
                  </button>
                  <input
                    ref={fileInputRef}
                    type="file"
                    accept="image/*"
                    onChange={handleAvatarChange}
                    className="hidden"
                  />
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-900 dark:text-white">{user?.name}</p>
                  <p className="text-xs text-gray-400 dark:text-gray-500">{uploadingAvatar ? 'Uploading...' : 'Click camera to change photo'}</p>
                </div>
              </div>
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
                  onClick={() => { logout(); navigate('/login'); }}
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