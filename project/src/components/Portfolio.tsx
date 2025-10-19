import { useState } from 'react';
import { X, ChevronLeft, ChevronRight } from 'lucide-react';
import Section from './Section';

type Category = 'All' | 'Realism' | 'Cover-Up' | 'Black and Grey' | 'Custom';

interface PortfolioItem {
  id: number;
  title: string;
  category: Category;
  image: string;
}

const portfolioItems: PortfolioItem[] = [
  { id: 1, title: 'Realism Chest Piece', category: 'Realism', image: 'https://iili.io/Kk4Z199.jpg' },
  { id: 2, title: 'Chest Cover-Up', category: 'Cover-Up', image: 'https://iili.io/Kk4ZGwu.jpg' },
  { id: 3, title: 'Custom Lion', category: 'Custom', image: 'https://iili.io/Kk4Zl87.jpg' },
  { id: 4, title: 'Floral Fine Line', category: 'Black and Grey', image: 'https://iili.io/Kk4E6np.jpg' },
  { id: 5, title: 'Custom Designed Arm Sleeve', category: 'Custom', image: 'https://iili.io/Kkiue4a.jpg' },
  { id: 6, title: 'Realistic Portrait', category: 'Realism', image: 'https://iili.io/KkiBsta.png' },
  { id: 7, title: 'Black and Grey w/ Colour', category: 'Custom', image: 'https://iili.io/KkiuOEg.jpg' },
  { id: 8, title: 'Arm Sleeve', category: 'Black and Grey', image: 'https://iili.io/Kk4ELFt.jpg' },
  { id: 9, title: 'Chest Cover-Up', category: 'Cover-Up', image: 'https://images.pexels.com/photos/3992875/pexels-photo-3992875.jpeg?auto=compress&cs=tinysrgb&w=800' },
  { id: 10, title: 'Custom Faces', category: 'Custom', image: 'https://iili.io/Kk4GHV2.jpg' },
  { id: 11, title: 'Forearm Sleeve', category: 'Realism', image: 'https://iili.io/Kk4EiPI.jpg' },
  { id: 12, title: 'Custom Leg Piece', category: 'Custom', image: 'https://iili.io/Kk4EbAG.jpg' },
];

const categories: Category[] = ['All', 'Realism', 'Cover-Up', 'Black and Grey', 'Custom'];

export default function Portfolio() {
  const [selectedCategory, setSelectedCategory] = useState<Category>('All');
  const [lightboxIndex, setLightboxIndex] = useState<number | null>(null);

  const filteredItems =
    selectedCategory === 'All'
      ? portfolioItems
      : portfolioItems.filter((item) => item.category === selectedCategory);

  const openLightbox = (index: number) => {
    setLightboxIndex(index);
  };

  const closeLightbox = () => {
    setLightboxIndex(null);
  };

  const goToPrevious = () => {
    if (lightboxIndex !== null && lightboxIndex > 0) {
      setLightboxIndex(lightboxIndex - 1);
    }
  };

  const goToNext = () => {
    if (lightboxIndex !== null && lightboxIndex < filteredItems.length - 1) {
      setLightboxIndex(lightboxIndex + 1);
    }
  };

  return (
    <>
      <Section id="portfolio">
        <div className="text-center mb-12">
          <h2 className="mb-4">Portfolio</h2>
          <p className="text-lg text-text-muted">
            A showcase of artistry and detail — every piece tells a story.
          </p>
        </div>

        <div className="flex flex-wrap justify-center gap-3 mb-12">
          {categories.map((category) => (
            <button
              key={category}
              onClick={() => setSelectedCategory(category)}
              className={`px-6 py-2 rounded-brand font-medium transition-all duration-brand ${
                selectedCategory === category
                  ? 'bg-accent text-onyx'
                  : 'bg-surface text-text-muted hover:text-white border border-divider hover:border-accent'
              }`}
            >
              {category}
            </button>
          ))}
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          {filteredItems.map((item, index) => (
            <div
              key={item.id}
              onClick={() => openLightbox(index)}
              className="relative aspect-square overflow-hidden rounded-brand cursor-pointer group"
            >
              <img
                src={item.image}
                alt={item.title}
                className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-brand flex items-end">
                <div className="p-4 w-full">
                  <p className="font-semibold text-lg">{item.title}</p>
                  <p className="text-sm text-accent">{item.category}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </Section>

      {lightboxIndex !== null && (
        <div className="fixed inset-0 z-50 bg-black/95 flex items-center justify-center">
          <button
            onClick={closeLightbox}
            className="absolute top-6 right-6 text-white hover:text-accent transition-colors duration-brand"
            aria-label="Close lightbox"
          >
            <X size={36} />
          </button>

          <button
            onClick={goToPrevious}
            disabled={lightboxIndex === 0}
            className="absolute left-6 text-white hover:text-accent transition-colors duration-brand disabled:opacity-30 disabled:cursor-not-allowed"
            aria-label="Previous image"
          >
            <ChevronLeft size={48} />
          </button>

          <div className="max-w-5xl max-h-[90vh] px-16">
            <img
              src={filteredItems[lightboxIndex].image}
              alt={filteredItems[lightboxIndex].title}
              className="max-w-full max-h-[85vh] object-contain mx-auto rounded-brand"
            />
            <div className="text-center mt-6">
              <h3 className="text-2xl font-semibold">
                {filteredItems[lightboxIndex].title}
              </h3>
              <p className="text-accent mt-2">
                {filteredItems[lightboxIndex].category}
              </p>
            </div>
          </div>

          <button
            onClick={goToNext}
            disabled={lightboxIndex === filteredItems.length - 1}
            className="absolute right-6 text-white hover:text-accent transition-colors duration-brand disabled:opacity-30 disabled:cursor-not-allowed"
            aria-label="Next image"
          >
            <ChevronRight size={48} />
          </button>
        </div>
      )}
    </>
  );
}
