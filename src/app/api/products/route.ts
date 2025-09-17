import { NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const categoryId = searchParams.get('category');
    const isFeatured = searchParams.get('featured');
    const limit = searchParams.get('limit');

    let query = supabase
      .from('products')
      .select('*')
      .eq('is_active', true)
      .order('created_at', { ascending: false });

    // Filter by category if specified
    if (categoryId && categoryId !== 'all') {
      query = query.eq('category_id', categoryId);
    }

    // Filter featured products (for now, we'll use stock_quantity > 10 as featured)
    if (isFeatured === 'true') {
      query = query.gt('stock_quantity', 10);
    }

    // Apply limit if specified
    if (limit) {
      query = query.limit(parseInt(limit));
    }

    const { data: products, error } = await query;

    if (error) {
      console.error('Error fetching products:', error);
      return NextResponse.json(
        { error: 'Failed to fetch products' },
        { status: 500 }
      );
    }

    return NextResponse.json({ products });
  } catch (error) {
    console.error('Unexpected error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
