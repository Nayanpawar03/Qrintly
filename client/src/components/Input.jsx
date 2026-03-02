function Input({ label, hint, error, className = '', ...props }) {
    return (
        <div>
            {label && (
                <label>
                    {label}
                </label>
            )}
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
                ${className}`}
                {...props}
            />
            {hint && !error && (
                <p className="text-xs text-gray-500 dark:text-gray-400">{hint}</p>
            )}
            {error && (
                <p className="text-xs text-danger">{error}</p>
            )}
        </div>
    );
}

export default Input;