"use client";

import React from "react";

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  helperText?: string;
}

/**
 * Input component
 * Form input with label and error state
 */
export function Input({
  label,
  error,
  helperText,
  id,
  ...props
}: InputProps) {
  const inputId = id || `input-${Math.random()}`;

  return (
    <div className="w-full">
      {label && (
        <label htmlFor={inputId} className="block text-sm font-medium mb-2">
          {label}
        </label>
      )}
      <input
        {...props}
        id={inputId}
        className={`input ${error ? "border-red-500 focus:border-red-500" : ""} ${props.className || ""}`}
      />
      {error && <p className="mt-1 text-sm text-red-500">{error}</p>}
      {helperText && <p className="mt-1 text-sm text-slate-400">{helperText}</p>}
    </div>
  );
}

export default Input;
