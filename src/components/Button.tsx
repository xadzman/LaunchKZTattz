import { ButtonHTMLAttributes, ReactNode } from 'react';

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary';
  children: ReactNode;
  href?: string;
}

export default function Button({
  variant = 'primary',
  children,
  href,
  className = '',
  ...props
}: ButtonProps) {
  const baseClasses = variant === 'primary' ? 'btn-primary' : 'btn-secondary';

  if (href) {
    return (
      <a
        href={href}
        className={`${baseClasses} inline-block text-center ${className}`}
      >
        {children}
      </a>
    );
  }

  return (
    <button className={`${baseClasses} ${className}`} {...props}>
      {children}
    </button>
  );
}
