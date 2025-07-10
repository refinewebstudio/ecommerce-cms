
// components/storyblok/CtaButton.tsx
import { storyblokEditable } from '@storyblok/react/rsc';
import Link from 'next/link';

interface CtaButtonProps {
  blok: {
    _uid: string;
    component: string;
    text?: string;
    url?: string;
    style?: string;
    size?: string;
  };
}

export default function CtaButton({ blok }: CtaButtonProps) {
  if (!blok.text || !blok.url) {
    return null;
  }

  const baseClasses = "inline-flex items-center rounded-md font-medium transition-all duration-200";
  
  // Size classes
  const sizeClasses = {
    small: "px-4 py-2 text-sm",
    medium: "px-6 py-3 text-base", 
    large: "px-8 py-4 text-lg"
  };

  // Style classes
  const styleClasses = {
    primary: "bg-gray-900 text-white hover:bg-gray-800",
    secondary: "bg-white text-gray-900 hover:bg-gray-100",
    outline: "border-2 border-current bg-transparent hover:bg-current hover:text-white"
  };

  const size = (blok.size as keyof typeof sizeClasses) || 'medium';
  const style = (blok.style as keyof typeof styleClasses) || 'primary';

  return (
    <Link
      {...storyblokEditable(blok)}
      href={blok.url}
      className={`${baseClasses} ${sizeClasses[size]} ${styleClasses[style]}`}
    >
      {blok.text}
    </Link>
  );
}