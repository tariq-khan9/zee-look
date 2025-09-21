-- Create user_feedbacks table
CREATE TABLE IF NOT EXISTS user_feedbacks (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_name VARCHAR(100) NOT NULL,
  user_email VARCHAR(255) NOT NULL,
  rating INTEGER NOT NULL CHECK (rating >= 1 AND rating <= 5),
  comment TEXT NOT NULL,
  product_id UUID REFERENCES products(id) ON DELETE CASCADE,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create index for better performance
CREATE INDEX IF NOT EXISTS idx_user_feedbacks_product_id ON user_feedbacks(product_id);
CREATE INDEX IF NOT EXISTS idx_user_feedbacks_rating ON user_feedbacks(rating);
CREATE INDEX IF NOT EXISTS idx_user_feedbacks_created_at ON user_feedbacks(created_at);
CREATE INDEX IF NOT EXISTS idx_user_feedbacks_is_active ON user_feedbacks(is_active);

-- Insert sample feedback data
INSERT INTO user_feedbacks (user_name, user_email, rating, comment, product_id) VALUES
('Sarah Johnson', 'sarah.johnson@email.com', 5, 'Absolutely love this product! The quality is outstanding and it arrived quickly. Will definitely order again.', (SELECT id FROM products LIMIT 1)),
('Mike Chen', 'mike.chen@email.com', 4, 'Great product, fast shipping. The only minor issue was the packaging could be better, but overall very satisfied.', (SELECT id FROM products LIMIT 1 OFFSET 1)),
('Emily Davis', 'emily.davis@email.com', 5, 'Perfect! Exactly what I was looking for. The customer service was also excellent when I had questions.', (SELECT id FROM products LIMIT 1 OFFSET 2)),
('David Wilson', 'david.wilson@email.com', 5, 'Amazing quality and value for money. Highly recommend this to anyone looking for this type of product.', (SELECT id FROM products LIMIT 1 OFFSET 3)),
('Lisa Brown', 'lisa.brown@email.com', 4, 'Very happy with my purchase. The product met all my expectations and the delivery was on time.', (SELECT id FROM products LIMIT 1 OFFSET 4)),
('James Taylor', 'james.taylor@email.com', 5, 'Outstanding product! The attention to detail is impressive. Will be buying more items from this store.', (SELECT id FROM products LIMIT 1 OFFSET 5)),
('Maria Garcia', 'maria.garcia@email.com', 4, 'Good product overall. The quality is solid and the price is reasonable. Would recommend.', (SELECT id FROM products LIMIT 1 OFFSET 6)),
('Robert Anderson', 'robert.anderson@email.com', 5, 'Excellent purchase! The product exceeded my expectations. Fast shipping and great packaging.', (SELECT id FROM products LIMIT 1 OFFSET 7)),
('Jennifer Lee', 'jennifer.lee@email.com', 4, 'Very satisfied with this product. Good quality and arrived in perfect condition. Thank you!', (SELECT id FROM products LIMIT 1 OFFSET 8)),
('Christopher Martinez', 'christopher.martinez@email.com', 5, 'Fantastic product! The quality is top-notch and the customer service was excellent. Highly recommend!', (SELECT id FROM products LIMIT 1 OFFSET 9));


