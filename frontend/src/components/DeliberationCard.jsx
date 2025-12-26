import ReactMarkdown from 'react-markdown';

// Role definitions with icons and colors for display
const ROLE_CONFIGS = [
  { id: 'skeptic', name: 'The Skeptic', icon: 'admin_panel_settings', colorClass: 'text-orange-500' },
  { id: 'analyst', name: 'The Analyst', icon: 'analytics', colorClass: 'text-blue-400' },
  { id: 'creative', name: 'The Creative', icon: 'emoji_objects', colorClass: 'text-purple-500' },
  { id: 'pragmatist', name: 'The Pragmatist', icon: 'handyman', colorClass: 'text-green-500' },
];

// Helper function to extract short model name
function getShortModelName(model) {
  return model?.split('/')[1] || model || 'Unknown';
}

function DeliberationCard({ response, index, isLoading }) {
  const roleConfig = ROLE_CONFIGS[index] || {
    name: 'Council Member',
    icon: 'person',
    colorClass: 'text-gray-500'
  };

  const modelName = getShortModelName(response?.model);

  const handleThumbUp = () => {
    // TODO: Implement feedback
    console.log('Thumbs up for', response?.model);
  };

  const handleThumbDown = () => {
    // TODO: Implement feedback
    console.log('Thumbs down for', response?.model);
  };

  return (
    <article className="flex flex-col bg-surface-light dark:bg-card-dark rounded-xl border border-gray-200 dark:border-border-dark overflow-hidden shadow-sm hover:shadow-md transition-shadow">
      {/* Header */}
      <div className="px-4 py-3 bg-gray-50 dark:bg-[#232f48]/50 border-b border-gray-200 dark:border-border-dark flex items-center justify-between">
        <div className="flex items-center gap-2">
          <span className={`material-symbols-outlined text-[20px] ${roleConfig.colorClass}`}>
            {roleConfig.icon}
          </span>
          <span className="font-bold text-gray-900 dark:text-gray-200 text-sm">
            {roleConfig.name}
          </span>
        </div>
        <span className="text-[10px] font-mono text-gray-500 bg-gray-200 dark:bg-gray-800 px-1.5 py-0.5 rounded">
          {modelName}
        </span>
      </div>

      {/* Content */}
      <div className="p-4 flex-1">
        {isLoading ? (
          <div className="flex items-center justify-center py-8">
            <div className="flex flex-col items-center gap-3">
              <span className="material-symbols-outlined text-[32px] text-primary animate-spin">
                progress_activity
              </span>
              <p className="text-sm text-gray-500 dark:text-gray-400">
                {roleConfig.name} is deliberating...
              </p>
            </div>
          </div>
        ) : response?.response ? (
          <div className="prose prose-sm dark:prose-invert max-w-none">
            <div className="markdown-content text-gray-600 dark:text-gray-300 text-sm leading-relaxed font-body">
              <ReactMarkdown>{response.response}</ReactMarkdown>
            </div>
          </div>
        ) : (
          <div className="text-gray-400 text-sm italic">
            Awaiting response...
          </div>
        )}
      </div>

      {/* Footer */}
      <div className="px-4 py-2 border-t border-gray-200 dark:border-border-dark flex justify-between items-center bg-gray-50/50 dark:bg-transparent">
        <span className="text-[10px] text-gray-400 font-mono">
          {response?.latency ? `${response.latency}ms` : '--'} • {response?.tokens ? `${response.tokens} tokens` : '--'}
        </span>
        <div className="flex gap-2">
          <button
            onClick={handleThumbDown}
            className="text-gray-400 hover:text-red-500 transition-colors"
            title="Not helpful"
          >
            <span className="material-symbols-outlined text-[16px]">thumb_down</span>
          </button>
          <button
            onClick={handleThumbUp}
            className="text-gray-400 hover:text-green-500 transition-colors"
            title="Helpful"
          >
            <span className="material-symbols-outlined text-[16px]">thumb_up</span>
          </button>
        </div>
      </div>
    </article>
  );
}

// Component for the loading skeleton
function DeliberationCardSkeleton({ index }) {
  const roleConfig = ROLE_CONFIGS[index] || {
    name: 'Council Member',
    icon: 'person',
    colorClass: 'text-gray-500'
  };

  return (
    <article className="flex flex-col bg-surface-light dark:bg-card-dark rounded-xl border border-gray-200 dark:border-border-dark overflow-hidden shadow-sm animate-pulse">
      <div className="px-4 py-3 bg-gray-50 dark:bg-[#232f48]/50 border-b border-gray-200 dark:border-border-dark flex items-center justify-between">
        <div className="flex items-center gap-2">
          <span className={`material-symbols-outlined text-[20px] ${roleConfig.colorClass} opacity-50`}>
            {roleConfig.icon}
          </span>
          <span className="font-bold text-gray-400 text-sm">
            {roleConfig.name}
          </span>
        </div>
        <div className="h-4 w-16 bg-gray-200 dark:bg-gray-700 rounded"></div>
      </div>
      <div className="p-4 flex-1">
        <div className="space-y-2">
          <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-full"></div>
          <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-5/6"></div>
          <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-4/6"></div>
        </div>
      </div>
      <div className="px-4 py-2 border-t border-gray-200 dark:border-border-dark">
        <div className="h-3 w-24 bg-gray-200 dark:bg-gray-700 rounded"></div>
      </div>
    </article>
  );
}

export { DeliberationCard, DeliberationCardSkeleton };
export default DeliberationCard;
