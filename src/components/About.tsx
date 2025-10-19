import { Palette, RefreshCw, Sparkles, Droplet, Heart } from 'lucide-react';
import Section from './Section';

const features = [
  { icon: Palette, label: 'Realism' },
  { icon: RefreshCw, label: 'Cover-Ups' },
  { icon: Sparkles, label: 'Custom' },
  { icon: Droplet, label: 'Black And Grey' },
  { icon: Heart, label: 'Aftercare Guidance' },
];

export default function About() {
  return (
    <Section id="about" className="bg-surface">
      <div className="max-w-4xl mx-auto text-center">
        <h2 className="mb-8">More Than Tattoos</h2>
        <p className="text-lg md:text-xl text-text-muted mb-12 leading-relaxed">
          Inspired by the streets, music, and raw expression, Kacper brings authenticity to the tattoo's he creates. His work is grounded in black and grey realism, but his style pushes boundaries — turning lived experience into visual art. Kacper is the Head Artist at Beyond Ink Tattoo Studio, specialising in black and grey realism with an emphasis on texture, tone, and emotion.
His work reflects a refined eye for composition and balance, influenced by both classical and contemporary art.
        </p>

        <div className="flex flex-wrap justify-center gap-4">
          {features.map((feature) => {
            const Icon = feature.icon;
            return (
              <div
                key={feature.label}
                className="flex items-center gap-3 px-6 py-3 bg-onyx border border-divider rounded-brand hover:border-accent transition-colors duration-brand"
              >
                <Icon size={20} className="text-accent" />
                <span className="text-sm font-medium">{feature.label}</span>
              </div>
            );
          })}
        </div>
      </div>
    </Section>
  );
}
