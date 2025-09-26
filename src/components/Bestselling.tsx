'use client';

import { useEffect, useState, useCallback, useRef } from 'react';
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

interface BestsellingProps {
  onAddToCart?: (productId: string) => void;
  limit?: number;
}

export default function Bestselling({ onAddToCart, limit = 10 }: BestsellingProps) {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [currentIndex, setCurrentIndex] = useState(0);
  const carouselRef = useRef<HTMLDivElement>(null);

  const fetchBestselling = useCallback(async () => {
    try {
      setLoading(true);
      // For now, we'll fetch featured products as bestselling
      // In the future, this could be enhanced to fetch actual bestselling products
      const response = await fetch(`/api/products?limit=${limit}&featured=true`);
      if (!response.ok) {
        throw new Error('Failed to fetch bestselling products');
      }
      const data = await response.json();
      setProducts(data.products);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
    } finally {
      setLoading(false);
    }
  }, [limit]);

  useEffect(() => {
    fetchBestselling();
  }, [fetchBestselling]);

  const handleAddToCart = (productId: string) => {
    console.log('Adding bestselling product to cart:', productId);
    onAddToCart?.(productId);
  };

  const goToPrevious = () => {
    if (products.length === 0) return;
    setCurrentIndex((prev) => {
      const newIndex = (prev - 1 + products.length) % products.length;
      return newIndex;
    });
  };

  const goToNext = () => {
    if (products.length === 0) return;
    setCurrentIndex((prev) => {
      const newIndex = (prev + 1) % products.length;
      return newIndex;
    });
  };

  // Auto-advance carousel every 5 seconds - DISABLED
  // useEffect(() => {
  //   if (products.length <= 1) return;
  //   const interval = setInterval(goToNext, 5000);
  //   return () => clearInterval(interval);
  // }, [products.length]);

  if (loading) {
    return (
      <div className="py-16">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-emerald-600 mx-auto"></div>
          <p className="mt-4 text-slate-600 font-inter">Loading bestselling products...</p>
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
            onClick={fetchBestselling}
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
          <p className="text-slate-600 text-lg font-inter">No bestselling products available at the moment.</p>
        </div>
      </div>
    );
  }

  return (
    <section className="py-16 bg-gradient-to-br from-emerald-50 to-white">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-4xl font-bold text-slate-800 mb-4 font-inter">
            Bestselling Products
          </h2>
          <p className="text-xl text-slate-600 font-inter max-w-2xl mx-auto">
            Our most popular and highly-rated products that customers love
          </p>
        </div>

        {/* Carousel of bestselling products - 4 cards layout */}
        <div className="relative overflow-hidden">
          <div 
            ref={carouselRef}
            className="flex transition-transform duration-500 ease-in-out"
            style={{
              transform: `translateX(calc(-${currentIndex * 25}%))`
            }}
          >
            {/* Duplicate last 2 products at the beginning for seamless loop */}
            {products.slice(-2).map((product, index) => (
              <div key={`prev-${product.id}`} className="flex-shrink-0 w-1/4 px-2">
                <ProductCard
                  product={product}
                  onAddToCart={handleAddToCart}
                />
              </div>
            ))}
            
            {/* Main products */}
            {products.map((product, index) => (
              <div key={product.id} className="flex-shrink-0 w-1/4 px-2">
                <ProductCard
                  product={product}
                  onAddToCart={handleAddToCart}
                />
              </div>
            ))}
            
            {/* Duplicate first 2 products at the end for seamless loop */}
            {products.slice(0, 2).map((product, index) => (
              <div key={`next-${product.id}`} className="flex-shrink-0 w-1/4 px-2">
                <ProductCard
                  product={product}
                  onAddToCart={handleAddToCart}
                />
              </div>
            ))}
          </div>
          
          {/* Navigation buttons */}
          <button
            onClick={goToPrevious}
            className="absolute left-4 top-1/2 transform -translate-y-1/2 bg-white/90 hover:bg-white text-slate-800 p-3 rounded-full shadow-lg transition-all duration-200 z-10 hover:scale-110 border-2 border-emerald-500"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
          </button>
          
          <button
            onClick={goToNext}
            className="absolute right-4 top-1/2 transform -translate-y-1/2 bg-white/90 hover:bg-white text-slate-800 p-3 rounded-full shadow-lg transition-all duration-200 z-10 hover:scale-110 border-2 border-emerald-500"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </button>
          
          {/* Dots indicator */}
          <div className="flex justify-center mt-6 space-x-2">
            {products.map((_, index) => (
              <button
                key={index}
                onClick={() => setCurrentIndex(index)}
                className={`w-3 h-3 rounded-full transition-all duration-200 ${
                  index === currentIndex 
                    ? 'bg-emerald-600 scale-125' 
                    : 'bg-gray-300 hover:bg-gray-400'
                }`}
              />
            ))}
          </div>
        </div>

      </div>
    </section>
  );
}
