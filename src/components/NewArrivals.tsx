'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import NewArrivalCard from './NewArrivalCard';

interface Product {
  id: string;
  name: string;
  slug: string;
  description: string | null;
  price: number;
  image_url: string | null;
  category_id: string | null;
  stock_quantity: number;
  is_active: boolean;
  created_at: string;
}

interface NewArrivalsProps {
  onAddToCart?: (productId: string) => void;
  limit?: number;
  showLarge?: boolean;
}

export default function NewArrivals({ onAddToCart, limit = 3, showLarge = false }: NewArrivalsProps) {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  useEffect(() => {
    fetchNewArrivals();
  }, [limit]);

  const fetchNewArrivals = async () => {
    try {
      setLoading(true);
      const response = await fetch(`/api/products?limit=${limit}&sort=newest`);
      if (!response.ok) {
        throw new Error('Failed to fetch new arrivals');
      }
      const data = await response.json();
      setProducts(data.products);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
    } finally {
      setLoading(false);
    }
  };

  const handleAddToCart = (productId: string) => {
    console.log('Adding new arrival to cart:', productId);
    onAddToCart?.(productId);
  };

  const handleViewAll = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    console.log('View All button clicked, navigating to /new-arrivals');
    
    // Try router first, fallback to window.location
    if (router && typeof router.push === 'function') {
      router.push('/new-arrivals');
    } else {
      console.log('Router not available, using window.location');
      window.location.href = '/new-arrivals';
    }
  };

  if (loading) {
    return (
      <div className="py-16">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-emerald-600 mx-auto"></div>
          <p className="mt-4 text-slate-600 font-inter">Loading new arrivals...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="py-16">
        <div className="text-center">
          <p className="text-red-600 mb-4 font-inter">{error}</p>
          <button 
            onClick={fetchNewArrivals}
            className="px-6 py-3 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 font-inter"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  if (products.length === 0) {
    return (
      <div className="py-16">
        <div className="text-center">
          <p className="text-slate-600 text-lg font-inter">No new arrivals available at the moment.</p>
        </div>
      </div>
    );
  }

  return (
    <section className="py-20 bg-gradient-to-br from-emerald-50 via-purple-50 to-teal-50 relative overflow-hidden">
      {/* Decorative Background Elements */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_20%,rgba(16,185,129,0.1),transparent_50%)]" />
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_70%_80%,rgba(139,92,246,0.1),transparent_50%)]" />
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(20,184,166,0.05),transparent_70%)]" />
      <div className="container mx-auto px-4">
        <div className="text-center mb-16 relative z-10">
          <h2 className="text-5xl font-black text-slate-800 mb-6 font-inter">
            New Arrivals
          </h2>
          <p className="text-xl text-slate-600 font-inter max-w-2xl mx-auto leading-relaxed">
            Discover our latest collection of fresh products just added to our store
          </p>
        </div>

        {showLarge ? (
          // Single large new arrival
          <div className="flex justify-center">
            <div className="max-w-md">
              <NewArrivalCard
                product={products[0]}
                onAddToCart={handleAddToCart}
              />
            </div>
          </div>
        ) : (
          // Grid of new arrivals - limited to 3 products (1 row)
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {products.slice(0, 3).map((product, index) => (
              <NewArrivalCard
                key={product.id}
                product={product}
                onAddToCart={handleAddToCart}
              />
            ))}
          </div>
        )}

        {/* View All Button */}
        <div className="text-center mt-12 relative z-20">
          <button 
            onClick={() => {
              console.log('View All New Arrivals clicked!');
              window.location.href = '/new-arrivals';
            }}
            className="px-8 py-4 bg-slate-800 text-white rounded-xl font-bold hover:bg-slate-900 active:bg-slate-700 transition-colors duration-300 font-inter cursor-pointer focus:outline-none focus:ring-2 focus:ring-slate-500 focus:ring-offset-2"
          >
            View All New Arrivals
          </button>
        </div>
      </div>
    </section>
  );
}
