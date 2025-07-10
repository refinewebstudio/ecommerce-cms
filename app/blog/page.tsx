
// app/blog/page.tsx - Blog listing page
import { getStoryblokStories } from '@/lib/storyblok';
import Link from 'next/link';
import { StoryblokAsset } from '@/lib/storyblok';

interface BlogPost {
  id: number;
  slug: string;
  name: string;
  content: {
    title?: string;
    excerpt?: string;
    featured_image?: StoryblokAsset;
    author?: string;
    publish_date?: string;
    tags?: string[];
  };
}

export default async function BlogPage() {
  const { stories } = await getStoryblokStories('blog/');

  return (
    <div className="py-16">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="mb-12 text-center">
          <h1 className="text-4xl font-bold tracking-tight text-gray-900 sm:text-5xl">
            Our Blog
          </h1>
          <p className="mx-auto mt-4 max-w-3xl text-lg text-gray-600">
            Discover insights, tips, and stories about our products and the lifestyle they enable.
          </p>
        </div>

        <div className="grid grid-cols-1 gap-8 lg:grid-cols-3">
          {stories.map((story: BlogPost) => (
            <article key={story.id} className="group">
              <Link href={`/${story.slug}`}>
                {story.content.featured_image && (
                  <div className="aspect-video overflow-hidden rounded-lg bg-gray-100">
                    <img
                      src={story.content.featured_image.filename}
                      alt={story.content.featured_image.alt || story.content.title}
                      className="h-full w-full object-cover transition-all duration-300 group-hover:scale-105"
                    />
                  </div>
                )}
                
                <div className="mt-6">
                  <h2 className="text-xl font-semibold text-gray-900 group-hover:text-gray-700">
                    {story.content.title || story.name}
                  </h2>
                  
                  {story.content.excerpt && (
                    <p className="mt-2 text-gray-600 line-clamp-3">
                      {story.content.excerpt}
                    </p>
                  )}
                  
                  <div className="mt-4 flex items-center gap-4 text-sm text-gray-500">
                    {story.content.author && (
                      <span>By {story.content.author}</span>
                    )}
                    {story.content.publish_date && (
                      <time dateTime={story.content.publish_date}>
                        {new Date(story.content.publish_date).toLocaleDateString()}
                      </time>
                    )}
                  </div>
                  
                  {story.content.tags && story.content.tags.length > 0 && (
                    <div className="mt-3 flex flex-wrap gap-2">
                      {story.content.tags.slice(0, 3).map((tag, index) => (
                        <span
                          key={index}
                          className="rounded-full bg-gray-100 px-2 py-1 text-xs font-medium text-gray-800"
                        >
                          {tag}
                        </span>
                      ))}
                    </div>
                  )}
                </div>
              </Link>
            </article>
          ))}
        </div>
      </div>
    </div>
  );
}