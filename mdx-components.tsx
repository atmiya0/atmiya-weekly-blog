import type { MDXComponents } from "mdx/types";

export function useMDXComponents(components: MDXComponents): MDXComponents {
    return {
        h1: ({ children }) => (
            <h1 className="text-3xl font-bold mt-8 mb-4 text-foreground">{children}</h1>
        ),
        h2: ({ children }) => (
            <h2 className="text-2xl font-semibold mt-6 mb-3 text-foreground">{children}</h2>
        ),
        h3: ({ children }) => (
            <h3 className="text-xl font-medium mt-4 mb-2 text-foreground">{children}</h3>
        ),
        p: ({ children }) => (
            <p className="text-base leading-relaxed mb-4 text-foreground/90">{children}</p>
        ),
        ul: ({ children }) => (
            <ul className="list-disc list-inside mb-4 space-y-1 text-foreground/90">{children}</ul>
        ),
        ol: ({ children }) => (
            <ol className="list-decimal list-inside mb-4 space-y-1 text-foreground/90">{children}</ol>
        ),
        li: ({ children }) => <li className="leading-relaxed">{children}</li>,
        blockquote: ({ children }) => (
            <blockquote className="border-l-4 border-foreground/20 pl-4 italic my-4 text-foreground/80">
                {children}
            </blockquote>
        ),
        code: ({ children }) => (
            <code className="bg-foreground/5 rounded px-1.5 py-0.5 text-sm font-mono">
                {children}
            </code>
        ),
        pre: ({ children }) => (
            <pre className="bg-foreground/5 rounded-lg p-4 overflow-x-auto my-4 text-sm">
                {children}
            </pre>
        ),
        a: ({ href, children }) => (
            <a
                href={href}
                className="text-foreground underline underline-offset-4 hover:text-foreground/70 transition-colors"
                target={href?.startsWith("http") ? "_blank" : undefined}
                rel={href?.startsWith("http") ? "noopener noreferrer" : undefined}
            >
                {children}
            </a>
        ),
        hr: () => <hr className="border-foreground/10 my-8" />,
        strong: ({ children }) => (
            <strong className="font-semibold text-foreground">{children}</strong>
        ),
        em: ({ children }) => <em className="italic">{children}</em>,
        ...components,
    };
}
