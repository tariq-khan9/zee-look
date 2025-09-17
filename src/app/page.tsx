'use client';

import ProductByCategory from '@/components/ProductByCategory';
import FeaturedProducts from '@/components/FeaturedProducts';

export default function Home() {
  const handleAddToCart = (productId: string) => {
    console.log('Adding product to cart:', productId);
    // Add your cart logic here
  };

  return (
    <div>
      {/* Featured Products Section */}
      <FeaturedProducts 
        onAddToCart={handleAddToCart}
        limit={3}
        showLarge={false}
      />
      
      {/* All Products by Category */}
      <ProductByCategory onAddToCart={handleAddToCart} />
    </div>
  );
}

