// Main Application Entry Point
import { TaskManager } from './js/taskManager.js';
import { ShellExecutor } from './js/shellExecutor.js';
import { CommandHandler } from './js/commandHandler.js';
import { Terminal } from './js/terminal.js';

class TerminalTaskManagerApp {
    constructor() {
        this.init();
    }

    init() {
        // Initialize modules
        this.taskManager = new TaskManager();
        this.shellExecutor = new ShellExecutor();
        
        // Wait for DOM to be ready
        if (document.readyState === 'loading') {
            document.addEventListener('DOMContentLoaded', () => this.start());
        } else {
            this.start();
        }
    }

    start() {
        // Create command handler with dependencies
        this.commandHandler = new CommandHandler(
            this.taskManager,
            this.shellExecutor,
            null // Terminal will be set after creation
        );

        // Create terminal UI
        this.terminal = new Terminal(this.commandHandler);
        this.commandHandler.terminal = this.terminal;

        // Make taskManager globally accessible for stats updates
        window.taskManager = this.taskManager;

        // Update initial stats
        this.terminal.updateStats();

        console.log('%c Terminal Task Manager Started! ', 'background: #00ff41; color: #0a0a0a; font-size: 16px; font-weight: bold;');
        console.log('%c Type "help" to see available commands ', 'color: #00ff41; font-size: 12px;');
    }
}

// Start the application
new TerminalTaskManagerApp();
