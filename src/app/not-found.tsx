import Link from 'next/link';

export const dynamic = 'force-dynamic';

export default function NotFound() {
  return (
    <div className="container-lux flex min-h-[60vh] flex-col items-center justify-center py-24 text-center">
      <p className="text-xs uppercase tracking-ultra text-champagne-600">404</p>
      <h1 className="mt-4 font-serif text-4xl text-charcoal-900 lg:text-5xl">
        Page Not Found
      </h1>
      <p className="mt-4 max-w-md text-sm font-light text-charcoal-500">
        The page you are looking for may have been moved or no longer exists.
      </p>
      <Link
        href="/"
        className="mt-8 bg-charcoal-900 px-8 py-4 text-xs font-medium uppercase tracking-widest text-ivory-50 transition-colors hover:bg-champagne-500"
      >
        Return Home
      </Link>
    </div>
  );
}
