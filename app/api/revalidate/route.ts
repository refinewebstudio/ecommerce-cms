import { revalidate } from 'lib/shopify';
import { NextRequest, NextResponse } from 'next/server';

export async function POST(req: NextRequest): Promise<NextResponse> {
    console.log('🔄 Webhook received at:', new Date().toISOString());
  console.log('📋 Headers:', req.headers);
  console.log('📦 Method:', req.method);
  return revalidate(req);
}

