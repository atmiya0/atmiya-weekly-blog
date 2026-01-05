import { compile, run } from "@mdx-js/mdx";
import * as runtime from "react/jsx-runtime";
import type { MDXComponents } from "mdx/types";

interface MDXContentProps {
  source: string;
}

// All void HTML elements that must be self-closing in JSX/MDX
const VOID_ELEMENTS = [
  "area", "base", "br", "col", "embed", "hr", "img", "input",
  "link", "meta", "param", "source", "track", "wbr"
];

/**
 * Sanitizes and pre-processes HTML/MDX content to make it safe for compilation.
 * Handles common edge cases that would cause the MDX compiler to fail.
 */
function preprocessSource(source: string): string {
  if (!source || typeof source !== "string") {
    return "";
  }

  let processed = source;

  // 1. Strip dangerous tags (script, style, iframe, object, embed as parent elements)
  processed = processed.replace(/<script\b[^>]*>[\s\S]*?<\/script>/gi, "");
  processed = processed.replace(/<style\b[^>]*>[\s\S]*?<\/style>/gi, "");
  processed = processed.replace(/<iframe\b[^>]*>[\s\S]*?<\/iframe>/gi, "");
  processed = processed.replace(/<object\b[^>]*>[\s\S]*?<\/object>/gi, "");

  // 2. Strip event handlers (onclick, onerror, onload, etc.)
  processed = processed.replace(/\s+on\w+\s*=\s*["'][^"']*["']/gi, "");
  processed = processed.replace(/\s+on\w+\s*=\s*\{[^}]*\}/gi, "");

  // 3. Strip javascript: URLs
  processed = processed.replace(/href\s*=\s*["']javascript:[^"']*["']/gi, 'href="#"');

  // 4. Convert all void elements to self-closing format
  const voidElementPattern = new RegExp(
    `<(${VOID_ELEMENTS.join("|")})([^>]*?)\\s*/?>`,
    "gi"
  );
  processed = processed.replace(voidElementPattern, "<$1$2 />");

  // 5. Escape curly braces that aren't part of JSX expressions
  // This prevents {text} from being interpreted as JSX
  // Only escape standalone curly braces that look like literal text
  processed = processed.replace(/\{([^}]*[^a-zA-Z0-9_}][^}]*)\}/g, "&#123;$1&#125;");

  // 6. Remove HTML comments (they can cause issues)
  processed = processed.replace(/<!--[\s\S]*?-->/g, "");

  // 7. Remove DOCTYPE declarations
  processed = processed.replace(/<!DOCTYPE[^>]*>/gi, "");

  // 8. Handle common HTML entities that might be problematic
  // Convert &nbsp; to regular space (MDX handles this fine, but just in case)
  // Leave other entities as-is since MDX should handle them

  // 9. Strip data attributes (uncommon but could be malicious)
  processed = processed.replace(/\s+data-[a-zA-Z0-9-]+\s*=\s*["'][^"']*["']/gi, "");

  // 10. Convert HTML attributes to JSX-compatible attributes
  // class -> className
  processed = processed.replace(/\sclass=/gi, " className=");
  // for -> htmlFor (for label elements)
  processed = processed.replace(/\sfor=/gi, " htmlFor=");
  // tabindex -> tabIndex
  processed = processed.replace(/\stabindex=/gi, " tabIndex=");
  // readonly -> readOnly
  processed = processed.replace(/\sreadonly(?=[>\s])/gi, " readOnly");
  // maxlength -> maxLength
  processed = processed.replace(/\smaxlength=/gi, " maxLength=");
  // minlength -> minLength
  processed = processed.replace(/\sminlength=/gi, " minLength=");
  // colspan -> colSpan
  processed = processed.replace(/\scolspan=/gi, " colSpan=");
  // rowspan -> rowSpan
  processed = processed.replace(/\srowspan=/gi, " rowSpan=");
  // cellpadding -> cellPadding
  processed = processed.replace(/\scellpadding=/gi, " cellPadding=");
  // cellspacing -> cellSpacing
  processed = processed.replace(/\scellspacing=/gi, " cellSpacing=");
  // autocomplete -> autoComplete
  processed = processed.replace(/\sautocomplete=/gi, " autoComplete=");
  // autofocus -> autoFocus
  processed = processed.replace(/\sautofocus(?=[>\s])/gi, " autoFocus");

  // 11. Ensure there's no leading/trailing script-like content
  processed = processed.trim();

  return processed;
}

