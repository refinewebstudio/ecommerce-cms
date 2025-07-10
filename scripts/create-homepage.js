// Solution 1: Pure Node.js Script (Recommended)
// scripts/create-homepage.js

require("dotenv").config({ path: ".env.local" });
const StoryblokClient = require("storyblok-js-client");
const storyblok = new StoryblokClient({
  oauthToken: process.env.STORYBLOK_MANAGEMENT_TOKEN,
});

const SPACE_ID = process.env.STORYBLOK_SPACE_ID;

const homepageData = {
  name: "Homepage",
  slug: "home",
  content: {
    component: "page",
    body: [
      {
        component: "hero",
        _uid: "hero-1",
        headline: "Premium Products for Modern Living",
        subheadline: {
          type: "doc",
          content: [
            {
              type: "paragraph",
              content: [
                {
                  type: "text",
                  text: "Discover our carefully curated collection of products designed to enhance your daily life with quality, style, and functionality.",
                },
              ],
            },
          ],
        },
        background_image: {
          filename:
            "https://via.placeholder.com/1920x1080/000000/FFFFFF?text=Hero+Background",
          alt: "Hero background",
        },
        overlay_opacity: 40,
        text_position: "center",
        text_color: "white",
        height: "large",
        primary_cta: {
          text: "Shop Now",
          url: "/search",
          style: "primary",
        },
        secondary_cta: {
          text: "Learn More",
          url: "/about",
          style: "outline",
        },
      },
      {
        component: "product_spotlight",
        _uid: "spotlight-1",
        product_handle: "acme-backpack",
        headline: "The Perfect Travel Companion",
        editorial_content: {
          type: "doc",
          content: [
            {
              type: "paragraph",
              content: [
                {
                  type: "text",
                  text: "Our premium canvas backpack combines durability with style. Whether you're commuting to work or exploring a new city, this backpack has everything you need.",
                },
              ],
            },
          ],
        },
        layout: "left",
        show_variants: true,
        custom_cta: "Get Your Backpack",
      },
      {
        component: "collection_showcase",
        _uid: "collection-1",
        collection_handle: "featured-products",
        title: "Featured Collection",
        description: {
          type: "doc",
          content: [
            {
              type: "paragraph",
              content: [
                {
                  type: "text",
                  text: "Explore our most popular products, carefully selected for their quality, design, and functionality.",
                },
              ],
            },
          ],
        },
        layout: "cards",
        max_products: 6,
        show_collection_link: true,
        background_color: "gray-50",
      },
      {
        component: "product_grid",
        _uid: "grid-1",
        title: "Trending Products",
        description: {
          type: "doc",
          content: [
            {
              type: "paragraph",
              content: [
                {
                  type: "text",
                  text: "Discover what's popular with our customers right now.",
                },
              ],
            },
          ],
        },
        products: [
          "acme-t-shirt-black",
          "acme-hoodie-navy",
          "acme-coffee-mug",
          "acme-water-bottle",
        ],
        layout: "grid",
        columns: "4",
        max_products: 4,
        show_description: false,
      },
      {
        component: "cta_section",
        _uid: "cta-1",
        headline: "Ready to Upgrade Your Lifestyle?",
        description: {
          type: "doc",
          content: [
            {
              type: "paragraph",
              content: [
                {
                  type: "text",
                  text: "Join thousands of customers who have made the switch to premium quality products. Start shopping today and experience the difference.",
                },
              ],
            },
          ],
        },
        primary_button: {
          text: "Shop All Products",
          url: "/search",
        },
        secondary_button: {
          text: "Learn Our Story",
          url: "/about",
        },
        background_color: "gray-900",
      },
    ],
    seo: {
      title: "Acme Store - Premium Products for Modern Living",
      description:
        "Shop premium quality products at Acme Store. Discover our collection of apparel, tech accessories, and lifestyle products with fast free shipping.",
    },
  },
  is_folder: false,
  parent_id: 0,
  default_root: "page",
};

async function createHomepage() {
  try {
    console.log("🚀 Creating homepage in Storyblok...");

    const response = await storyblok.post(`spaces/${SPACE_ID}/stories`, {
      story: homepageData,
      publish: 1,
    });

    console.log("✅ Homepage created successfully!");
    console.log(`📄 Story ID: ${response.data.story.id}`);
    console.log(
      `🔗 View at: https://app.storyblok.com/#!/me/spaces/${SPACE_ID}/stories/0/0/${response.data.story.id}`
    );

    return response.data.story;
  } catch (error) {
    console.error("❌ Error creating homepage:", error.message);

    if (error.response?.data) {
      console.error(
        "📋 Error details:",
        JSON.stringify(error.response.data, null, 2)
      );
    }

    throw error;
  }
}

async function main() {
  try {
    if (!process.env.STORYBLOK_MANAGEMENT_TOKEN) {
      throw new Error("STORYBLOK_MANAGEMENT_TOKEN is required in .env.local");
    }

    if (!process.env.STORYBLOK_SPACE_ID) {
      throw new Error("STORYBLOK_SPACE_ID is required in .env.local");
    }

    console.log("🎯 Starting Storyblok homepage creation...");
    await createHomepage();
    console.log("🎉 Setup complete! Your homepage is ready.");
  } catch (error) {
    console.error("💥 Setup failed:", error.message);
    process.exit(1);
  }
}

main();
