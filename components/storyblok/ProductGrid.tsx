import { storyblokEditable } from '@storyblok/react/rsc';
import { richTextResolver } from '@storyblok/richtext';
import { getProducts, getCollection } from '@/lib/shopify';
import Link from 'next/link';
import { GridTileImage } from '@/components/grid/tile';
import Price from '@/components/price';

interface ProductGridProps {
  blok: {
    _uid: string;
    component: string;
    title?: string;
    description?: any; // Rich text
    products?: string[]; // Array of product handles
    collection_handle?: string; // Alternative: fetch from collection
    layout?: 'grid' | 'carousel';
    columns?: '2' | '3' | '4' | '5';
    max_products?: number;
    show_description?: boolean;
    background_color?: string;
  };
}

export default async function ProductGrid({ blok }: ProductGridProps) {
  let products = [];
  
  // Fetch products based on configuration
  if (!blok.collection_handle) {
    return <div>No collection handle provided</div>;
  }
  if (blok.collection_handle) {
    // Fetch from Shopify collection
    const allProducts = await getProducts({
    query: `collection:${blok.collection_handle}`
  });
  
  // Limit products based on the max_products setting
    products = allProducts.slice(0, blok.max_products || 6);
  } else if (blok.products && blok.products.length > 0) {
    // Fetch specific products by handle
    const allProducts = await getProducts({});
    products = allProducts.filter(p => 
      blok.products?.includes(p.handle)
    );
  } else {
    // Fallback: fetch recent products
    const result = await getProducts({});
    products = result;
  }

  // Limit products if specified
  if (blok.max_products) {
    products = products.slice(0, blok.max_products);
  }

  const gridCols = {
    '2': 'grid-cols-1 sm:grid-cols-2',
    '3': 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-3',
    '4': 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-4',
    '5': 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-5'
  };

  const backgroundClass = blok.background_color 
    ? `bg-${blok.background_color}` 
    : 'bg-white';

  if (blok.layout === 'carousel') {
    return (
      <section 
        {...storyblokEditable(blok)} 
        className={`py-16 ${backgroundClass}`}
      >
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          {/* Header */}
          {(blok.title || blok.description) && (
            <div className="mb-12 text-center">
              {blok.title && (
                <h2 className="text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl">
                  {blok.title}
                </h2>
              )}
              {blok.description && (
                <div 
                  className="mx-auto mt-4 max-w-3xl text-lg text-gray-600"
                  dangerouslySetInnerHTML={{ 
                    __html: richTextResolver(blok.description) 
                  }}
                />
              )}
            </div>
          )}

          {/* Carousel */}
          <div className="overflow-x-auto pb-4">
            <div className="flex gap-6" style={{ width: `${products.length * 280}px` }}>
              {products.map((product, index) => (
                <div key={product.id} className="w-64 flex-shrink-0">
                  <ProductCard product={product} showDescription={blok.show_description} />
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section 
      {...storyblokEditable(blok)} 
      className={`py-16 ${backgroundClass}`}
    >
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Header */}
        {(blok.title || blok.description) && (
          <div className="mb-12 text-center">
            {blok.title && (
              <h2 className="text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl">
                {blok.title}
              </h2>
            )}
            {blok.description && (
              <div 
                className="mx-auto mt-4 max-w-3xl text-lg text-gray-600"
                dangerouslySetInnerHTML={{ 
                  __html: richTextResolver(blok.description) 
                }}
              />
            )}
          </div>
        )}

        {/* Grid */}
        <div className={`grid gap-6 ${gridCols[blok.columns || '4']}`}>
          {products.map((product, index) => (
            <ProductCard 
              key={product.id} 
              product={product} 
              showDescription={blok.show_description}
            />
          ))}
        </div>

        {/* Show more link if collection */}
        {blok.collection_handle && products.length >= (blok.max_products || 8) && (
          <div className="mt-12 text-center">
            <Link
              href={`/search/${blok.collection_handle}`}
              className="inline-flex items-center rounded-md border border-transparent bg-gray-900 px-6 py-3 text-base font-medium text-white hover:bg-gray-800"
            >
              View All Products
            </Link>
          </div>
        )}
      </div>
    </section>
  );
}

// Reusable Product Card Component
function ProductCard({ 
  product, 
  showDescription = false 
}: { 
  product: any;
  showDescription?: boolean;
}) {
  return (
    <Link href={`/product/${product.handle}`} className="group">
      <div className="aspect-square overflow-hidden rounded-lg bg-gray-100">
        <GridTileImage
          alt={product.title}
          src={product.featuredImage?.url}
          fill
          sizes="(min-width: 768px) 33vw, (min-width: 640px) 50vw, 100vw"
          className="object-cover transition-all duration-300 group-hover:scale-105"
        />
      </div>
      
      <div className="mt-4 space-y-2">
        <h3 className="text-sm font-medium text-gray-900 group-hover:text-gray-700">
          {product.title}
        </h3>
        
        {showDescription && product.description && (
          <p className="text-sm text-gray-600 line-clamp-2">
            {product.description.replace(/<[^>]*>/g, '').substring(0, 100)}...
          </p>
        )}
        
        <Price
          amount={product.priceRange.maxVariantPrice.amount}
          currencyCode={product.priceRange.maxVariantPrice.currencyCode}
          className="text-sm font-medium text-gray-900"
        />
      </div>
    </Link>
  );
}