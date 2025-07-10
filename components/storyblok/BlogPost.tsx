// components/storyblok/BlogPost.tsx
import { storyblokEditable } from '@storyblok/react/rsc';
import { richTextResolver } from '@storyblok/richtext';
import { getProducts } from '@/lib/shopify';
import Link from 'next/link';
import { GridTileImage } from '@/components/grid/tile';
import Price from '@/components/price';
import { StoryblokAsset } from '@/lib/storyblok';

interface BlogPostProps {
  blok: {
    _uid: string;
    component: string;
    title?: string;
    excerpt?: string;
    content?: any; // Rich text
    featured_image?: StoryblokAsset;
    author?: string;
    publish_date?: string;
    tags?: string[];
    featured_products?: string[]; // Product handles
    seo?: {
      title?: string;
      description?: string;
    };
  };
}

export default async function BlogPost({ blok }: BlogPostProps) {
  // Fetch featured products if specified
  let featuredProducts: any[] = [];

  if (!blok) {
  return <div>No blok provided</div>;
}

  if (blok.featured_products && blok.featured_products.length > 0) {
    const allProducts = await getProducts({});
    featuredProducts = allProducts.filter(p => 
      blok.featured_products?.includes(p.handle)
    );
  }

  return (
    <article {...storyblokEditable(blok)} className="py-16">
      <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
        {/* Article Header */}
        <header className="mb-12">
          {blok.featured_image && (
            <img
              src={blok.featured_image.filename}
              alt={blok.featured_image.alt || blok.title}
              className="mb-8 h-96 w-full rounded-lg object-cover"
            />
          )}
          
          {blok.title && (
            <h1 className="mb-4 text-4xl font-bold tracking-tight text-gray-900 sm:text-5xl">
              {blok.title}
            </h1>
          )}
          
          {blok.excerpt && (
            <p className="mb-6 text-xl text-gray-600">{blok.excerpt}</p>
          )}
          
          <div className="flex flex-wrap items-center gap-6 text-sm text-gray-500">
            {blok.author && (
              <span>By {blok.author}</span>
            )}
            {blok.publish_date && (
              <time dateTime={blok.publish_date}>
                {new Date(blok.publish_date).toLocaleDateString('en-US', {
                  year: 'numeric',
                  month: 'long',
                  day: 'numeric'
                })}
              </time>
            )}
            {blok.tags && blok.tags.length > 0 && (
              <div className="flex gap-2">
                {blok.tags.map((tag, index) => (
                  <span
                    key={index}
                    className="rounded-full bg-gray-100 px-3 py-1 text-xs font-medium text-gray-800"
                  >
                    {tag}
                  </span>
                ))}
              </div>
            )}
          </div>
        </header>

        {/* Article Content */}
        {blok.content && (
          <div 
            className="prose prose-lg max-w-none text-gray-700 prose-headings:text-gray-900 prose-links:text-gray-900 prose-strong:text-gray-900"
            dangerouslySetInnerHTML={{ 
              __html: richTextResolver(blok.content) 
            }}
          />
        )}

        {/* Featured Products Section */}
        {featuredProducts.length > 0 && (
          <section className="mt-16 border-t border-gray-200 pt-16">
            <h2 className="mb-8 text-2xl font-bold text-gray-900">Featured Products</h2>
            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {featuredProducts.map((product) => (
                <Link key={product.id} href={`/product/${product.handle}`} className="group">
                  <div className="aspect-square overflow-hidden rounded-lg bg-gray-100">
                    <GridTileImage
                      alt={product.title}
                      src={product.featuredImage?.url}
                      fill
                      sizes="(min-width: 1024px) 33vw, (min-width: 640px) 50vw, 100vw"
                      className="object-cover transition-all duration-300 group-hover:scale-105"
                    />
                  </div>
                  
                  <div className="mt-4 space-y-2">
                    <h3 className="text-lg font-medium text-gray-900 group-hover:text-gray-700">
                      {product.title}
                    </h3>
                    <Price
                      amount={product.priceRange.maxVariantPrice.amount}
                      currencyCode={product.priceRange.maxVariantPrice.currencyCode}
                      className="text-lg font-medium text-gray-900"
                    />
                  </div>
                </Link>
              ))}
            </div>
          </section>
        )}
      </div>
    </article>
  );
}