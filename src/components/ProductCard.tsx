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
      <div className="relative h-64 w-full bg-gray-200 overflow-hidden">
        {product.image_url ? (
          <Image
            src={product.image_url}
            alt={product.name}
            fill
            className="object-cover transition-transform duration-2000 ease-out hover:scale-110"
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
          />
        ) : (
          <div className="flex items-center justify-center h-full text-gray-400">
            <svg className="w-16 h-16" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M4 3a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V5a2 2 0 00-2-2H4zm12 12H4l4-8 3 6 2-4 3 6z" clipRule="evenodd" />
            </svg>
          </div>
        )}
        
        {/* Action Icons - Top right corner */}
        <div className={`absolute top-2 right-2 flex flex-col gap-2 transition-all duration-300 ${
          isOutOfStock || isInactive
            ? 'opacity-50'
            : 'opacity-0 group-hover:opacity-100'
        }`}>
          {/* Quick View Icon */}
          <button
            onClick={() => console.log('Quick view:', product.id)}
            className="p-2 rounded-full bg-white/90 backdrop-blur-sm hover:bg-white hover:shadow-lg hover:shadow-emerald-500/25 hover:scale-110 transition-all duration-200"
            title="Quick View"
          >
            <svg 
              className="w-5 h-5 text-slate-600 hover:text-slate-800" 
              fill="none" 
              stroke="currentColor" 
              viewBox="0 0 24 24"
            >
              <path 
                strokeLinecap="round" 
                strokeLinejoin="round" 
                strokeWidth={2} 
                d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" 
              />
              <path 
                strokeLinecap="round" 
                strokeLinejoin="round" 
                strokeWidth={2} 
                d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" 
              />
            </svg>
          </button>

          {/* Cart Icon */}
          <button
            onClick={() => onAddToCart?.(product.id)}
            disabled={isOutOfStock || isInactive}
            className="p-2 rounded-full bg-white/90 backdrop-blur-sm hover:bg-white hover:shadow-lg hover:shadow-emerald-500/25 hover:scale-110 transition-all duration-200 disabled:cursor-not-allowed"
            title="Add to Cart"
          >
            <svg 
              className={`w-5 h-5 ${
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

          {/* Like Icon */}
          <button
            onClick={() => console.log('Like:', product.id)}
            className="p-2 rounded-full bg-white/90 backdrop-blur-sm hover:bg-white hover:shadow-lg hover:shadow-emerald-500/25 hover:scale-110 transition-all duration-200"
            title="Add to Wishlist"
          >
            <svg 
              className="w-5 h-5 text-slate-600 hover:text-red-500" 
              fill="none" 
              stroke="currentColor" 
              viewBox="0 0 24 24"
            >
              <path 
                strokeLinecap="round" 
                strokeLinejoin="round" 
                strokeWidth={2} 
                d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" 
              />
            </svg>
          </button>
        </div>
        
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
        <h3 className="text-xl font-bold text-slate-800 mb-2 line-clamp-2 tracking-tight font-inter">
          {product.name}
        </h3>
        
        {/* Star Rating */}
        <div className="flex items-center mb-3">
          <div className="flex items-center">
            {[1, 2, 3, 4, 5].map((star) => (
              <svg
                key={star}
                className={`w-4 h-4 ${
                  star <= 4 ? 'text-yellow-400' : 'text-gray-300'
                }`}
                fill="currentColor"
                viewBox="0 0 20 20"
              >
                <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
              </svg>
            ))}
          </div>
          <span className="ml-2 text-sm text-slate-500 font-inter">(4.0)</span>
        </div>
        
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
