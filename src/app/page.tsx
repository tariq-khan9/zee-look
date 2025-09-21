'use client';

import ProductByCategory from '@/components/ProductByCategory';
import NewArrivals from '@/components/NewArrivals';
import Testimonial from '@/components/Testimonial';

export default function Home() {
  const handleAddToCart = (productId: string) => {
    console.log('Adding product to cart:', productId);
    // Add your cart logic here
  };

  return (
    <div>
      {/* New Arrivals Section */}
      <NewArrivals 
        onAddToCart={handleAddToCart}
        limit={3}
        showLarge={false}
      />
      
      {/* All Products by Category */}
      <ProductByCategory onAddToCart={handleAddToCart} />
      
      {/* Testimonials Section */}
      <Testimonial />
    </div>
  );
}