// Define MDX components inline to avoid hook issues in async component
const components: MDXComponents = {
  h1: ({ children }) => (
    <h1 className="text-[14px] leading-[1.5714285714285714em] font-normal mt-[13px] mb-[13px] text-[#0A0A0A]">
      {children}
    </h1>
  ),
  h2: ({ children }) => (
    <h2 className="text-[14px] leading-[1.5714285714285714em] font-normal mt-[13px] mb-[13px] text-[#0A0A0A]">
      {children}
    </h2>
  ),
  h3: ({ children }) => (
    <h3 className="text-[14px] leading-[1.5714285714285714em] font-normal mt-[13px] mb-[13px] text-[#0A0A0A]">
      {children}
    </h3>
  ),
  p: ({ children }) => (
    <p className="text-[14px] leading-[1.5714285714285714em] font-normal mb-[13px] text-[#0A0A0A]">
      {children}
    </p>
  ),
  ul: ({ children }) => (
    <ul className="list-disc list-inside mb-[13px] space-y-[13px] text-[#0A0A0A]">{children}</ul>
  ),
  ol: ({ children }) => (
    <ol className="list-decimal list-inside mb-[13px] space-y-[13px] text-[#0A0A0A]">{children}</ol>
  ),
  li: ({ children }) => (
    <li className="text-[14px] leading-[1.5714285714285714em] font-normal">{children}</li>
  ),
  blockquote: ({ children }) => (
    <blockquote className="border-l-4 border-[#E7E7E7] pl-4 italic my-[13px] text-[#0A0A0A]">
      {children}
    </blockquote>
  ),
  code: ({ children }) => (
    <code className="bg-[#E7E7E7] rounded px-1.5 py-0.5 text-[14px] font-mono">{children}</code>
  ),
  pre: ({ children }) => (
    <pre className="bg-[#E7E7E7] rounded-lg p-4 overflow-x-auto my-[13px] text-[14px] max-w-full">
      {children}
    </pre>
  ),
  a: ({ href, children }) => (
    <a
      href={href}
      className="text-[#0A0A0A] underline hover:opacity-70 transition-opacity"
      target={href?.startsWith("http") ? "_blank" : undefined}
      rel={href?.startsWith("http") ? "noopener noreferrer" : undefined}
    >
      {children}
    </a>
  ),
  hr: () => <hr className="border-[#E7E7E7] my-[13px]" />,
  strong: ({ children }) => <strong className="font-normal text-[#0A0A0A]">{children}</strong>,
  em: ({ children }) => <em className="italic">{children}</em>,
  // Handle br explicitly
  br: () => <br />,
  // Handle img with fallback
  img: ({ src, alt, ...props }) => (
    // eslint-disable-next-line @next/next/no-img-element
    <img
      src={src}
      alt={alt || ""}
      className="max-w-full h-auto my-[13px] rounded"
      loading="lazy"
      {...props}
    />
  ),
};

/**
 * Error fallback component for when MDX compilation fails
 */
function ErrorFallback({ error }: { error: string }) {
  return (
    <div className="p-4 border border-red-200 bg-red-50 rounded-lg">
      <p className="text-sm text-red-600 font-medium mb-2">
        Unable to render content
      </p>
      <p className="text-xs text-red-500">
        There was an error processing this content. Please check the formatting.
      </p>
      {process.env.NODE_ENV === "development" && (
        <pre className="mt-2 text-xs text-red-400 overflow-auto max-h-32">
          {error}
        </pre>
      )}
    </div>
  );
}

/**
 * Empty content fallback
 */
function EmptyContent() {
  return (
    <p className="text-[14px] leading-[1.5714285714285714em] font-normal text-muted-foreground italic">
      No content available.
    </p>
  );
}

export async function MDXContent({ source }: MDXContentProps) {
  // Handle empty or invalid content
  if (!source || typeof source !== "string" || source.trim() === "") {
    return <EmptyContent />;
  }

  // Pre-process source for safety and compatibility
  const processedSource = preprocessSource(source);

  // If preprocessing resulted in empty content
  if (!processedSource.trim()) {
    return <EmptyContent />;
  }

  let Content: React.ComponentType<{ components: MDXComponents }>;

  try {
    const compiled = await compile(processedSource, {
      outputFormat: "function-body",
    });

    const result = await run(String(compiled), {
      ...runtime,
      baseUrl: import.meta.url,
    });

    Content = result.default;
  } catch (error) {
    console.error("MDX compilation error:", error);
    const errorMessage = error instanceof Error ? error.message : "Unknown error";
    return <ErrorFallback error={errorMessage} />;
  }

  return <Content components={components} />;
}
