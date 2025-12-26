import { useRef, useEffect } from 'react';
import CouncilChamber from './CouncilChamber';
import { DeliberationCard, DeliberationCardSkeleton } from './DeliberationCard';
import { FinalVerdict, FinalVerdictSkeleton } from './FinalVerdict';

function SectionDivider({ label, variant = 'default' }) {
  const colorClass = variant === 'primary'
    ? 'text-primary via-primary/50'
    : 'text-gray-400 via-gray-300 dark:via-gray-700';

  return (
    <div className="flex items-center gap-4 py-2">
      <div className={`h-[1px] flex-1 bg-gradient-to-r from-transparent ${colorClass.includes('primary') ? 'via-primary/50' : 'via-gray-300 dark:via-gray-700'} to-transparent`}></div>
      <span className={`text-xs font-bold uppercase tracking-widest ${colorClass.split(' ')[0]}`}>
        {label}
      </span>
      <div className={`h-[1px] flex-1 bg-gradient-to-r from-transparent ${colorClass.includes('primary') ? 'via-primary/50' : 'via-gray-300 dark:via-gray-700'} to-transparent`}></div>
    </div>
  );
}

function ProgressIndicator({ stage1Loading, stage2Loading, stage3Loading, stage1Done, stage2Done, stage3Done }) {
  const stages = [
    { label: 'First Opinions', loading: stage1Loading, done: stage1Done },
    { label: 'Peer Review', loading: stage2Loading, done: stage2Done },
    { label: 'Consensus', loading: stage3Loading, done: stage3Done },
  ];

  return (
    <div className="flex items-center justify-center gap-2 py-4">
      {stages.map((stage, index) => (
        <div key={stage.label} className="flex items-center gap-2">
          <div className={`flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-medium transition-all
            ${stage.done
              ? 'bg-green-500/10 text-green-500 border border-green-500/20'
              : stage.loading
                ? 'bg-primary/10 text-primary border border-primary/20 animate-pulse-custom'
                : 'bg-gray-100 dark:bg-gray-800 text-gray-400 border border-gray-200 dark:border-gray-700'
            }`}
          >
            {stage.done ? (
              <span className="material-symbols-outlined text-[14px]">check_circle</span>
            ) : stage.loading ? (
              <span className="material-symbols-outlined text-[14px] animate-spin">progress_activity</span>
            ) : (
              <span className="material-symbols-outlined text-[14px]">radio_button_unchecked</span>
            )}
            {stage.label}
          </div>
          {index < stages.length - 1 && (
            <span className="material-symbols-outlined text-gray-300 dark:text-gray-600 text-[14px]">
              chevron_right
            </span>
          )}
        </div>
      ))}
    </div>
  );
}

function MainContent({ session, message, onSubmit, isLoading, onRegenerate, onExport }) {
  const scrollRef = useRef(null);

  // Auto-scroll to bottom when content updates
  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [message?.stage1, message?.stage2, message?.stage3]);

  const hasStage1 = message?.stage1 && message.stage1.length > 0;
  const hasStage3 = message?.stage3;
  const isProcessing = message?.loading?.stage1 || message?.loading?.stage2 || message?.loading?.stage3;

  return (
    <main className="flex-1 overflow-y-auto relative bg-background-light dark:bg-background-dark scroll-smooth w-full">
      <div className="max-w-[1200px] mx-auto p-6 md:p-8 flex flex-col gap-8 pb-20">
        {/* Breadcrumbs */}
        <div className="flex items-center gap-2 text-sm">
          <a className="text-gray-500 hover:text-primary transition-colors cursor-pointer">Sessions</a>
          <span className="text-gray-600 dark:text-gray-600">/</span>
          <span className="text-gray-900 dark:text-white font-medium">
            {session?.title || `Session #${session?.id?.slice(-4) || 'New'}`}
          </span>
        </div>

        {/* Council Chamber Input */}
        <CouncilChamber
          sessionId={session?.id}
          onSubmit={onSubmit}
          isLoading={isLoading}
        />

        {/* Progress Indicator - Show when processing */}
        {isProcessing && (
          <ProgressIndicator
            stage1Loading={message?.loading?.stage1}
            stage2Loading={message?.loading?.stage2}
            stage3Loading={message?.loading?.stage3}
            stage1Done={hasStage1}
            stage2Done={message?.stage2?.length > 0}
            stage3Done={!!hasStage3}
          />
        )}

        {/* Deliberation Phase - Show when we have stage 1 responses */}
        {(hasStage1 || message?.loading?.stage1) && (
          <>
            <SectionDivider label="Deliberation Phase" />

            <section className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
              {message?.loading?.stage1 && !hasStage1 ? (
                // Show skeletons while loading
                <>
                  <DeliberationCardSkeleton index={0} />
                  <DeliberationCardSkeleton index={1} />
                  <DeliberationCardSkeleton index={2} />
                </>
              ) : (
                // Show actual responses
                message?.stage1?.map((response, index) => (
                  <DeliberationCard
                    key={response.model || index}
                    response={response}
                    index={index}
                    isLoading={false}
                  />
                ))
              )}
            </section>
          </>
        )}

        {/* Final Verdict - Show when we have stage 3 or loading */}
        {(hasStage3 || message?.loading?.stage3) && (
          <>
            <SectionDivider label="Final Verdict" variant="primary" />

            {message?.loading?.stage3 && !hasStage3 ? (
              <FinalVerdictSkeleton />
            ) : (
              <FinalVerdict
                synthesis={message?.stage3}
                isLoading={message?.loading?.stage3}
                onRegenerate={onRegenerate}
                onExport={onExport}
              />
            )}
          </>
        )}

        {/* Error Display */}
        {message?.error && (
          <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-xl p-4 flex items-start gap-3">
            <span className="material-symbols-outlined text-red-500 mt-0.5">error</span>
            <div>
              <h4 className="font-medium text-red-800 dark:text-red-200">Error</h4>
              <p className="text-red-600 dark:text-red-300 text-sm mt-1">{message.error}</p>
            </div>
          </div>
        )}

        {/* Scroll anchor */}
        <div ref={scrollRef} />
      </div>
    </main>
  );
}

export default MainContent;
