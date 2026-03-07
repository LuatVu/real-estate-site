import ReactMarkdown from 'react-markdown';

/**
 * Utility function to format markdown description with proper styling
 * @param description - The markdown string to render
 * @returns JSX element with formatted markdown or null if no description
 */
export const formatDescription = (description: string) => {
  if (!description) return null;
  
  // Convert \n characters to proper markdown line breaks
  const processedDescription = description.replace(/\n/g, '  \n');
  
  return (
    <ReactMarkdown
      components={{
        // Custom styling for markdown elements
        h1: ({children}) => <h1 className="text-xl font-bold mb-4">{children}</h1>,
        h2: ({children}) => <h2 className="text-lg font-bold mb-3">{children}</h2>,
        h3: ({children}) => <h3 className="text-base font-bold mb-2">{children}</h3>,
        p: ({children}) => <p className="mb-3 leading-relaxed">{children}</p>,
        ul: ({children}) => <ul className="list-disc list-inside mb-3 space-y-1">{children}</ul>,
        ol: ({children}) => <ol className="list-decimal list-inside mb-3 space-y-1">{children}</ol>,
        li: ({children}) => <li className="mb-1">{children}</li>,
        strong: ({children}) => <strong className="font-bold">{children}</strong>,
        em: ({children}) => <em className="italic">{children}</em>,
        a: ({children, href}) => (
          <a 
            href={href} 
            className="text-blue-600 hover:text-blue-800 underline" 
            target="_blank" 
            rel="noopener noreferrer"
          >
            {children}
          </a>
        ),
        blockquote: ({children}) => (
          <blockquote className="border-l-4 border-gray-400 pl-4 italic mb-3">
            {children}
          </blockquote>
        ),
      }}
    >
      {processedDescription}
    </ReactMarkdown>
  );
};