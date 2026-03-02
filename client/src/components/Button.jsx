const variants = {
    primary:
        'bg-accent-hover text-white hover:bg-accent active:scale-[0.98] shadow-sm',
    outline:
        'border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-200 hover:bg-gray-50 dark:hover:bg-gray-700',
};

function Button({ children, variant = 'primary', isLoading = false, className = '', ...props }) {
    return (
        <button
            className={`w-full py-3 px-4 rounded-button font-medium text-sm
                transition-all duration-200 cursor-pointer
                disabled:opacity-50 disabled:cursor-not-allowed
                flex items-center justify-center gap-2
                ${variants[variant]} ${className}`}
            disabled={isLoading || props.disabled}
            {...props}
        >
            {isLoading ? (
                <span className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
            ) : (
                children
            )}
        </button>
    );
}

export default Button;