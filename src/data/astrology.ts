export interface AstrologicalShield {
  id: string;
  name: string;
  planet: string;
  image: string;
  description: string;
}

/**
 * Nawagraha-inspired shield pieces, each dedicated to a planetary influence
 * from Vedic / Sri Lankan astrology. Traditionally worn or gifted to
 * strengthen or balance the wearer's relationship with that graha.
 */
export const ASTROLOGICAL_SHIELDS: AstrologicalShield[] = [
  {
    id: 'kethu',
    name: 'Kethu',
    planet: 'The Shadow Planet',
    image:
      '/images/portfolio/rings/nawagraha-kethu-ring.jpg',
    description:
      'Set in oxidised silver with a single dark stone, worn to ground restless energy and quiet the mind.',
  },
  {
    id: 'sikuru',
    name: 'Sikuru',
    planet: 'Venus — Grace & Union',
    image:
      '/images/portfolio/rings/nawagraha-sikuru-ring.jpg',
    description:
      'A warm citrine centrepiece in rose gold, associated with love, beauty and creative harmony.',
  },
  {
    id: 'senasuru',
    name: 'Senasuru',
    planet: 'Saturn — Discipline & Time',
    image:
      '/images/portfolio/rings/nawagraha-senasuru-ring.jpg',
    description:
      'Cast in blackened silver, this shield is commissioned for strength through life\'s longer trials.',
  },
  {
    id: 'rahu',
    name: 'Rahu',
    planet: 'The Ascending Node',
    image:
      '/images/portfolio/rings/nawagraha-rahu-ring.jpg',
    description:
      'A serpentine silver band set with peridot, worn as protection while pursuing ambition.',
  },
];
