/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  images: {
    remotePatterns: [
      { protocol: 'https', hostname: 'images.pexels.com' },
    ],
  },
  // The site is a portfolio, not a store — send old shop URLs somewhere useful.
  async redirects() {
    return [
      { source: '/shop', destination: '/portfolio', permanent: true },
      { source: '/product/:id', destination: '/portfolio/:id', permanent: true },
      { source: '/new-arrivals', destination: '/portfolio', permanent: true },
      { source: '/cart', destination: '/', permanent: true },
      { source: '/checkout', destination: '/', permanent: true },
      { source: '/wishlist', destination: '/portfolio', permanent: true },
      { source: '/account', destination: '/', permanent: true },
    ];
  },
};

export default nextConfig;
