"use client";

import React from "react";

interface BadgeProps extends React.HTMLAttributes<HTMLSpanElement> {
  variant?: "success" | "danger" | "warning" | "info";
  children: React.ReactNode;
}

/**
 * Badge component
 * Small label for displaying status or categories
 */
export function Badge({ variant = "info", children, ...props }: BadgeProps) {
  const variantClasses = {
    success: "badge-success",
    danger: "badge-danger",
    warning: "badge-warning",
    info: "badge-info",
  };

  return (
    <span {...props} className={`badge ${variantClasses[variant]} ${props.className || ""}`}>
      {children}
    </span>
  );
}

export default Badge;
