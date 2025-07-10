// components/storyblok/Fallback.tsx

interface FallbackProps {
  blok: {
    component: string;
    [key: string]: any;
  };
}

export default function Fallback({ blok }: FallbackProps) {
  return (
    <div className="border-2 border-dashed border-red-300 bg-red-50 p-8 text-center">
      <h3 className="text-lg font-semibold text-red-800">
        Missing Component: {blok.component}
      </h3>
      <p className="text-red-600 mt-2">
        This component needs to be created in components/storyblok/{blok.component}.tsx
      </p>
      <details className="mt-4 text-left">
        <summary className="cursor-pointer text-red-700 font-medium">
          Component Data (for debugging)
        </summary>
        <pre className="mt-2 text-xs bg-red-100 p-2 rounded overflow-auto">
          {JSON.stringify(blok, null, 2)}
        </pre>
      </details>
    </div>
  );
}