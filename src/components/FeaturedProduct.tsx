'use client';

import React from 'react';
import Image from 'next/image';

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

interface FeaturedProductProps {
  product: Product;
  onAddToCart?: (productId: string) => void;
  isLarge?: boolean;
}

export default function FeaturedProduct({ product, onAddToCart, isLarge = false }: FeaturedProductProps) {
  const isOutOfStock = product.stock_quantity === 0;
  const isInactive = !product.is_active;

  return (
    <div className={`group bg-white rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-500 overflow-hidden ${
      isLarge ? 'max-w-4xl mx-auto' : 'max-w-2xl'
    }`}>
      <div className="relative">
        {/* Product Image */}
        <div className={`relative ${isLarge ? 'h-96' : 'h-80'} w-full bg-gradient-to-br from-gray-100 to-gray-200`}>
          {product.image_url ? (
            <Image
              src={product.image_url}
              alt={product.name}
              fill
              className="object-cover group-hover:scale-105 transition-transform duration-700"
              sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
            />
          ) : (
            <div className="flex items-center justify-center h-full text-gray-400">
              <svg className="w-24 h-24" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M4 3a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V5a2 2 0 00-2-2H4zm12 12H4l4-8 3 6 2-4 3 6z" clipRule="evenodd" />
              </svg>
            </div>
          )}
          
          {/* Featured Badge */}
          <div className="absolute top-4 left-4 bg-gradient-to-r from-emerald-500 to-emerald-600 text-white px-4 py-2 rounded-full text-sm font-bold shadow-lg">
            ⭐ Featured
          </div>
          
          {/* Cart Icon - Top right corner */}
          <button
            onClick={() => onAddToCart?.(product.id)}
            disabled={isOutOfStock || isInactive}
            className={`absolute top-4 right-4 p-3 rounded-full bg-white/90 backdrop-blur-sm transition-all duration-300 ${
              isOutOfStock || isInactive
                ? 'opacity-50 cursor-not-allowed'
                : 'opacity-0 group-hover:opacity-100 hover:bg-white hover:shadow-lg hover:scale-110'
            }`}
          >
            <svg 
              className={`w-6 h-6 ${
                isOutOfStock || isInactive 
                  ? 'text-gray-300' 
                  : 'text-emerald-600 hover:text-emerald-700'
              }`} 
              fill="none" 
              stroke="currentColor" 
              viewBox="0 0 24 24"
            >
              <path 
                strokeLinecap="round" 
                strokeLinejoin="round" 
                strokeWidth={2} 
                d="M3 3h2l.4 2M7 13h10l4-8H5.4m0 0L7 13m0 0l-2.5 5M7 13l2.5 5m6-5v6a2 2 0 01-2 2H9a2 2 0 01-2-2v-6m8 0V9a2 2 0 00-2-2H9a2 2 0 00-2 2v4.01" 
              />
            </svg>
          </button>
          
          {/* Stock Status Badge */}
          {isOutOfStock && (
            <div className="absolute bottom-4 left-4 bg-red-500 text-white px-3 py-1 rounded-full text-sm font-medium">
              Out of Stock
            </div>
          )}
          
          {isInactive && (
            <div className="absolute bottom-4 left-4 bg-gray-500 text-white px-3 py-1 rounded-full text-sm font-medium">
              Unavailable
            </div>
          )}
        </div>

        {/* Product Info */}
        <div className={`p-6 ${isLarge ? 'p-8' : ''}`}>
          <h3 className={`font-bold text-slate-800 mb-3 line-clamp-2 tracking-tight font-inter ${
            isLarge ? 'text-3xl' : 'text-2xl'
          }`}>
            {product.name}
          </h3>
          
          {product.description && (
            <p className={`text-slate-600 mb-4 line-clamp-3 leading-relaxed font-inter ${
              isLarge ? 'text-lg' : 'text-base'
            }`}>
              {product.description}
            </p>
          )}

          <div className="flex items-center justify-between mb-6">
            <div className="flex items-baseline space-x-2">
              <span className={`font-black text-emerald-600 tracking-tight font-inter ${
                isLarge ? 'text-4xl' : 'text-3xl'
              }`}>
                ${product.price.toFixed(2)}
              </span>
              {isLarge && (
                <span className="text-lg text-slate-400 line-through font-inter">
                  ${(product.price * 1.2).toFixed(2)}
                </span>
              )}
            </div>
            
            <span className="text-sm font-medium text-slate-500 uppercase tracking-wider font-inter">
              {product.stock_quantity} in stock
            </span>
          </div>

          {/* Call to Action Button */}
          <button
            onClick={() => onAddToCart?.(product.id)}
            disabled={isOutOfStock || isInactive}
            className={`w-full py-4 px-6 rounded-xl font-bold transition-all duration-300 font-inter ${
              isOutOfStock || isInactive
                ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                : 'bg-gradient-to-r from-emerald-600 to-emerald-700 text-white hover:from-emerald-700 hover:to-emerald-800 hover:shadow-lg hover:scale-105 focus:outline-none focus:ring-4 focus:ring-emerald-200'
            } ${isLarge ? 'text-lg' : 'text-base'}`}
          >
            {isOutOfStock ? 'Out of Stock' : isInactive ? 'Unavailable' : 'Add to Cart'}
          </button>
        </div>
      </div>
    </div>
  );
}
