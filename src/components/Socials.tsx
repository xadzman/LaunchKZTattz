import { Instagram, Facebook, Youtube } from 'lucide-react';
import Section from './Section';

const socialLinks = [
  {
    name: 'Instagram',
    url: 'https://www.instagram.com/k.z_tatt/',
    icon: Instagram,
    color: 'hover:text-pink-500',
  },
  {
    name: 'Facebook',
    url: 'https://www.facebook.com/share/19jjGcgGCH/?mibextid=wwXIfr',
    icon: Facebook,
    color: 'hover:text-blue-500',
  },
  {
    name: 'TikTok',
    url: 'https://www.tiktok.com/@k.z_tattz',
    icon: () => (
      <svg
        viewBox="0 0 24 24"
        fill="currentColor"
        className="w-12 h-12"
      >
        <path d="M19.59 6.69a4.83 4.83 0 01-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 01-5.2 1.74 2.89 2.89 0 012.31-4.64 2.93 2.93 0 01.88.13V9.4a6.84 6.84 0 00-1-.05A6.33 6.33 0 005 20.1a6.34 6.34 0 0010.86-4.43v-7a8.16 8.16 0 004.77 1.52v-3.4a4.85 4.85 0 01-1-.1z" />
      </svg>
    ),
    color: 'hover:text-cyan-400',
  },
  {
    name: 'YouTube',
    url: '#',
    icon: Youtube,
    color: 'hover:text-red-500',
  },
  {
    name: 'LinkTree',
    url: 'https://linktr.ee/shedink',
    icon: () => (
      <svg
        viewBox="0 0 24 24"
        fill="currentColor"
        className="w-12 h-12"
      >
        <path d="M7.953 15.066c-.08.163-.08.324-.08.486.08.517.528.897 1.052.89h1.294v4.776c0 .486-.404.89-.89.89H6.577a.898.898 0 0 1-.889-.891v-4.774H.992c-.728 0-1.214-.729-.89-1.377l6.96-12.627a1.065 1.065 0 0 1 1.863 0l2.913 5.585-3.885 7.042zm15.945 0-6.96-12.627a1.065 1.065 0 0 0-1.862 0l-2.995 5.586 3.885 7.04c.081.164.081.326.081.487-.08.517-.529.897-1.052.89h-1.296v4.776c.005.49.4.887.89.89h2.914a.9.9 0 0 0 .892-.89v-4.775h4.612c.73 0 1.214-.729.89-1.377z" />
      </svg>
    ),
    color: 'hover:text-green-500',
  },
];

export default function Socials() {
  return (
    <Section id="socials">
      <div className="text-center mb-12">
        <h2 className="mb-4">Connect With Us</h2>
        <p className="text-lg text-text-muted">
          Follow our journey and stay updated with our latest work
        </p>
      </div>

      <div className="flex flex-wrap justify-center gap-8">
        {socialLinks.map((social) => {
          const Icon = social.icon;
          return (
            <a
              key={social.name}
              href={social.url}
              target="_blank"
              rel="noopener noreferrer"
              className={`flex flex-col items-center gap-3 p-6 bg-surface border border-divider rounded-brand transition-all duration-brand hover:border-accent hover:shadow-lg hover:shadow-accent/20 hover:-translate-y-1 group ${social.color}`}
              aria-label={social.name}
            >
              <div className="text-text-muted group-hover:text-current transition-colors duration-brand">
                <Icon />
              </div>
              <span className="text-sm font-medium">{social.name}</span>
            </a>
          );
        })}
      </div>
    </Section>
  );
}
