import { compile, run } from "@mdx-js/mdx";
import * as runtime from "react/jsx-runtime";
import type { MDXComponents } from "mdx/types";

interface MDXContentProps {
    source: string;
}

// Define MDX components inline to avoid hook issues in async component
const components: MDXComponents = {
    h1: ({ children }) => (
        <h1 className="text-[14px] leading-[1.5714285714285714em] font-normal mt-[13px] mb-[13px] text-[#1C1917]">{children}</h1>
    ),
    h2: ({ children }) => (
        <h2 className="text-[14px] leading-[1.5714285714285714em] font-normal mt-[13px] mb-[13px] text-[#1C1917]">{children}</h2>
    ),
    h3: ({ children }) => (
        <h3 className="text-[14px] leading-[1.5714285714285714em] font-normal mt-[13px] mb-[13px] text-[#1C1917]">{children}</h3>
    ),
    p: ({ children }) => (
        <p className="text-[14px] leading-[1.5714285714285714em] font-normal mb-[13px] text-[#1C1917]">{children}</p>
    ),
    ul: ({ children }) => (
        <ul className="list-disc list-inside mb-[13px] space-y-[13px] text-[#1C1917]">{children}</ul>
    ),
    ol: ({ children }) => (
        <ol className="list-decimal list-inside mb-[13px] space-y-[13px] text-[#1C1917]">{children}</ol>
    ),
    li: ({ children }) => <li className="text-[14px] leading-[1.5714285714285714em] font-normal">{children}</li>,
    blockquote: ({ children }) => (
        <blockquote className="border-l-4 border-[#E7E7E7] pl-4 italic my-[13px] text-[#1C1917]">
            {children}
        </blockquote>
    ),
    code: ({ children }) => (
        <code className="bg-[#E7E7E7] rounded px-1.5 py-0.5 text-[14px] font-mono">
            {children}
        </code>
    ),
    pre: ({ children }) => (
        <pre className="bg-[#E7E7E7] rounded-lg p-4 overflow-x-auto my-[13px] text-[14px]">
            {children}
        </pre>
    ),
    a: ({ href, children }) => (
        <a
            href={href}
            className="text-[#1C1917] underline hover:opacity-70 transition-opacity"
            target={href?.startsWith("http") ? "_blank" : undefined}
            rel={href?.startsWith("http") ? "noopener noreferrer" : undefined}
        >
            {children}
        </a>
    ),
    hr: () => <hr className="border-[#E7E7E7] my-[13px]" />,
    strong: ({ children }) => (
        <strong className="font-normal text-[#1C1917]">{children}</strong>
    ),
    em: ({ children }) => <em className="italic">{children}</em>,
};

export async function MDXContent({ source }: MDXContentProps) {
    const compiled = await compile(source, {
        outputFormat: "function-body",
    });

    const { default: Content } = await run(String(compiled), {
        ...runtime,
        baseUrl: import.meta.url,
    });

    return <Content components={components} />;
}
