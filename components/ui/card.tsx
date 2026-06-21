"use client";

import React from "react";

interface CardProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode;
  header?: React.ReactNode;
  footer?: React.ReactNode;
}

/**
 * Card component
 * Container for content with consistent styling
 */
export function Card({ header, footer, children, ...props }: CardProps) {
  return (
    <div {...props} className={`card ${props.className || ""}`}>
      {header && <div className="card-header">{header}</div>}
      <div>{children}</div>
      {footer && <div className="border-t border-slate-800 pt-4 mt-4">{footer}</div>}
    </div>
  );
}

export default Card;
