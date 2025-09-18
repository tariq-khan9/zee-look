import { NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const categoryId = searchParams.get('category');
    const isFeatured = searchParams.get('featured');
    const limit = searchParams.get('limit');
    const page = searchParams.get('page');
    const pageSize = searchParams.get('limit') || '12';
    const currentPage = page ? parseInt(page) : 1;
    const itemsPerPage = parseInt(pageSize);
    const offset = (currentPage - 1) * itemsPerPage;

    // First, get the total count for pagination
    let countQuery = supabase
      .from('products')
      .select('*', { count: 'exact', head: true })
      .eq('is_active', true);

    // Apply same filters for count
    if (categoryId && categoryId !== 'all') {
      countQuery = countQuery.eq('category_id', categoryId);
    }

    if (isFeatured === 'true') {
      countQuery = countQuery.gt('stock_quantity', 10);
    }

    const { count, error: countError } = await countQuery;

    if (countError) {
      console.error('Error counting products:', countError);
      return NextResponse.json(
        { error: 'Failed to count products' },
        { status: 500 }
      );
    }

    // Then get the actual products with pagination
    let query = supabase
      .from('products')
      .select('*')
      .eq('is_active', true)
      .order('created_at', { ascending: false })
      .range(offset, offset + itemsPerPage - 1);

    // Filter by category if specified
    if (categoryId && categoryId !== 'all') {
      query = query.eq('category_id', categoryId);
    }

    // Filter featured products (for now, we'll use stock_quantity > 10 as featured)
    if (isFeatured === 'true') {
      query = query.gt('stock_quantity', 10);
    }

    // Apply limit if specified (for non-paginated requests)
    if (limit && !page) {
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

    // Return products with pagination info if page is specified
    if (page) {
      return NextResponse.json({ 
        products, 
        total: count || 0,
        page: currentPage,
        totalPages: Math.ceil((count || 0) / itemsPerPage)
      });
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
