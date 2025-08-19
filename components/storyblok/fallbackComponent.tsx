// components/storyblok/FallbackComponent.tsx - For debugging unregistered components
import { storyblokEditable } from '@storyblok/react/rsc';

interface FallbackProps {
  blok: {
    _uid: string;
    component: string;
    [key: string]: any;
  };
}

export default function FallbackComponent({ blok }: FallbackProps) {
  return (
    <div {...storyblokEditable(blok)} className="border-2 border-red-500 bg-red-50 p-4 m-4">
      <h3 className="text-red-700 font-bold">⚠️ Unregistered Component: {blok.component}</h3>
      <details className="mt-2">
        <summary className="cursor-pointer text-red-600">View component data</summary>
        <pre className="mt-2 text-xs bg-white p-2 border rounded overflow-auto">
          {JSON.stringify(blok, null, 2)}
        </pre>
      </details>
    </div>
  );
}