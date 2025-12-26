import ReactMarkdown from 'react-markdown';

// Helper function to extract short model name
function getShortModelName(model) {
  return model?.split('/')[1] || model || 'Unknown';
}

// Helper function to get display-friendly model name
function getDisplayName(model) {
  const shortName = getShortModelName(model);
  const nameMap = {
    'gpt-5.1': 'GPT-5.1',
    'gpt-4o': 'GPT-4o',
    'gemini-3-pro-preview': 'Gemini 3 Pro',
    'gemini-2.0-flash-exp': 'Gemini 2.0',
    'claude-sonnet-4.5': 'Claude Sonnet 4.5',
    'claude-3.5-sonnet': 'Claude 3.5',
    'grok-4': 'Grok 4',
  };
  return nameMap[shortName] || shortName;
}

function FinalVerdict({ synthesis, isLoading, onRegenerate, onExport }) {
  return (
    <section className="bg-surface-light dark:bg-[#151b28] rounded-2xl border border-primary/30 shadow-[0_0_30px_rgba(43,108,238,0.1)] overflow-hidden">
      {/* Header */}
      <div className="bg-primary/10 border-b border-primary/20 px-6 py-4 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="size-8 rounded bg-primary text-white flex items-center justify-center shadow-lg shadow-blue-500/30">
            <span className="material-symbols-outlined icon-fill">psychology</span>
          </div>
          <div>
            <h3 className="text-gray-900 dark:text-white font-bold text-lg leading-tight">
              Chairperson's Consensus
            </h3>
            <p className="text-primary text-xs font-medium">
              Synthesized by {synthesis?.model ? getDisplayName(synthesis.model) : 'Chairman'}
            </p>
          </div>
        </div>

        <div className="flex gap-3">
          <button
            onClick={onRegenerate}
            disabled={isLoading}
            className="flex items-center gap-2 px-3 py-1.5 rounded-lg border border-gray-200 dark:border-primary/30 hover:bg-primary/10 text-xs font-medium text-gray-600 dark:text-primary transition-colors disabled:opacity-50"
          >
            <span className="material-symbols-outlined text-[16px]">refresh</span>
            Regenerate
          </button>
          <button
            onClick={onExport}
            disabled={!synthesis?.response}
            className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-primary hover:bg-blue-600 text-white text-xs font-medium shadow-lg shadow-blue-900/20 transition-colors disabled:opacity-50"
          >
            <span className="material-symbols-outlined text-[16px]">download</span>
            Export Report
          </button>
        </div>
      </div>

      {/* Content */}
      <div className="p-6 md:p-8">
        {isLoading ? (
          <div className="flex flex-col items-center justify-center py-12">
            <div className="size-12 rounded-full bg-primary/10 flex items-center justify-center mb-4">
              <span className="material-symbols-outlined text-[32px] text-primary animate-spin">
                progress_activity
              </span>
            </div>
            <p className="text-gray-600 dark:text-gray-400 font-medium">
              The Chairperson is synthesizing the council's deliberation...
            </p>
            <p className="text-gray-400 dark:text-gray-500 text-sm mt-2">
              Analyzing all perspectives to form a consensus
            </p>
          </div>
        ) : synthesis?.response ? (
          <div className="font-body text-gray-700 dark:text-gray-300 leading-relaxed">
            <div className="markdown-content">
              <ReactMarkdown
                components={{
                  // Custom rendering for list items with icons
                  li: ({ children, ...props }) => {
                    const text = String(children);

                    // Detect action items, risks, and opportunities
                    if (text.includes('Action Item') || text.includes('Recommendation')) {
                      return (
                        <li className="flex gap-3 items-start p-3 rounded-lg bg-green-500/5 border border-green-500/10 my-2 list-none" {...props}>
                          <span className="material-symbols-outlined text-green-500 mt-0.5 shrink-0">check_circle</span>
                          <span>{children}</span>
                        </li>
                      );
                    }
                    if (text.includes('Risk') || text.includes('Warning') || text.includes('Caution')) {
                      return (
                        <li className="flex gap-3 items-start p-3 rounded-lg bg-orange-500/5 border border-orange-500/10 my-2 list-none" {...props}>
                          <span className="material-symbols-outlined text-orange-500 mt-0.5 shrink-0">warning</span>
                          <span>{children}</span>
                        </li>
                      );
                    }
                    if (text.includes('Opportunity') || text.includes('Innovation') || text.includes('Creative')) {
                      return (
                        <li className="flex gap-3 items-start p-3 rounded-lg bg-purple-500/5 border border-purple-500/10 my-2 list-none" {...props}>
                          <span className="material-symbols-outlined text-purple-500 mt-0.5 shrink-0">auto_awesome</span>
                          <span>{children}</span>
                        </li>
                      );
                    }
                    return <li {...props}>{children}</li>;
                  },
                  // Style blockquotes as highlighted conclusions
                  blockquote: ({ children, ...props }) => (
                    <blockquote
                      className="text-sm text-gray-500 dark:text-gray-400 italic mt-4 pt-4 border-t border-gray-200 dark:border-border-dark border-l-0 pl-0"
                      {...props}
                    >
                      {children}
                    </blockquote>
                  ),
                }}
              >
                {synthesis.response}
              </ReactMarkdown>
            </div>
          </div>
        ) : (
          <div className="text-center py-12">
            <div className="size-12 rounded-full bg-gray-100 dark:bg-gray-800 flex items-center justify-center mx-auto mb-4">
              <span className="material-symbols-outlined text-[32px] text-gray-400">psychology</span>
            </div>
            <p className="text-gray-500 dark:text-gray-400">
              Awaiting deliberation to synthesize...
            </p>
          </div>
        )}
      </div>
    </section>
  );
}

// Loading skeleton for the verdict
function FinalVerdictSkeleton() {
  return (
    <section className="bg-surface-light dark:bg-[#151b28] rounded-2xl border border-primary/30 shadow-[0_0_30px_rgba(43,108,238,0.1)] overflow-hidden animate-pulse">
      <div className="bg-primary/10 border-b border-primary/20 px-6 py-4 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="size-8 rounded bg-primary/30"></div>
          <div>
            <div className="h-5 w-40 bg-gray-200 dark:bg-gray-700 rounded mb-1"></div>
            <div className="h-3 w-24 bg-gray-200 dark:bg-gray-700 rounded"></div>
          </div>
        </div>
        <div className="flex gap-3">
          <div className="h-8 w-24 bg-gray-200 dark:bg-gray-700 rounded"></div>
          <div className="h-8 w-28 bg-gray-200 dark:bg-gray-700 rounded"></div>
        </div>
      </div>
      <div className="p-6 md:p-8">
        <div className="space-y-3">
          <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-full"></div>
          <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-5/6"></div>
          <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-4/6"></div>
          <div className="h-16 bg-gray-200 dark:bg-gray-700 rounded w-full mt-4"></div>
          <div className="h-16 bg-gray-200 dark:bg-gray-700 rounded w-full"></div>
        </div>
      </div>
    </section>
  );
}

export { FinalVerdict, FinalVerdictSkeleton };
export default FinalVerdict;
