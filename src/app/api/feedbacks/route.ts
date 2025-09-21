import { NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';

export async function GET() {
  try {
    const { data: feedbacks, error } = await supabase
      .from('user_feedbacks')
      .select(`
        id,
        user_name,
        user_email,
        rating,
        comment,
        created_at,
        product_id,
        products(name, image_url)
      `)
      .eq('is_active', true)
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Error fetching feedbacks:', error);
      return NextResponse.json({ error: 'Failed to fetch feedbacks' }, { status: 500 });
    }

    return NextResponse.json({ feedbacks });
  } catch (error) {
    console.error('Error in feedbacks API:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
