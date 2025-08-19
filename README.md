[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https%3A%2F%2Fgithub.com%2Fvercel%2Fcommerce&project-name=commerce&repo-name=commerce&demo-title=Next.js%20Commerce&demo-url=https%3A%2F%2Fdemo.vercel.store&demo-image=https%3A%2F%2Fbigcommerce-demo-asset-ksvtgfvnd.vercel.app%2Fbigcommerce.png&env=COMPANY_NAME,SHOPIFY_REVALIDATION_SECRET,SHOPIFY_STORE_DOMAIN,SHOPIFY_STOREFRONT_ACCESS_TOKEN,SITE_NAME)

# Next.js Commerce

A high-performance, server-rendered Next.js App Router ecommerce application.

This template uses React Server Components, Server Actions, `Suspense`, `useOptimistic`, and more.

<h3 id="v1-note"></h3>

> Note: Looking for Next.js Commerce v1? View the [code](https://github.com/vercel/commerce/tree/v1), [demo](https://commerce-v1.vercel.store), and [release notes](https://github.com/vercel/commerce/releases/tag/v1).

## Providers

Vercel will only be actively maintaining a Shopify version [as outlined in our vision and strategy for Next.js Commerce](https://github.com/vercel/commerce/pull/966).

Vercel is happy to partner and work with any commerce provider to help them get a similar template up and running and listed below. Alternative providers should be able to fork this repository and swap out the `lib/shopify` file with their own implementation while leaving the rest of the template mostly unchanged.

- Shopify (this repository)
- [BigCommerce](https://github.com/bigcommerce/nextjs-commerce) ([Demo](https://next-commerce-v2.vercel.app/))
- [Ecwid by Lightspeed](https://github.com/Ecwid/ecwid-nextjs-commerce/) ([Demo](https://ecwid-nextjs-commerce.vercel.app/))
- [Geins](https://github.com/geins-io/vercel-nextjs-commerce) ([Demo](https://geins-nextjs-commerce-starter.vercel.app/))
- [Medusa](https://github.com/medusajs/vercel-commerce) ([Demo](https://medusa-nextjs-commerce.vercel.app/))
- [Prodigy Commerce](https://github.com/prodigycommerce/nextjs-commerce) ([Demo](https://prodigy-nextjs-commerce.vercel.app/))
- [Saleor](https://github.com/saleor/nextjs-commerce) ([Demo](https://saleor-commerce.vercel.app/))
- [Shopware](https://github.com/shopwareLabs/vercel-commerce) ([Demo](https://shopware-vercel-commerce-react.vercel.app/))
- [Swell](https://github.com/swellstores/verswell-commerce) ([Demo](https://verswell-commerce.vercel.app/))
- [Umbraco](https://github.com/umbraco/Umbraco.VercelCommerce.Demo) ([Demo](https://vercel-commerce-demo.umbraco.com/))
- [Wix](https://github.com/wix/headless-templates/tree/main/nextjs/commerce) ([Demo](https://wix-nextjs-commerce.vercel.app/))
- [Fourthwall](https://github.com/FourthwallHQ/vercel-commerce) ([Demo](https://vercel-storefront.fourthwall.app/))

> Note: Providers, if you are looking to use similar products for your demo, you can [download these assets](https://drive.google.com/file/d/1q_bKerjrwZgHwCw0ovfUMW6He9VtepO_/view?usp=sharing).

## Integrations

Integrations enable upgraded or additional functionality for Next.js Commerce

- [Orama](https://github.com/oramasearch/nextjs-commerce) ([Demo](https://vercel-commerce.oramasearch.com/))

  - Upgrades search to include typeahead with dynamic re-rendering, vector-based similarity search, and JS-based configuration.
  - Search runs entirely in the browser for smaller catalogs or on a CDN for larger.

- [React Bricks](https://github.com/ReactBricks/nextjs-commerce-rb) ([Demo](https://nextjs-commerce.reactbricks.com/))
  - Edit pages, product details, and footer content visually using [React Bricks](https://www.reactbricks.com) visual headless CMS.

## Running locally

You will need to use the environment variables [defined in `.env.example`](.env.example) to run Next.js Commerce. It's recommended you use [Vercel Environment Variables](https://vercel.com/docs/concepts/projects/environment-variables) for this, but a `.env` file is all that is necessary.

> Note: You should not commit your `.env` file or it will expose secrets that will allow others to control your Shopify store.

1. Install Vercel CLI: `npm i -g vercel`
2. Link local instance with Vercel and GitHub accounts (creates `.vercel` directory): `vercel link`
3. Download your environment variables: `vercel env pull`

```bash
pnpm install
pnpm dev
```

Your app should now be running on [localhost:3000](http://localhost:3000/).

<details>
  <summary>Expand if you work at Vercel and want to run locally and / or contribute</summary>

1. Run `vc link`.
1. Select the `Vercel Solutions` scope.
1. Connect to the existing `commerce-shopify` project.
1. Run `vc env pull` to get environment variables.
1. Run `pnpm dev` to ensure everything is working correctly.
</details>

## Vercel, Next.js Commerce, and Shopify Integration Guide

You can use this comprehensive [integration guide](https://vercel.com/docs/integrations/ecommerce/shopify) with step-by-step instructions on how to configure Shopify as a headless CMS using Next.js Commerce as your headless Shopify storefront on Vercel.

## Storyblok integration and default pages

## eCommerce Site Pages

This table outlines the baseline pages needed for an eCommerce site and which tool to use for each page type.

## Page Management by Tool

| Page Type              | Specific Pages                                                                                                                   | Tool      | Reason                                                  |
| ---------------------- | -------------------------------------------------------------------------------------------------------------------------------- | --------- | ------------------------------------------------------- |
| **Homepage**           | Homepage (`/`)                                                                                                                   | Storyblok | Marketing content, customizable sections, A/B testing   |
| **Product Pages**      | Individual product pages (`/products/*`)                                                                                         | Shopify   | Product data, inventory, variants, checkout integration |
| **Collection Pages**   | Category/collection listings (`/collections/*`)                                                                                  | Shopify   | Product filtering, sorting, dynamic inventory           |
| **Search Results**     | Search page (`/search`)                                                                                                          | Shopify   | Product search, filters, real-time inventory            |
| **Cart & Checkout**    | Cart (`/cart`)<br>Checkout process                                                                                               | Shopify   | Secure payments, tax calculation, order processing      |
| **Account Pages**      | Login (`/account/login`)<br>Register (`/account/register`)<br>Account dashboard (`/account`)                                     | Shopify   | User authentication, order history, account management  |
| **Legal/Policy Pages** | Privacy Policy (`/privacy-policy`)<br>Terms of Service (`/terms`)<br>Return Policy (`/returns`)<br>Shipping Policy (`/shipping`) | Storyblok | Content management, easy updates, compliance            |
| **Marketing Pages**    | About Us (`/about`)<br>Contact (`/contact`)<br>Brand Story                                                                       | Storyblok | Rich content, media, customizable layouts               |
| **Blog/Content**       | Blog listing (`/blog`)<br>Blog posts (`/blog/*`)                                                                                 | Storyblok | Content marketing, SEO, editorial workflow              |
| **Customer Service**   | FAQ (`/faq`)<br>Size Guide (`/size-guide`)<br>Care Instructions                                                                  | Storyblok | Searchable content, rich formatting                     |
| **Landing Pages**      | Campaign pages<br>Seasonal promotions<br>Product launches                                                                        | Storyblok | A/B testing, rapid deployment, marketing campaigns      |

## Tool Summary

### Storyblok Pages (Marketing & Content)

- ✅ Rich content editing
- ✅ Visual editor
- ✅ A/B testing capabilities
- ✅ Custom components
- ✅ SEO optimization

### Shopify Pages (eCommerce Functions)

- ✅ Product data integration
- ✅ Inventory management
- ✅ Secure checkout
- ✅ Payment processing
- ✅ Order management

## Implementation Notes

1. **Dynamic Routing**: Use `app/[slug]/page.tsx` to handle both Shopify and Storyblok pages
2. **Priority Order**: Check Shopify first for product/commerce pages, fallback to Storyblok for content pages
3. **Preview Mode**: Ensure Storyblok pages support visual editing in preview mode
4. **SEO**: Both tools should generate proper metadata for their respective page types

# eCommerce Site Functionality Requirements

This checklist outlines the essential functionality needed for a complete eCommerce site.

## Core eCommerce Features

| Feature                      | Status | Implementation     | Priority |
| ---------------------------- | ------ | ------------------ | -------- |
| **Product Catalog**          | ✅     | Shopify            | High     |
| **Shopping Cart**            | ✅     | Shopify            | High     |
| **Checkout Process**         | ✅     | Shopify            | High     |
| **Payment Processing**       | ✅     | Shopify Payments   | High     |
| **Order Management**         | ✅     | Shopify Admin      | High     |
| **Inventory Management**     | ✅     | Shopify            | High     |
| **Product Search & Filters** | ✅     | Shopify            | High     |
| **User Accounts**            | ✅     | Shopify            | Medium   |
| **Wishlist/Favorites**       | ⏳     | Custom/Shopify App | Medium   |

## Content Management

| Feature           | Status | Implementation | Priority |
| ----------------- | ------ | -------------- | -------- |
| **Homepage CMS**  | ✅     | Storyblok      | High     |
| **Landing Pages** | ✅     | Storyblok      | High     |
| **Blog/Content**  | ✅     | Storyblok      | Medium   |
| **Legal Pages**   | ✅     | Storyblok      | High     |
| **FAQ System**    | ⏳     | Storyblok      | Medium   |
| **A/B Testing**   | ✅     | GrowthBook     | Medium   |

## User Experience & Compliance

| Feature                       | Status | Implementation                 | Priority |
| ----------------------------- | ------ | ------------------------------ | -------- |
| **Cookie Consent Banner**     | ✅     | Custom Component               | High     |
| **GDPR Compliance**           | ⏳     | Cookie Banner + Privacy Policy | High     |
| **Mobile Responsive Design**  | ✅     | Tailwind CSS                   | High     |
| **Accessibility (WCAG)**      | ⏳     | Semantic HTML + ARIA           | Medium   |
| **Error Handling (404, 500)** | ⏳     | Next.js Error Pages            | High     |
| **Loading States**            | ⏳     | React Suspense                 | Medium   |

## Analytics & Tracking

| Feature                    | Status | Implementation         | Priority |
| -------------------------- | ------ | ---------------------- | -------- |
| **Google Analytics 4**     | ✅     | GA4 Integration        | High     |
| **Microsoft Clarity**      | ✅     | Clarity Heatmaps       | Medium   |
| **Conversion Tracking**    | ⏳     | GA4 Enhanced eCommerce | High     |
| **User Behavior Analysis** | ✅     | Clarity + GA4          | Medium   |
| **Performance Monitoring** | ⏳     | Vercel Analytics       | Medium   |

## Marketing & Communication

| Feature                         | Status | Implementation            | Priority |
| ------------------------------- | ------ | ------------------------- | -------- |
| **Contact Forms**               | ⏳     | Storyblok Component + API | High     |
| **Newsletter Signup**           | ⏳     | Mailchimp/ConvertKit      | Medium   |
| **Email Marketing Integration** | ⏳     | Shopify Email/Klaviyo     | Medium   |
| **Social Media Integration**    | ⏳     | Social Share Components   | Low      |
| **Live Chat Support**           | ⏳     | Intercom/Zendesk          | Medium   |
| **Product Reviews**             | ⏳     | Shopify App (Judge.me)    | Medium   |

## SEO & Performance

| Feature                | Status | Implementation           | Priority |
| ---------------------- | ------ | ------------------------ | -------- |
| **Meta Tags & Schema** | ✅     | Next.js Metadata API     | High     |
| **Sitemap Generation** | ⏳     | Next.js Sitemap          | High     |
| **Image Optimization** | ✅     | Next.js Image Component  | High     |
| **Core Web Vitals**    | ⏳     | Performance Optimization | Medium   |
| **Structured Data**    | ⏳     | JSON-LD Schema           | Medium   |

## Security & Data Protection

| Feature             | Status | Implementation                  | Priority |
| ------------------- | ------ | ------------------------------- | -------- |
| **SSL Certificate** | ✅     | Vercel/Cloudflare               | High     |
| **Data Protection** | ⏳     | Privacy Policy + Cookie Consent | High     |
| **Secure Payments** | ✅     | Shopify Secure Checkout         | High     |
| **Rate Limiting**   | ⏳     | API Route Protection            | Medium   |
| **CSRF Protection** | ✅     | Next.js Built-in                | Medium   |

## Development & Deployment

| Feature                    | Status | Implementation      | Priority |
| -------------------------- | ------ | ------------------- | -------- |
| **Environment Management** | ✅     | Vercel Environments | High     |
| **Preview/Staging**        | ✅     | Storyblok Preview   | High     |
| **CI/CD Pipeline**         | ✅     | Vercel Auto-deploy  | High     |
| **Error Monitoring**       | ⏳     | Sentry              | Medium   |
| **Database Backup**        | ✅     | Shopify Built-in    | High     |

## Status Legend

- ✅ **Implemented**: Feature is complete and working
- ⏳ **Planned**: Feature is planned but not yet implemented
- ❌ **Not Required**: Feature is not needed for this project

## Implementation Priority

- **High**: Essential for launch
- **Medium**: Important for user experience
- **Low**: Nice to have features

## Next Steps

1. Implement high-priority missing features (Error handling, Contact forms)
2. Set up analytics tracking and conversion goals
3. Add GDPR compliance features
4. Optimize for Core Web Vitals
5. Implement customer support features
