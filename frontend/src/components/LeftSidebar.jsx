// Helper function to extract short model name
function getShortModelName(model) {
  return model.split('/')[1] || model;
}

// Helper function to get a display-friendly model name
function getDisplayName(model) {
  const shortName = getShortModelName(model);
  // Map common model names to cleaner display names
  const nameMap = {
    'gpt-5.1': 'GPT-5.1',
    'gpt-4o': 'GPT-4o',
    'gemini-3-pro-preview': 'Gemini 3 Pro',
    'gemini-2.0-flash-exp': 'Gemini 2.0',
    'claude-sonnet-4.5': 'Claude Sonnet 4.5',
    'claude-3.5-sonnet': 'Claude 3.5',
    'grok-4': 'Grok 4',
    'mistral-large': 'Mistral Large',
    'llama-3-70b': 'Llama 3 70B',
  };
  return nameMap[shortName] || shortName;
}

// Role definitions with icons and colors
const ROLES = [
  { id: 'chairperson', name: 'Chairperson', icon: 'psychology', color: 'primary', isChair: true },
  { id: 'skeptic', name: 'The Skeptic', icon: 'admin_panel_settings', color: 'orange-500' },
  { id: 'analyst', name: 'The Analyst', icon: 'analytics', color: 'blue-400' },
  { id: 'creative', name: 'The Creative', icon: 'emoji_objects', color: 'purple-500' },
  { id: 'pragmatist', name: 'The Pragmatist', icon: 'handyman', color: 'green-500' },
];

function CouncilMember({ model, role }) {
  return (
    <div className={`group flex items-center gap-3 p-3 rounded-lg cursor-pointer transition-all border
      ${role.isChair
        ? 'bg-primary/10 border-primary/20 hover:bg-primary/20'
        : 'border-transparent hover:bg-gray-100 dark:hover:bg-card-dark hover:border-gray-200 dark:hover:border-border-dark'
      }`}
    >
      <div className={`size-10 rounded-lg flex items-center justify-center group-hover:scale-110 transition-transform
        ${role.isChair ? 'bg-primary/20 text-primary' : `bg-${role.color}/10 text-${role.color}`}`}
        style={!role.isChair ? { backgroundColor: `var(--${role.color}-bg)`, color: `var(--${role.color})` } : {}}
      >
        <span className={`material-symbols-outlined ${role.isChair ? 'icon-fill' : ''}`}>
          {role.icon}
        </span>
      </div>
      <div>
        <p className={`text-sm ${role.isChair ? 'font-bold' : 'font-medium'} text-gray-900 dark:text-white`}>
          {getDisplayName(model)}
        </p>
        <p className={`text-xs ${role.isChair ? 'text-primary font-medium' : 'text-gray-500 dark:text-gray-400'}`}>
          {role.name}
        </p>
      </div>
    </div>
  );
}

function LeftSidebar({ councilModels = [], chairmanModel = '', telemetry = {} }) {
  // Assign roles to council members
  const councilWithRoles = councilModels.map((model, index) => ({
    model,
    role: ROLES[index + 1] || { id: `member-${index}`, name: 'Council Member', icon: 'person', color: 'gray-500' }
  }));

  return (
    <aside className="w-72 bg-surface-light dark:bg-surface-dark border-r border-gray-200 dark:border-border-dark flex flex-col hidden lg:flex z-10 shrink-0">
      <div className="p-6 flex flex-col gap-6 h-full overflow-y-auto">
        {/* Active Council Status */}
        <div>
          <div className="flex items-center justify-between mb-2">
            <h3 className="text-xs font-bold uppercase tracking-wider text-gray-500 dark:text-gray-400">
              Council Members
            </h3>
            <span className="inline-flex items-center gap-1.5 rounded-full bg-green-500/10 px-2 py-0.5 text-xs font-medium text-green-500">
              <span className="size-1.5 rounded-full bg-green-500 animate-pulse"></span>
              Online
            </span>
          </div>

          <div className="space-y-2 mt-4">
            {/* Chairperson */}
            {chairmanModel && (
              <CouncilMember
                model={chairmanModel}
                role={ROLES[0]}
              />
            )}

            {/* Council Members */}
            {councilWithRoles.map(({ model, role }) => (
              <CouncilMember
                key={model}
                model={model}
                role={role}
              />
            ))}
          </div>
        </div>

        <hr className="border-gray-200 dark:border-border-dark" />

        {/* System Telemetry */}
        <div>
          <h3 className="text-xs font-bold uppercase tracking-wider text-gray-500 dark:text-gray-400 mb-4">
            System Telemetry
          </h3>
          <div className="grid grid-cols-2 gap-3">
            <div className="bg-gray-50 dark:bg-card-dark p-3 rounded-lg border border-gray-200 dark:border-border-dark">
              <p className="text-gray-400 text-[10px] uppercase">Latency</p>
              <p className="text-gray-900 dark:text-white font-mono text-sm">
                {telemetry.latency || '--'}ms
              </p>
            </div>
            <div className="bg-gray-50 dark:bg-card-dark p-3 rounded-lg border border-gray-200 dark:border-border-dark">
              <p className="text-gray-400 text-[10px] uppercase">Tokens/s</p>
              <p className="text-gray-900 dark:text-white font-mono text-sm">
                {telemetry.tokensPerSecond || '--'}
              </p>
            </div>
          </div>
        </div>
      </div>
    </aside>
  );
}

export default LeftSidebar;
