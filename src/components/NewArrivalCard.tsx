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

interface NewArrivalCardProps {
  product: Product;
  onAddToCart?: (productId: string) => void;
}

export default function NewArrivalCard({ product, onAddToCart }: NewArrivalCardProps) {
  const isOutOfStock = product.stock_quantity === 0;
  const isInactive = !product.is_active;

  return (
    <>
      <style jsx>{`
        @keyframes shimmer {
          0% { background-position: -200% 0; }
          100% { background-position: 200% 0; }
        }
      `}</style>
    <div className="group relative h-96 w-full rounded-3xl shadow-xl hover:shadow-2xl transition-all duration-700 overflow-hidden border-2 border-transparent hover:border-emerald-300 hover:-translate-y-2">
      {/* Full Background Image */}
      {product.image_url ? (
        <Image
          src={product.image_url}
          alt={product.name}
          fill
          className="object-cover transition-all duration-1000 ease-out group-hover:scale-110"
          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
        />
      ) : (
        <div className="flex items-center justify-center h-full bg-gradient-to-br from-slate-100 via-emerald-50 to-purple-50 text-slate-400">
          <div className="text-center">
            <svg className="w-24 h-24 mx-auto mb-4" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M4 3a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V5a2 2 0 00-2-2H4zm12 12H4l4-8 3 6 2-4 3 6z" clipRule="evenodd" />
            </svg>
            <p className="text-sm font-medium">No Image</p>
          </div>
        </div>
      )}

      {/* Dark Overlay for Better Text Readability */}
      <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />
      
      {/* Stylish NEW Badge */}
      <div className="absolute top-4 left-4 z-30">
        <div className="relative">
          {/* Main badge container */}
          <div className="relative overflow-hidden">
            {/* Badge background with gradient */}
            <div className="bg-gradient-to-r from-orange-500 via-red-500 to-pink-500 px-2.5 py-1 rounded-full shadow-2xl transform -rotate-3 hover:rotate-0 transition-transform duration-300">
              {/* Animated background pattern */}
              <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent animate-pulse" />
              
              {/* Badge content */}
              <div className="relative flex items-center gap-1.5">
                {/* Sparkle icon */}
                <svg className="w-2.5 h-2.5 text-white animate-spin" fill="currentColor" viewBox="0 0 20 20">
                  <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                </svg>
                
                {/* NEW text */}
                <span className="text-white font-black text-xs tracking-wider drop-shadow-lg">
                  NEW
                </span>
                
                {/* Sparkle icon */}
                <svg className="w-2.5 h-2.5 text-white animate-pulse" fill="currentColor" viewBox="0 0 20 20">
                  <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                </svg>
              </div>
            </div>
            
            {/* Outer glow effect */}
            <div className="absolute inset-0 bg-gradient-to-r from-orange-400 via-red-400 to-pink-400 rounded-full blur-lg opacity-60 animate-pulse" />
            
            {/* Inner highlight */}
            <div className="absolute top-0 left-0 right-0 h-1/2 bg-gradient-to-b from-white/30 to-transparent rounded-full" />
          </div>
        </div>
      </div>

      {/* Stock Status Badge */}
      {isOutOfStock && (
        <div className="absolute top-16 left-4 bg-gradient-to-r from-red-500 to-red-600 text-white px-4 py-2 rounded-full text-sm font-bold shadow-xl">
          Out of Stock
        </div>
      )}
      
      {isInactive && (
        <div className="absolute top-16 left-4 bg-gradient-to-r from-gray-500 to-gray-600 text-white px-4 py-2 rounded-full text-sm font-bold shadow-xl">
          Inactive
        </div>
      )}

      {/* Quick View Icon - Top right corner */}
      <div className={`absolute top-4 right-4 transition-all duration-300 ${
        isOutOfStock || isInactive
          ? 'opacity-50'
          : 'opacity-0 group-hover:opacity-100'
      }`}>
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
      </div>

      {/* Content Overlay - Bottom */}
      <div className="absolute bottom-0 left-0 right-0 p-6 text-white">
        {/* Product Name and Stars in same row */}
        <div className="flex items-center justify-between mb-3">
          <h3 className="text-2xl font-black text-white line-clamp-2 tracking-tight font-inter drop-shadow-lg flex-1">
            {product.name}
          </h3>
          
          <div className="flex items-center ml-4">
            {[1, 2, 3, 4, 5].map((star) => (
              <svg
                key={star}
                className={`w-4 h-4 ${
                  star <= 4 ? 'text-yellow-400' : 'text-white/50'
                }`}
                fill="currentColor"
                viewBox="0 0 20 20"
              >
                <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
              </svg>
            ))}
            <span className="ml-2 text-sm text-white/80 font-inter font-medium">(4.0)</span>
          </div>
        </div>
        
        {/* Product Description */}
        {product.description && (
          <p className="text-white/90 text-sm line-clamp-2 leading-relaxed font-inter drop-shadow-md">
            {product.description}
          </p>
        )}
      </div>

      {/* Hover Effect Overlay */}
      <div className="absolute inset-0 bg-gradient-to-tr from-emerald-500/10 via-transparent to-purple-500/10 opacity-0 group-hover:opacity-100 transition-opacity duration-700" />

      {/* Animated Border Effect */}
      <div className="absolute inset-0 rounded-3xl border-2 border-transparent group-hover:border-emerald-300 transition-all duration-700 pointer-events-none" />
    </div>
    </>
  );
}
