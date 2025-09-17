'use client';

import ProductByCategory from '@/components/ProductByCategory';

export default function Home() {
  const handleAddToCart = (productId: string) => {
    console.log('Adding product to cart:', productId);
    // Add your cart logic here
  };

  return <ProductByCategory onAddToCart={handleAddToCart} />;
}
