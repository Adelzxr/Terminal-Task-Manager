// Configuration and Constants
export const CONFIG = {
    APP_NAME: 'Terminal Task Manager',
    VERSION: '1.0.0',
    STORAGE_KEY: 'terminal_tasks',
    PROMPT: 'guest@taskman:~$',
    PRIORITY_LEVELS: ['high', 'medium', 'low'],
    PRIORITY_ORDER: { high: 0, medium: 1, low: 2 }
};

export const QUOTES = [
    "Any fool can write code that a computer can understand. Good programmers write code that humans can understand. - Martin Fowler",
    "First, solve the problem. Then, write the code. - John Johnson",
    "Code is like humor. When you have to explain it, it is bad. - Cory House",
    "Programming is not about what you know; it is about what you can figure out. - Chris Pine",
    "The best error message is the one that never shows up. - Thomas Fuchs",
    "Simplicity is the soul of efficiency. - Austin Freeman",
    "Make it work, make it right, make it fast. - Kent Beck",
    "Talk is cheap. Show me the code. - Linus Torvalds",
    "Sometimes it pays to stay in bed on Monday, rather than spending the rest of the week debugging Monday code. - Dan Salomon",
    "Debugging is twice as hard as writing the code in the first place. - Brian Kernighan",
    "The only way to learn a new programming language is by writing programs in it. - Dennis Ritchie",
    "Experience is the name everyone gives to their mistakes. - Oscar Wilde",
    "Code never lies, comments sometimes do. - Ron Jeffries",
    "Perfection is achieved not when there is nothing more to add, but rather when there is nothing more to take away. - Antoine de Saint-Exupery"
];

export const HELP_COMMANDS = {
    'Task Management': {
        'add <task> [priority]': 'Add a new task (priority: high/medium/low)',
        'list [filter]': 'List tasks (all/pending/done/high/medium/low)',
        'done <id>': 'Mark a task as completed',
        'delete <id>': 'Delete a task',
        'edit <id> <text>': 'Edit a task description',
        'priority <id> <level>': 'Change task priority',
        'search <query>': 'Search tasks by keyword'
    },
    'System Commands': {
        'stats': 'Show detailed statistics',
        'export': 'Export tasks to JSON file',
        'reset': 'Delete all tasks',
        'clear': 'Clear terminal output',
        'help': 'Show this help menu',
        'about': 'About this application'
    },
    'PowerShell Integration': {
        'ps <command>': 'Execute PowerShell command',
        'pwd': 'Print working directory',
        'ls [path]': 'List directory contents',
        'cat <file>': 'Display file contents'
    },
    'Easter Eggs': {
        'neofetch': 'Display system info',
        'fortune': 'Get a random programming quote',
        'matrix': 'Toggle Matrix rain effect'
    }
};
