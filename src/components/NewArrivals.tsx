'use client';

import { useEffect, useState } from 'react';
import ProductCard from './ProductCard';

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
    <section className="py-16 bg-gradient-to-br from-gray-50 to-white">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-4xl font-bold text-slate-800 mb-4 font-inter">
            New Arrivals
          </h2>
          <p className="text-xl text-slate-600 font-inter max-w-2xl mx-auto">
            Discover our latest collection of fresh products just added to our store
          </p>
        </div>

        {showLarge ? (
          // Single large new arrival
          <div className="flex justify-center">
            <div className="max-w-md">
              <ProductCard
                product={products[0]}
                onAddToCart={handleAddToCart}
              />
            </div>
          </div>
        ) : (
          // Grid of new arrivals - limited to 3 products (1 row)
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {products.slice(0, 3).map((product, index) => (
              <ProductCard
                key={product.id}
                product={product}
                onAddToCart={handleAddToCart}
              />
            ))}
          </div>
        )}

        {/* View All Button */}
        <div className="text-center mt-12">
          <a 
            href="/new-arrivals"
            className="inline-block px-8 py-4 bg-slate-800 text-white rounded-xl font-bold hover:bg-slate-900 transition-colors duration-300 font-inter"
          >
            View All New Arrivals
          </a>
        </div>
      </div>
    </section>
  );
}
