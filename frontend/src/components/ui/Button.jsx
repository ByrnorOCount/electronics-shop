import React from 'react';

export default function Button({
    children,
    variant = 'primary',
    size = 'md',
    className = '',
    disabled = false,
    type = 'button',
    ...rest
}) {
    const variants = {
        primary: 'bg-blue-600 text-white hover:bg-blue-700',
        secondary: 'bg-gray-100 text-gray-800 hover:bg-gray-200',
        ghost: 'bg-transparent text-blue-600 hover:bg-blue-50',
    };

    const sizes = {
        sm: 'px-3 py-1.5 text-sm',
        md: 'px-4 py-2 text-sm',
        lg: 'px-6 py-3 text-base',
    };

    return (
        <button
            type={type}
            disabled={disabled}
            className={`inline-flex items-center justify-center rounded-md font-medium shadow-sm transition ${variants[variant] || variants.primary} ${sizes[size] || sizes.md} ${disabled ? 'opacity-60 cursor-not-allowed' : ''} ${className}`}
            {...rest}
        >
            {children}
        </button>
    );
}
