import { useState } from 'react';

function CouncilChamber({ onSubmit, isLoading }) {
  const [query, setQuery] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    if (query.trim() && !isLoading) {
      onSubmit(query.trim());
      setQuery('');
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSubmit(e);
    }
  };

  return (
    <section className="flex flex-col gap-4">
      <div className="flex items-end justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white tracking-tight">
            Council Chamber
          </h1>
          <p className="text-gray-500 dark:text-gray-400 mt-1">
            Submit your brief for multi-model deliberation.
          </p>
        </div>
      </div>

      <div className="relative group">
        {/* Gradient glow effect */}
        <div className="absolute -inset-0.5 bg-gradient-to-r from-primary to-purple-600 rounded-xl opacity-30 group-hover:opacity-60 transition duration-500 blur"></div>

        <form onSubmit={handleSubmit} className="relative flex flex-col gap-3 bg-surface-light dark:bg-card-dark p-4 rounded-xl border border-gray-200 dark:border-border-dark shadow-xl">
          <label className="sr-only" htmlFor="query-input">Your Query</label>
          <textarea
            id="query-input"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onKeyDown={handleKeyDown}
            disabled={isLoading}
            className="w-full bg-transparent border-none text-gray-900 dark:text-white placeholder-gray-400 focus:ring-0 resize-none min-h-[120px] text-lg font-body leading-relaxed"
            placeholder="Describe the problem or decision you need advice on..."
          />

          <div className="flex items-center justify-between pt-2 border-t border-gray-100 dark:border-gray-800">
            <div className="flex gap-2">
              <button
                type="button"
                className="p-2 text-gray-400 hover:text-primary rounded-lg hover:bg-gray-100 dark:hover:bg-background-dark transition-colors"
                title="Attach Context"
              >
                <span className="material-symbols-outlined text-[20px]">attach_file</span>
              </button>
              <button
                type="button"
                className="p-2 text-gray-400 hover:text-primary rounded-lg hover:bg-gray-100 dark:hover:bg-background-dark transition-colors"
                title="Configure Parameters"
              >
                <span className="material-symbols-outlined text-[20px]">tune</span>
              </button>
            </div>

            <button
              type="submit"
              disabled={isLoading || !query.trim()}
              className="bg-primary hover:bg-blue-600 disabled:bg-gray-400 disabled:cursor-not-allowed text-white px-6 py-2.5 rounded-lg font-bold text-sm tracking-wide shadow-lg shadow-blue-900/20 flex items-center gap-2 transition-all transform active:scale-95"
            >
              {isLoading ? (
                <>
                  <span className="material-symbols-outlined text-[20px] animate-spin">progress_activity</span>
                  CONSULTING...
                </>
              ) : (
                <>
                  <span className="material-symbols-outlined text-[20px]">gavel</span>
                  CONSULT COUNCIL
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </section>
  );
}

export default CouncilChamber;
