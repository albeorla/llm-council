import { useState } from 'react';

// Available models for selection
const AVAILABLE_MODELS = [
  { id: 'openai/gpt-5.1', name: 'GPT-5.1' },
  { id: 'openai/gpt-4o', name: 'GPT-4o' },
  { id: 'google/gemini-3-pro-preview', name: 'Gemini 3 Pro' },
  { id: 'anthropic/claude-sonnet-4.5', name: 'Claude Sonnet 4.5' },
  { id: 'anthropic/claude-3.5-sonnet', name: 'Claude 3.5 Sonnet' },
  { id: 'x-ai/grok-4', name: 'Grok 4' },
  { id: 'meta/llama-3-70b', name: 'Llama 3 70B' },
  { id: 'mistralai/mistral-large', name: 'Mistral Large' },
];

const SYNTHESIS_STYLES = [
  { id: 'balanced', name: 'Balanced & Comprehensive' },
  { id: 'risk-averse', name: 'Risk-Averse' },
  { id: 'action-oriented', name: 'Action-Oriented' },
  { id: 'concise', name: 'Concise Summary' },
];

function ModelConfigCard({ role, icon, iconColor, model, temperature, enabled, onToggle, onModelChange, onTempChange }) {
  return (
    <div className="bg-gray-50 dark:bg-card-dark rounded-lg p-3 border border-gray-200 dark:border-border-dark">
      <div className="flex items-center justify-between mb-2">
        <div className="flex items-center gap-2">
          <div className={`size-6 rounded bg-${iconColor}/10 flex items-center justify-center text-${iconColor}`}
            style={{ backgroundColor: `rgba(var(--${iconColor}-rgb), 0.1)` }}
          >
            <span className="material-symbols-outlined text-[14px]" style={{ color: `var(--${iconColor})` }}>
              {icon}
            </span>
          </div>
          <span className="text-sm font-semibold text-gray-900 dark:text-white">{role}</span>
        </div>
        <div className="relative inline-block w-8 align-middle select-none transition duration-200 ease-in">
          <input
            type="checkbox"
            checked={enabled}
            onChange={(e) => onToggle(e.target.checked)}
            className="toggle-checkbox absolute block w-4 h-4 rounded-full bg-white border-4 appearance-none cursor-pointer right-4"
          />
          <label className="toggle-label block overflow-hidden h-4 rounded-full bg-gray-300 dark:bg-gray-600 cursor-pointer" />
        </div>
      </div>
      <div className="space-y-2">
        <select
          value={model}
          onChange={(e) => onModelChange(e.target.value)}
          className="w-full bg-white dark:bg-[#111722] border border-gray-200 dark:border-border-dark rounded text-xs py-1.5 px-2 text-gray-700 dark:text-gray-300 focus:border-primary focus:ring-0"
        >
          {AVAILABLE_MODELS.map((m) => (
            <option key={m.id} value={m.id}>{m.name}</option>
          ))}
        </select>
        <div className="flex items-center gap-2">
          <span className="text-[10px] text-gray-400 w-12">Temp</span>
          <input
            type="range"
            min="0"
            max="100"
            value={temperature * 100}
            onChange={(e) => onTempChange(e.target.value / 100)}
            className="w-full h-1 bg-gray-200 dark:bg-gray-700 rounded-lg appearance-none cursor-pointer accent-primary"
          />
          <span className="text-[10px] text-gray-400 w-6 text-right">{temperature.toFixed(1)}</span>
        </div>
      </div>
    </div>
  );
}

