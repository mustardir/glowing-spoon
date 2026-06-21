"use client";

import React from "react";

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "primary" | "secondary" | "danger";
  size?: "sm" | "md" | "lg";
  isLoading?: boolean;
  children: React.ReactNode;
}

/**
 * Button component
 * Reusable button with multiple variants and sizes
 */
export function Button({
  variant = "primary",
  size = "md",
  isLoading,
  disabled,
  children,
  ...props
}: ButtonProps) {
  const baseClasses = "inline-flex items-center justify-center px-4 py-2 rounded-lg font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed";

  const variantClasses = {
    primary: "bg-emerald-500 text-white hover:bg-emerald-600",
    secondary: "bg-slate-700 text-slate-100 hover:bg-slate-600",
    danger: "bg-red-500 text-white hover:bg-red-600",
  };

  const sizeClasses = {
    sm: "px-3 py-1 text-sm",
    md: "px-4 py-2 text-base",
    lg: "px-6 py-3 text-lg",
  };

  return (
    <button
      {...props}
      disabled={disabled || isLoading}
      className={`${baseClasses} ${variantClasses[variant]} ${sizeClasses[size]} ${props.className || ""}`}
    >
      {isLoading ? "Loading..." : children}
    </button>
  );
}

export default Button;
