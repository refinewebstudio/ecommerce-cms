import { storyblokEditable } from '@storyblok/react/rsc';
import { richTextResolver } from '@storyblok/richtext';
import { getCollection, getProducts } from '@/lib/shopify';
import Link from 'next/link';
import { GridTileImage } from '@/components/grid/tile';
import Price from '@/components/price';
import { StoryblokAsset } from '@/lib/storyblok';

interface CollectionShowcaseProps {
  blok: {
    _uid: string;
    component: string;
    collection_handle: string;
    title?: string;
    description?: any; // Rich text
    custom_image?: StoryblokAsset;
    layout?: 'cards' | 'banner' | 'grid';
    max_products?: number;
    show_collection_link?: boolean;
    background_color?: string;
  };
}

export default async function CollectionShowcase({ blok }: CollectionShowcaseProps) {
  const { render } = richTextResolver()
  if (!blok.collection_handle) {
    return (
      <div {...storyblokEditable(blok)} className="py-8">
        <p className="text-center text-gray-500">No collection selected</p>
      </div>
    );
  }

  if (!blok.collection_handle) {
    return <div>No collection handle provided</div>;
  }

  const collection = await getCollection(blok.collection_handle);

  const allProducts = await getProducts({
    query: `collection:${blok.collection_handle}`
  });
  
  // Limit products based on the max_products setting
  const products = allProducts.slice(0, blok.max_products || 6);
  
  if (!collection) {
    return (
      <div {...storyblokEditable(blok)} className="py-8">
        <p className="text-center text-red-500">Collection not found: {blok.collection_handle}</p>
      </div>
    );
  }

  const backgroundClass = blok.background_color 
    ? `bg-${blok.background_color}` 
    : 'bg-white';

  if (blok.layout === 'banner') {
    return (
      <section 
        {...storyblokEditable(blok)} 
        className={`py-16 ${backgroundClass}`}
      >
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 gap-8 lg:grid-cols-2 lg:gap-16">
            {/* Collection Info */}
            <div className="flex flex-col justify-center space-y-6">
              <h2 className="text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl">
                {blok.title || collection.title}
              </h2>
              
              {blok.description ? (
                <div 
                  className="text-lg text-gray-600"
                  dangerouslySetInnerHTML={{ 
                    __html: render(blok.description) as string
                  }}
                />
              ) : collection.description && (
                <p className="text-lg text-gray-600">{collection.description}</p>
              )}

              {blok.show_collection_link && (
                <div>
                  <Link
                    href={`/search/${collection.handle}`}
                    className="inline-flex items-center rounded-md bg-gray-900 px-6 py-3 text-base font-medium text-white hover:bg-gray-800"
                  >
                    Shop {collection.title}
                  </Link>
                </div>
              )}
            </div>

            {/* Collection Image */}
            <div className="relative">
              <img
                src={blok.custom_image?.filename || collection.image?.src || '/placeholder.jpg'}
                alt={blok.custom_image?.alt || collection.title}
                className="h-96 w-full rounded-lg object-cover lg:h-full"
              />
            </div>
          </div>
        </div>
      </section>
    );
  }

  if (blok.layout === 'cards') {
    return (
      <section 
        {...storyblokEditable(blok)} 
        className={`py-16 ${backgroundClass}`}
      >
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          {/* Header */}
          <div className="mb-12 text-center">
            <h2 className="text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl">
              {blok.title || collection.title}
            </h2>
            {(blok.description || collection.description) && (
              <div className="mx-auto mt-4 max-w-3xl text-lg text-gray-600">
                {blok.description ? (
                  <div dangerouslySetInnerHTML={{ 
                    __html: render(blok.description) as string
                  }} />
                ) : (
                  <p>{collection.description}</p>
                )}
              </div>
            )}
          </div>

          {/* Product Cards */}
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {products.map((product) => (
              <div key={product.id} className="group">
                <Link href={`/product/${product.handle}`}>
                  <div className="aspect-square overflow-hidden rounded-lg bg-gray-100">
                    <GridTileImage
                      alt={product.title}
                      src={product.featuredImage?.src}
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
              </div>
            ))}
          </div>

          {blok.show_collection_link && (
            <div className="mt-12 text-center">
              <Link
                href={`/search/${collection.handle}`}
                className="inline-flex items-center rounded-md border border-transparent bg-gray-900 px-6 py-3 text-base font-medium text-white hover:bg-gray-800"
              >
                View All {collection.title}
              </Link>
            </div>
          )}
        </div>
      </section>
    );
  }

  // Default grid layout
  return (
    <section 
      {...storyblokEditable(blok)} 
      className={`py-16 ${backgroundClass}`}
    >
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-12">
          <h2 className="text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl">
            {blok.title || collection.title}
          </h2>
          {(blok.description || collection.description) && (
            <div className="mt-4 text-lg text-gray-600">
              {blok.description ? (
                <div dangerouslySetInnerHTML={{ 
                  __html: render(blok.description) as string
                }} />
              ) : (
                <p>{collection.description}</p>
              )}
            </div>
          )}
        </div>

        {/* Grid */}
        <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
          {products.map((product) => (
            <Link key={product.id} href={`/product/${product.handle}`} className="group">
              <div className="aspect-square overflow-hidden rounded-lg bg-gray-100">
                <GridTileImage
                  alt={product.title}
                  src={product.featuredImage?.src}
                  fill
                  sizes="(min-width: 1024px) 25vw, (min-width: 768px) 33vw, (min-width: 640px) 50vw, 50vw"
                  className="object-cover transition-all duration-300 group-hover:scale-105"
                />
              </div>
              
              <div className="mt-2">
                <h3 className="text-sm font-medium text-gray-900 group-hover:text-gray-700 line-clamp-1">
                  {product.title}
                </h3>
                <Price
                  amount={product.priceRange.maxVariantPrice.amount}
                  currencyCode={product.priceRange.maxVariantPrice.currencyCode}
                  className="text-sm text-gray-600"
                />
              </div>
            </Link>
          ))}
        </div>

        {blok.show_collection_link && (
          <div className="mt-8">
            <Link
              href={`/search/${collection.handle}`}
              className="text-sm font-medium text-gray-900 hover:text-gray-700"
            >
              View all {collection.title} →
            </Link>
          </div>
        )}
      </div>
    </section>
  );
}

