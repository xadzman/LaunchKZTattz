import { useState, useEffect } from 'react';
import { ChevronDown } from 'lucide-react';
import Button from './Button';

const heroSlides = [
  { id: 1, image: 'https://iili.io/Kk4Z199.jpg' },
  { id: 2, image: 'https://iili.io/Kkiue4a.jpg' },
  { id: 3, image: 'https://iili.io/Kk4ELFt.jpg' },
  { id: 4, image: 'https://iili.io/Kk4GHV2.jpg' },
];

export default function Hero() {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [isPaused, setIsPaused] = useState(false);

  useEffect(() => {
    if (isPaused) return;

    const interval = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % heroSlides.length);
    }, 6000);

    return () => clearInterval(interval);
  }, [isPaused]);

  return (
    <section
      id="hero"
      className="relative h-screen flex items-center justify-center overflow-hidden"
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
    >
      {heroSlides.map((slide, index) => (
        <div
          key={slide.id}
          className={`absolute inset-0 transition-opacity duration-1000 ${
            index === currentSlide ? 'opacity-100' : 'opacity-0'
          }`}
        >
          <img
            src={slide.image}
            alt={`KZ Tattz showcase ${slide.id}`}
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-b from-black/60 via-black/40 to-black/80" />
        </div>
      ))}

      <div className="relative z-10 section-container text-center">
        <h1 className="mb-6 animate-fade-in">KZ Tattz</h1>
        <h2 className="text-xl md:text-2xl lg:text-3xl font-normal text-text-muted mb-12 max-w-4xl mx-auto">
          From Vision to Skin, The Art of KZ Tattz Brought to Life. Ink Redefined
        </h2>
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Button variant="primary" href="#portfolio" className="text-lg px-8 py-4">
            View Portfolio
          </Button>
          <Button variant="secondary" href="#booking" className="text-lg px-8 py-4">
            Book a Session
          </Button>
        </div>
      </div>

      <a
        href="#about"
        className="absolute bottom-12 left-1/2 -translate-x-1/2 z-10 flex flex-col items-center gap-2 text-text-muted hover:text-white transition-colors duration-brand animate-bounce"
        aria-label="Scroll to next section"
      >
        <span className="text-sm uppercase tracking-wide">Scroll</span>
        <ChevronDown size={24} />
      </a>

      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 z-10 flex gap-2">
        {heroSlides.map((_, index) => (
          <button
            key={index}
            onClick={() => setCurrentSlide(index)}
            className={`w-2 h-2 rounded-full transition-all duration-brand ${
              index === currentSlide ? 'bg-accent w-8' : 'bg-white/30'
            }`}
            aria-label={`Go to slide ${index + 1}`}
          />
        ))}
      </div>
    </section>
  );
}
