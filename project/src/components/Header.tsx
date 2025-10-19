import { useState } from 'react';
import { Menu, X } from 'lucide-react';
import Button from './Button';

export default function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const navLinks = [
    { label: 'Home', href: '#hero' },
    { label: 'Portfolio', href: '#portfolio' },
    { label: 'Book Now', href: '#booking' },
    { label: 'Socials', href: '#socials' },
    { label: 'Mailing List', href: '#subscribe' },
    { label: 'About', href: '#about' },
  ];

  const handleNavClick = () => {
    setIsMenuOpen(false);
  };

  return (
    <header className="sticky top-0 z-50 bg-onyx/95 backdrop-blur-sm border-b border-divider">
      <nav className="section-container">
        <div className="flex items-center justify-between h-20">
          <a
            href="#hero"
            className="text-2xl font-heading font-bold tracking-tight-brand"
          >
            KZ Tattz
          </a>

          <div className="hidden lg:flex items-center gap-8">
            {navLinks.map((link) => (
              <a
                key={link.href}
                href={link.href}
                className="text-sm uppercase tracking-wide text-text-muted hover:text-white transition-colors duration-brand"
              >
                {link.label}
              </a>
            ))}
            <Button variant="primary" href="#booking" className="ml-4">
              Book a Session
            </Button>
          </div>

          <button
            className="lg:hidden p-2 text-white"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            aria-label="Toggle menu"
          >
            {isMenuOpen ? <X size={28} /> : <Menu size={28} />}
          </button>
        </div>
      </nav>

      {isMenuOpen && (
        <div className="lg:hidden bg-surface border-t border-divider">
          <div className="section-container py-6 flex flex-col gap-4">
            {navLinks.map((link) => (
              <a
                key={link.href}
                href={link.href}
                onClick={handleNavClick}
                className="text-lg uppercase tracking-wide text-text-muted hover:text-white transition-colors duration-brand py-2"
              >
                {link.label}
              </a>
            ))}
            <Button
              variant="primary"
              href="#booking"
              className="mt-4"
              onClick={handleNavClick}
            >
              Book a Session
            </Button>
          </div>
        </div>
      )}
    </header>
  );
}
