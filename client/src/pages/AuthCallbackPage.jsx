import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { getMe } from '../api/auth';

function AuthCallbackPage() {
    const navigate = useNavigate();
    const { setUserFromToken } = useAuth();
    const [error, setError] = useState('');

    useEffect(() => {
        const params = new URLSearchParams(window.location.search);
        const token = params.get('token');

        if (!token) {
            setError('No token received. Please try logging in again.');
            return;
        }

        // Store token first so the axios interceptor can attach it
        localStorage.setItem('token', token);

        // Fetch user details using the token
        getMe()
            .then((res) => {
                const user = { ...res.data, token };
                localStorage.setItem('user', JSON.stringify(user));
                setUserFromToken(user);
                navigate('/dashboard', { replace: true });
            })
            .catch(() => {
                localStorage.removeItem('token');
                setError('Authentication failed. Please try logging in again.');
            });
    }, []);

    if (error) {
        return (
            <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50 dark:bg-gray-950 gap-4">
                <p className="text-sm text-danger">{error}</p>
                <a href="/login" className="text-sm text-brand font-medium hover:underline">
                    Back to Login
                </a>
            </div>
        );
    }

    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-950">
            <div className="w-6 h-6 border-2 border-gray-300 border-t-brand rounded-full animate-spin" />
        </div>
    );
}

export default AuthCallbackPage;
