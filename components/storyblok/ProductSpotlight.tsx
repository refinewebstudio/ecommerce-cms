import { storyblokEditable } from '@storyblok/react/rsc';
import { richTextResolver } from '@storyblok/richtext';
import { getProduct } from '@/lib/shopify';
import { AddToCart } from '@/components/cart/add-to-cart';
import Price from '@/components/price';
import { Gallery } from '@/components/product/gallery';
import { StoryblokAsset } from '@/lib/storyblok';
import { ProductProvider } from '@/components/product/product-context';
import Image from 'next/image';


interface ProductSpotlightProps {
  blok: {
    _uid: string;
    component: string;
    product_handle: string;
    headline?: string;
    editorial_content?: any; // Rich text from Storyblok
    layout?: 'left' | 'right' | 'center';
    background_color?: string;
    lifestyle_images?: StoryblokAsset[];
    show_variants?: boolean;
    custom_cta?: string;
  };
}

export default async function ProductSpotlight({ blok }: ProductSpotlightProps) {
  const { render } = richTextResolver()

  if (!blok.product_handle) {
    return (
      <div {...storyblokEditable(blok)} className="py-8">
        <p className="text-center text-gray-500">No product selected</p>
      </div>
    );
  }

  const product = await getProduct(blok.product_handle);
  
  if (!product) {
    return (
      <div {...storyblokEditable(blok)} className="py-8">
        <p className="text-center text-red-500">Product not found: {blok.product_handle}</p>
      </div>
    );
  }

  const layoutClass = {
    left: 'lg:flex-row',
    right: 'lg:flex-row-reverse', 
    center: 'lg:flex-col lg:items-center lg:text-center'
  };

  const backgroundClass = blok.background_color 
    ? `bg-${blok.background_color}` 
    : 'bg-white';

     // Transform product images to the format Gallery expects
  const galleryImages = product.images.map(image => ({
    src: image.url,
    altText: image.altText || product.title
  }));

  console.log(galleryImages)

  return (
    <section 
      {...storyblokEditable(blok)} 
      className={`py-16 ${backgroundClass}`}
    >
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className={`flex flex-col gap-8 lg:gap-16 ${layoutClass[blok.layout || 'left']}`}>
          
          {/* Product Images */}
          <div className="flex-1">
            {blok.lifestyle_images && blok.lifestyle_images.length > 0 ? (
              // Use custom lifestyle images from Storyblok
              <div className="grid grid-cols-1 gap-4">
                {blok.lifestyle_images.map((image, index) => (
                  <Image
                     key={index}
                    src={image.filename}
                    alt={image.alt || product.title}
                    width={600}
                    height={400}
                    className="h-96 w-full rounded-lg object-cover"
                  />
                ))}
              </div>
            ) : (
              // Fallback to Shopify product images
              <ProductProvider>
                <Gallery images={galleryImages} />
              </ProductProvider>
              
            )}
          </div>

          {/* Product Content */}
          <div className="flex-1 space-y-6">
            {blok.headline && (
              <h2 className="text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl">
                {blok.headline}
              </h2>
            )}
            
            <h3 className="text-2xl font-semibold text-gray-900">
              {product.title}
            </h3>
            
            <Price
              amount={product.priceRange.maxVariantPrice.amount}
              currencyCode={product.priceRange.maxVariantPrice.currencyCode}
              className="text-2xl font-bold"
            />

            {/* Editorial content from Storyblok */}
            {blok.editorial_content && (
              <div 
                className="prose prose-lg text-gray-600"
                dangerouslySetInnerHTML={{ 
                  __html: render(blok.editorial_content)  as string
                }}
              />
            )}

            {/* Product description from Shopify */}
            {product.description && (
              <div 
                className="text-gray-600"
                dangerouslySetInnerHTML={{ __html: product.description }}
              />
            )}

            {/* Product variants */}
            {blok.show_variants && product.variants.length > 1 && (
              <div className="space-y-4">
                <h4 className="font-medium text-gray-900">Available Options:</h4>
                <div className="flex flex-wrap gap-2">
                  {product.variants.slice(0, 6).map((variant) => (
                    <span
                      key={variant.id}
                      className="rounded-md border border-gray-300 px-3 py-1 text-sm"
                    >
                      {variant.title}
                    </span>
                  ))}
                </div>
              </div>
            )}

            {/* Add to cart */}
            <div className="flex flex-col gap-4 sm:flex-row">
              
              <ProductProvider>
                <AddToCart product={product} />
              </ProductProvider>
               
              
              <button className="flex-1 rounded-md border border-gray-300 bg-white px-6 py-3 text-sm font-medium text-gray-900 hover:bg-gray-50">
                Learn More
              </button>
            </div>

            {/* Additional product info */}
            <div className="border-t border-gray-200 pt-6">
              <div className="grid grid-cols-2 gap-4 text-sm text-gray-600">
                <div>
                  <span className="font-medium">SKU:</span> {product.variants[0]?.sku || 'N/A'}
                </div>
                <div>
                  <span className="font-medium">Availability:</span>{' '}
                  <span className={product.availableForSale ? 'text-green-600' : 'text-red-600'}>
                    {product.availableForSale ? 'In Stock' : 'Out of Stock'}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}


