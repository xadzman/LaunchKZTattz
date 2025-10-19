import { Instagram, Facebook } from 'lucide-react';

export default function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-surface border-t border-divider py-12">
      <div className="section-container">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-8">
          <div>
            <h3 className="text-xl font-heading font-bold mb-4">KZ Tattz</h3>
            <p className="text-text-muted text-sm leading-relaxed">
              Black & grey realism specialist bringing your vision to life with
              precision and artistry.
            </p>
          </div>

          <div>
            <h4 className="font-semibold mb-4">Studio</h4>
            <address className="text-text-muted text-sm not-italic leading-relaxed">
              Beyond Ink Studio<br />
              149 Cutler Heights Lane<br />
              BD4 9JB<br />
              West Yorkshire
            </address>
          </div>

          <div>
            <h4 className="font-semibold mb-4">Quick Links</h4>
            <ul className="space-y-2 text-sm">
              <li>
                <a
                  href="#portfolio"
                  className="text-text-muted hover:text-accent transition-colors duration-brand"
                >
                  Portfolio
                </a>
              </li>
              <li>
                <a
                  href="#booking"
                  className="text-text-muted hover:text-accent transition-colors duration-brand"
                >
                  Book Now
                </a>
              </li>
              <li>
                <a
                  href="#about"
                  className="text-text-muted hover:text-accent transition-colors duration-brand"
                >
                  About
                </a>
              </li>
              <li>
                <a
                  href="#contact"
                  className="text-text-muted hover:text-accent transition-colors duration-brand"
                >
                  Contact
                </a>
              </li>
            </ul>
          </div>

          <div>
            <h4 className="font-semibold mb-4">Connect</h4>
            <div className="flex gap-4 mb-4">
              <a
                href="https://www.instagram.com/k.z_tatt/"
                target="_blank"
                rel="noopener noreferrer"
                className="text-text-muted hover:text-accent transition-colors duration-brand"
                aria-label="Instagram"
              >
                <Instagram size={24} />
              </a>
              <a
                href="https://www.facebook.com/people/kz_tattoos"
                target="_blank"
                rel="noopener noreferrer"
                className="text-text-muted hover:text-accent transition-colors duration-brand"
                aria-label="Facebook"
              >
                <Facebook size={24} />
              </a>
              <a
                href="https://linktr.ee/shedink"
                target="_blank"
                rel="noopener noreferrer"
                className="text-text-muted hover:text-accent transition-colors duration-brand"
                aria-label="LinkTree"
              >
                <svg
                  viewBox="0 0 24 24"
                  fill="currentColor"
                  className="w-6 h-6"
                >
                  <path d="M7.953 15.066c-.08.163-.08.324-.08.486.08.517.528.897 1.052.89h1.294v4.776c0 .486-.404.89-.89.89H6.577a.898.898 0 0 1-.889-.891v-4.774H.992c-.728 0-1.214-.729-.89-1.377l6.96-12.627a1.065 1.065 0 0 1 1.863 0l2.913 5.585-3.885 7.042zm15.945 0-6.96-12.627a1.065 1.065 0 0 0-1.862 0l-2.995 5.586 3.885 7.04c.081.164.081.326.081.487-.08.517-.529.897-1.052.89h-1.296v4.776c.005.49.4.887.89.89h2.914a.9.9 0 0 0 .892-.89v-4.775h4.612c.73 0 1.214-.729.89-1.377z" />
                </svg>
              </a>
            </div>
            <a
              href="#subscribe"
              className="text-sm text-text-muted hover:text-accent transition-colors duration-brand"
            >
              Join Mailing List
            </a>
          </div>
        </div>

        <div className="border-t border-divider pt-8 flex flex-col md:flex-row justify-between items-center gap-4 text-sm text-text-muted">
          <p>© {currentYear} KZ Tattz — All Rights Reserved</p>
          <p className="text-xs">Site by Relapse Ink Digital</p>
        </div>
      </div>
    </footer>
  );
}
