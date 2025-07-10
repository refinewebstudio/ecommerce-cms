
// app/api/preview/route.ts - Storyblok preview endpoint
import { redirect } from 'next/navigation';
import { getStoryblokApi } from '@/lib/storyblok';

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const secret = searchParams.get('secret');
  const slug = searchParams.get('slug');

  // Check the secret and next parameters
  if (secret !== process.env.STORYBLOK_PREVIEW_TOKEN) {
    return new Response('Invalid token', { status: 401 });
  }

  if (!slug) {
    return new Response('Missing slug', { status: 400 });
  }

  // Fetch the headless CMS to check if the provided `slug` exists
  const storyblokApi = getStoryblokApi();
  
  try {
    await storyblokApi.get(`cdn/stories/${slug}`, {
      version: 'draft',
    });
  } catch (error) {
    return new Response('Story not found', { status: 404 });
  }

  // Redirect to the path from the fetched post
  redirect(`/${slug}?_storyblok=${Date.now()}`);
}