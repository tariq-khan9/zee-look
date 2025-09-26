'use client';

import { useState, useEffect } from 'react';
import ProductCard from '@/components/ProductCard';
import Link from 'next/link';

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

interface NewArrivalsPageProps {
  onAddToCart?: (productId: string) => void;
}

export default function NewArrivalsPage({ onAddToCart }: NewArrivalsPageProps) {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchNewArrivals();
  }, []);

  const fetchNewArrivals = async () => {
    try {
      setLoading(true);
      const response = await fetch(
        `/api/products?sort=newest&limit=12`
      );
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

  if (loading && products.length === 0) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-emerald-600 mx-auto"></div>
          <p className="mt-4 text-slate-600 font-inter">Loading new arrivals...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <p className="text-red-600 mb-4 font-inter">{error}</p>
          <button 
            onClick={fetchNewArrivals}
            className="px-4 py-2 bg-emerald-600 text-white rounded hover:bg-emerald-700 font-inter"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-8">
        {/* Breadcrumbs */}
        <nav className="flex items-center space-x-2 text-sm text-slate-600 mb-8 font-inter">
          <Link href="/" className="hover:text-emerald-600">Home</Link>
          <span>/</span>
          <span className="text-slate-800 font-medium">New Arrivals</span>
        </nav>

        {/* Hero Section */}
        <div className="text-center mb-12">
          
          <h1 className="text-4xl font-bold text-slate-800 mb-4 font-inter">
            New Arrivals
          </h1>
          <p className="text-xl text-slate-600 font-inter max-w-3xl mx-auto">
            Discover our latest collection of fresh products just added to our store. 
            Be the first to explore these exciting new additions!
          </p>
        </div>

        {/* Products Grid */}
        {products.length === 0 ? (
          <div className="text-center py-12">
           
            <p className="text-slate-600 text-lg font-inter">No new arrivals available at the moment.</p>
            <p className="text-slate-500 text-sm font-inter mt-2">Check back soon for our latest additions!</p>
          </div>
        ) : (
          <>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {products.map((product) => (
                <ProductCard
                  key={product.id}
                  product={product}
                  onAddToCart={handleAddToCart}
                />
              ))}
            </div>

          </>
        )}

        {/* Call to Action */}
        <div className="mt-16 text-center">
          <div className="bg-gradient-to-r from-emerald-50 to-emerald-100 rounded-2xl p-8">
            <h3 className="text-2xl font-bold text-slate-800 mb-4 font-inter">
              Looking for Something Specific?
            </h3>
            <p className="text-slate-600 mb-6 font-inter">
              Explore our complete collection of products across all categories
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <a
                href="/products"
                className="px-8 py-4 bg-slate-800 text-white rounded-xl font-bold hover:bg-slate-900 transition-colors duration-300 font-inter"
              >
                View All Products
              </a>
              <a
                href="/"
                className="px-8 py-4 bg-white text-slate-800 rounded-xl font-bold hover:bg-gray-50 border border-slate-300 transition-colors duration-300 font-inter"
              >
                Back to Home
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
