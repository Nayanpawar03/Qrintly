import { useState } from 'react';
import { Eye, EyeOff } from 'lucide-react';

function Input({
    label,
    hint,
    error,
    className = '',
    showPasswordToggle = false,
    type = 'text',
    ...rest
}) {
    const [isPasswordVisible, setIsPasswordVisible] = useState(false);

    const isPasswordField = showPasswordToggle && type === 'password';
    const inputType = isPasswordField && isPasswordVisible ? 'text' : type;

    return (
        <div>
            {label && (
                <label className="block mb-1.5 text-sm font-medium text-gray-700 dark:text-gray-200">
                    {label}
                </label>
            )}
            <div className="relative">
                <input
                    className={`w-full px-4 py-3 rounded-input text-sm
                    bg-white dark:bg-gray-800
                    border border-gray-300 dark:border-gray-600
                    text-gray-900 dark:text-gray-100
                    placeholder:text-gray-400 dark:placeholder:text-gray-500
                    focus:outline-none focus:ring-2 focus:ring-brand/30 focus:border-brand
                    transition-all duration-200
                    disabled:opacity-50 disabled:cursor-not-allowed
                    ${error ? 'border-danger focus:ring-danger/30 focus:border-danger' : ''}
                    ${isPasswordField ? 'pr-11' : ''}
                    ${className}`}
                    type={inputType}
                    {...rest}
                />
                {isPasswordField && (
                    <button
                        type="button"
                        onClick={() => setIsPasswordVisible((prev) => !prev)}
                        className="absolute inset-y-0 right-3 flex items-center text-gray-400 hover:text-gray-700 dark:text-gray-500 dark:hover:text-gray-200"
                        aria-label={isPasswordVisible ? 'Hide password' : 'Show password'}
                    >
                        {isPasswordVisible ? (
                            <EyeOff className="w-4 h-4" />
                        ) : (
                            <Eye className="w-4 h-4" />
                        )}
                    </button>
                )}
            </div>
            {hint && !error && (
                <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">{hint}</p>
            )}
            {error && (
                <p className="mt-1 text-xs text-danger">{error}</p>
            )}
        </div>
    );
}

export default Input;