-- Create testimonials table
CREATE TABLE IF NOT EXISTS testimonials (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_name VARCHAR(100) NOT NULL,
  user_email VARCHAR(255) NOT NULL,
  user_image TEXT,
  rating INTEGER NOT NULL CHECK (rating >= 1 AND rating <= 5),
  comment TEXT NOT NULL,
  product_id UUID REFERENCES products(id) ON DELETE CASCADE,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create index for better performance
CREATE INDEX IF NOT EXISTS idx_testimonials_product_id ON testimonials(product_id);
CREATE INDEX IF NOT EXISTS idx_testimonials_rating ON testimonials(rating);
CREATE INDEX IF NOT EXISTS idx_testimonials_created_at ON testimonials(created_at);
CREATE INDEX IF NOT EXISTS idx_testimonials_is_active ON testimonials(is_active);

-- Insert sample testimonials data with high-quality user images
INSERT INTO testimonials (user_name, user_email, user_image, rating, comment, product_id) VALUES
('Sarah Johnson', 'sarah.johnson@email.com', 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=400&h=400&fit=crop&crop=face&auto=format&q=80', 5, 'Absolutely love this product! The quality is outstanding and it arrived quickly. Will definitely order again.', (SELECT id FROM products LIMIT 1)),
('Mike Chen', 'mike.chen@email.com', 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=400&h=400&fit=crop&crop=face&auto=format&q=80', 4, 'Great product, fast shipping. The only minor issue was the packaging could be better, but overall very satisfied.', (SELECT id FROM products LIMIT 1 OFFSET 1)),
('Emily Davis', 'emily.davis@email.com', 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=400&h=400&fit=crop&crop=face&auto=format&q=80', 5, 'Perfect! Exactly what I was looking for. The customer service was also excellent when I had questions.', (SELECT id FROM products LIMIT 1 OFFSET 2)),
('David Wilson', 'david.wilson@email.com', 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&h=400&fit=crop&crop=face&auto=format&q=80', 5, 'Amazing quality and value for money. Highly recommend this to anyone looking for this type of product.', (SELECT id FROM products LIMIT 1 OFFSET 3)),
('Lisa Brown', 'lisa.brown@email.com', 'https://images.unsplash.com/photo-1487412720507-e7ab37603c6f?w=400&h=400&fit=crop&crop=face&auto=format&q=80', 4, 'Very happy with my purchase. The product met all my expectations and the delivery was on time.', (SELECT id FROM products LIMIT 1 OFFSET 4)),
('James Taylor', 'james.taylor@email.com', 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=400&h=400&fit=crop&crop=face&auto=format&q=80', 5, 'Outstanding product! The attention to detail is impressive. Will be buying more items from this store.', (SELECT id FROM products LIMIT 1 OFFSET 5)),
('Maria Garcia', 'maria.garcia@email.com', 'https://images.unsplash.com/photo-1494790108755-2616b612b786?w=400&h=400&fit=crop&crop=face&auto=format&q=80', 4, 'Good product overall. The quality is solid and the price is reasonable. Would recommend.', (SELECT id FROM products LIMIT 1 OFFSET 6)),
('Robert Anderson', 'robert.anderson@email.com', 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=400&h=400&fit=crop&crop=face&auto=format&q=80', 5, 'Excellent purchase! The product exceeded my expectations. Fast shipping and great packaging.', (SELECT id FROM products LIMIT 1 OFFSET 7)),
('Jennifer Lee', 'jennifer.lee@email.com', 'https://images.unsplash.com/photo-1517841905240-472988babdf9?w=400&h=400&fit=crop&crop=face&auto=format&q=80', 4, 'Very satisfied with this product. Good quality and arrived in perfect condition. Thank you!', (SELECT id FROM products LIMIT 1 OFFSET 8)),
('Christopher Martinez', 'christopher.martinez@email.com', 'https://images.unsplash.com/photo-1507591064344-4c6ce005b128?w=400&h=400&fit=crop&crop=face&auto=format&q=80', 5, 'Fantastic product! The quality is top-notch and the customer service was excellent. Highly recommend!', (SELECT id FROM products LIMIT 1 OFFSET 9));
