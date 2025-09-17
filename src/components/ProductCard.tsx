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

interface ProductCardProps {
  product: Product;
  onAddToCart?: (productId: string) => void;
}

export default function ProductCard({ product, onAddToCart }: ProductCardProps) {
  const isOutOfStock = product.stock_quantity === 0;
  const isInactive = !product.is_active;

  return (
    <div className="group bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow duration-300 overflow-hidden">
      {/* Product Image */}
      <div className="relative h-64 w-full bg-gray-200">
        {product.image_url ? (
          <Image
            src={product.image_url}
            alt={product.name}
            fill
            className="object-cover"
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
          />
        ) : (
          <div className="flex items-center justify-center h-full text-gray-400">
            <svg className="w-16 h-16" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M4 3a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V5a2 2 0 00-2-2H4zm12 12H4l4-8 3 6 2-4 3 6z" clipRule="evenodd" />
            </svg>
          </div>
        )}
        
        {/* Cart Icon - Top right corner */}
        <button
          onClick={() => onAddToCart?.(product.id)}
          disabled={isOutOfStock || isInactive}
          className={`absolute top-2 right-2 p-2 rounded-full bg-white/80 backdrop-blur-sm transition-all duration-200 ${
            isOutOfStock || isInactive
              ? 'opacity-50 cursor-not-allowed'
              : 'opacity-0 group-hover:opacity-100 hover:bg-white hover:shadow-md'
          }`}
        >
          <svg 
            className={`w-5 h-5 ${
              isOutOfStock || isInactive 
                ? 'text-gray-300' 
                : 'text-gray-600 hover:text-gray-800'
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
          <div className="absolute top-2 left-2 bg-red-500 text-white px-2 py-1 rounded-full text-xs font-medium">
            Out of Stock
          </div>
        )}
        
        {isInactive && (
          <div className="absolute top-2 left-2 bg-gray-500 text-white px-2 py-1 rounded-full text-xs font-medium">
            Inactive
          </div>
        )}
      </div>

      {/* Product Info */}
      <div className="p-5">
        <h3 className="text-xl font-bold text-slate-800 mb-3 line-clamp-2 tracking-tight font-inter">
          {product.name}
        </h3>
        
        {product.description && (
          <p className="text-slate-600 text-sm mb-4 line-clamp-2 leading-relaxed font-inter">
            {product.description}
          </p>
        )}

        <div className="flex items-center justify-between mb-4">
          <span className="text-3xl font-black text-emerald-600 tracking-tight font-inter">
            ${product.price.toFixed(2)}
          </span>
          
          <span className="text-xs font-medium text-slate-500 uppercase tracking-wider font-inter">
            {product.stock_quantity} in stock
          </span>
        </div>

      </div>
    </div>
  );
}
