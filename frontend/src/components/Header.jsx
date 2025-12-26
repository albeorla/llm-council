function Header({ onNewSession }) {
  return (
    <header className="flex items-center justify-between whitespace-nowrap border-b border-solid border-gray-200 dark:border-border-dark bg-surface-light dark:bg-surface-dark px-6 py-3 z-20 shadow-sm shrink-0">
      <div className="flex items-center gap-4 text-gray-900 dark:text-white">
        <div className="size-8 text-primary flex items-center justify-center">
          <span className="material-symbols-outlined text-[32px] icon-fill">groups</span>
        </div>
        <h2 className="text-gray-900 dark:text-white text-xl font-bold leading-tight tracking-tight">LLM Council</h2>
      </div>

      <div className="flex flex-1 justify-end items-center gap-6">
        <nav className="hidden md:flex items-center gap-8">
          <button
            onClick={onNewSession}
            className="text-gray-500 dark:text-gray-400 hover:text-primary dark:hover:text-primary text-sm font-medium transition-colors"
          >
            New Session
          </button>
          <span className="text-primary text-sm font-bold border-b-2 border-primary py-1">
            Current Session
          </span>
          <button className="text-gray-500 dark:text-gray-400 hover:text-primary dark:hover:text-primary text-sm font-medium transition-colors">
            History
          </button>
          <button className="text-gray-500 dark:text-gray-400 hover:text-primary dark:hover:text-primary text-sm font-medium transition-colors">
            Settings
          </button>
        </nav>

        <div className="flex gap-3 items-center">
          <button className="flex items-center justify-center size-10 rounded-full hover:bg-gray-200 dark:hover:bg-card-dark text-gray-500 dark:text-gray-400 transition-colors">
            <span className="material-symbols-outlined">notifications</span>
          </button>
          <div className="h-6 w-[1px] bg-gray-300 dark:bg-border-dark mx-1"></div>
          <div
            className="bg-center bg-no-repeat aspect-square bg-cover rounded-full size-9 ring-2 ring-primary/20 bg-gradient-to-br from-primary to-purple-600"
            title="User Profile"
          />
        </div>
      </div>
    </header>
  );
}

export default Header;
