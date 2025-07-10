// app/[slug]/opengraph-image.tsx
import OpengraphImage from 'components/opengraph-image';
import { getPage } from 'lib/shopify';
import { getStoryblokStory } from '@/lib/storyblok';

export default async function Image({ params }: { params: Promise<{ slug: string }> }) {
  const resolvedParams = await params;
  let title = 'Page';

  // Try Shopify first (or change order based on your preference)
  try {
    const page = await getPage(resolvedParams.slug);
    if (page) {
      title = page.seo?.title || page.title;
      return await OpengraphImage({ title });
    }
  } catch (error) {
    console.log('Shopify page not found for OG image, trying Storyblok...');
  }

  // Try Storyblok
  try {
    const story = await getStoryblokStory(resolvedParams.slug, false);
    if (story) {
      const seo = story.content.seo;
      title = seo?.title || story.name;
      return await OpengraphImage({ title });
    }
  } catch (error) {
    console.log('Storyblok page not found for OG image');
  }

  // Fallback if neither is found
  return await OpengraphImage({ title: 'Page Not Found' });
}