function RightSidebar({ isOpen, onClose, config, onConfigChange }) {
  const [localConfig, setLocalConfig] = useState(config || {
    councilMembers: [
      { role: 'The Skeptic', icon: 'admin_panel_settings', iconColor: 'orange-500', model: 'anthropic/claude-sonnet-4.5', temperature: 0.2, enabled: true },
      { role: 'The Analyst', icon: 'analytics', iconColor: 'blue-400', model: 'google/gemini-3-pro-preview', temperature: 0.1, enabled: true },
      { role: 'The Creative', icon: 'emoji_objects', iconColor: 'purple-500', model: 'x-ai/grok-4', temperature: 0.8, enabled: true },
    ],
    chairperson: {
      model: 'openai/gpt-5.1',
      synthesisStyle: 'balanced',
    },
  });

  const handleMemberChange = (index, field, value) => {
    const updated = { ...localConfig };
    updated.councilMembers[index][field] = value;
    setLocalConfig(updated);
  };

  const handleChairChange = (field, value) => {
    setLocalConfig({
      ...localConfig,
      chairperson: { ...localConfig.chairperson, [field]: value },
    });
  };

  const handleSave = () => {
    onConfigChange?.(localConfig);
  };

  if (!isOpen) return null;

  return (
    <aside className="w-80 bg-surface-light dark:bg-surface-dark border-l border-gray-200 dark:border-border-dark flex flex-col z-10 shrink-0">
      <div className="flex items-center justify-between p-4 border-b border-gray-200 dark:border-border-dark">
        <h3 className="font-bold text-gray-900 dark:text-white flex items-center gap-2">
          <span className="material-symbols-outlined text-primary">tune</span>
          Model Configuration
        </h3>
        <button
          onClick={onClose}
          className="text-gray-400 hover:text-gray-900 dark:hover:text-white transition-colors"
        >
          <span className="material-symbols-outlined">close</span>
        </button>
      </div>

      <div className="flex-1 overflow-y-auto p-4 space-y-6">
        {/* First Opinions Stage */}
        <div>
          <div className="flex items-center justify-between mb-3">
            <h4 className="text-xs font-bold uppercase tracking-wider text-gray-500 dark:text-gray-400">
              First Opinions Stage
            </h4>
            <button className="text-primary hover:text-blue-400 text-xs font-medium flex items-center gap-1">
              <span className="material-symbols-outlined text-[14px]">add</span>
              Add Model
            </button>
          </div>

          <div className="space-y-3">
            {localConfig.councilMembers.map((member, index) => (
              <ModelConfigCard
                key={member.role}
                {...member}
                onToggle={(val) => handleMemberChange(index, 'enabled', val)}
                onModelChange={(val) => handleMemberChange(index, 'model', val)}
                onTempChange={(val) => handleMemberChange(index, 'temperature', val)}
              />
            ))}
          </div>
        </div>

        <hr className="border-gray-200 dark:border-border-dark" />

        {/* Review & Consensus */}
        <div>
          <div className="flex items-center justify-between mb-3">
            <h4 className="text-xs font-bold uppercase tracking-wider text-gray-500 dark:text-gray-400">
              Review & Consensus
            </h4>
          </div>

          <div className="bg-primary/5 dark:bg-primary/10 rounded-lg p-3 border border-primary/20">
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center gap-2">
                <div className="size-6 rounded bg-primary flex items-center justify-center text-white">
                  <span className="material-symbols-outlined text-[14px] icon-fill">psychology</span>
                </div>
                <span className="text-sm font-semibold text-gray-900 dark:text-white">Chairperson</span>
              </div>
              <span className="text-[10px] font-mono text-primary bg-primary/10 px-1.5 py-0.5 rounded border border-primary/20">
                Active
              </span>
            </div>

            <div className="space-y-3">
              <div>
                <label className="block text-[10px] text-gray-500 dark:text-gray-400 mb-1">
                  Model Selection
                </label>
                <select
                  value={localConfig.chairperson.model}
                  onChange={(e) => handleChairChange('model', e.target.value)}
                  className="w-full bg-white dark:bg-[#111722] border border-gray-200 dark:border-border-dark rounded text-xs py-1.5 px-2 text-gray-700 dark:text-gray-300 focus:border-primary focus:ring-0"
                >
                  {AVAILABLE_MODELS.map((m) => (
                    <option key={m.id} value={m.id}>{m.name} (Reasoning)</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-[10px] text-gray-500 dark:text-gray-400 mb-1">
                  Synthesis Style
                </label>
                <select
                  value={localConfig.chairperson.synthesisStyle}
                  onChange={(e) => handleChairChange('synthesisStyle', e.target.value)}
                  className="w-full bg-white dark:bg-[#111722] border border-gray-200 dark:border-border-dark rounded text-xs py-1.5 px-2 text-gray-700 dark:text-gray-300 focus:border-primary focus:ring-0"
                >
                  {SYNTHESIS_STYLES.map((s) => (
                    <option key={s.id} value={s.id}>{s.name}</option>
                  ))}
                </select>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="p-4 border-t border-gray-200 dark:border-border-dark bg-gray-50 dark:bg-surface-dark mt-auto">
        <button
          onClick={handleSave}
          className="w-full flex items-center justify-center gap-2 py-2 rounded-lg bg-surface-light dark:bg-card-dark border border-gray-200 dark:border-border-dark text-sm font-medium text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-[#252f44] transition-colors"
        >
          <span className="material-symbols-outlined text-[18px]">save</span>
          Save Configuration
        </button>
      </div>
    </aside>
  );
}

export default RightSidebar;
