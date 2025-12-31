// Terminal UI Module
import { CONFIG } from './config.js';
import { parseCommand, escapeHtml } from './utils.js';

export class Terminal {
    constructor(commandHandler) {
        this.commandHandler = commandHandler;
        this.commandHistory = [];
        this.historyIndex = -1;
        this.output = document.getElementById('output');
        this.input = document.getElementById('commandInput');
        this.form = document.getElementById('commandForm');
        this.initEventListeners();
    }

    initEventListeners() {
        const self = this;
        
        // Form submit
        this.form.addEventListener('submit', function(e) {
            e.preventDefault();
            self.handleCommand();
        });

        // Keyboard events
        this.input.addEventListener('keydown', function(e) {
            self.handleKeyDown(e);
        });

        // Click to focus
        document.addEventListener('click', function() {
            self.input.focus();
        });

        // Focus on load
        this.input.focus();
        console.log('Terminal initialized successfully!');
    }

    handleKeyDown(e) {
        if (e.key === 'ArrowUp') {
            e.preventDefault();
            if (this.historyIndex > 0) {
                this.historyIndex--;
                this.input.value = this.commandHistory[this.historyIndex];
            }
        } else if (e.key === 'ArrowDown') {
            e.preventDefault();
            if (this.historyIndex < this.commandHistory.length - 1) {
                this.historyIndex++;
                this.input.value = this.commandHistory[this.historyIndex];
            } else {
                this.historyIndex = this.commandHistory.length;
                this.input.value = '';
            }
        } else if (e.key === 'Tab') {
            e.preventDefault();
            this.autoComplete();
        }
    }

    autoComplete() {
        const commands = [
            'help', 'add', 'list', 'done', 'delete', 'clear', 'priority', 
            'search', 'edit', 'stats', 'export', 'reset', 'about',
            'ps', 'pwd', 'ls', 'whoami', 'date', 'cat',
            'neofetch', 'fortune', 'matrix'
        ];
        const current = this.input.value.toLowerCase();
        const match = commands.find(cmd => cmd.startsWith(current));
        if (match) {
            this.input.value = match;
        }
    }

    async handleCommand() {
        const commandText = this.input.value.trim();
        if (!commandText) return;

        // Add to history
        this.commandHistory.push(commandText);
        this.historyIndex = this.commandHistory.length;

        // Echo command
        this.printLine(`<span class="prompt">${CONFIG.PROMPT}</span> ${escapeHtml(commandText)}`, false);

        // Parse and execute
        const { cmd, params } = parseCommand(commandText);
        
        if (!cmd) {
            this.input.value = '';
            return;
        }

        try {
            const result = await this.commandHandler.execute(cmd, params);
            this.displayResult(result);
        } catch (error) {
            this.printLine(`<span class="error">Error: ${error.message}</span>`);
        }

        // Clear input and scroll
        this.input.value = '';
        this.scrollToBottom();
        this.updateStats();
    }

    displayResult(result) {
        if (!result) return;

        if (result.html) {
            this.printLine(result.html, false);
        }
        if (result.success) {
            this.printLine(`<span class="success">${result.success}</span>`);
        }
        if (result.error) {
            this.printLine(`<span class="error">Error: ${result.error}</span>`);
            this.printLine(`<span class="info">Type 'help' for available commands</span>`);
        }
        if (result.warning) {
            this.printLine(`<span class="warning">${result.warning}</span>`);
        }
        if (result.info) {
            this.printLine(`<span class="info">${result.info}</span>`);
        }
    }

    printLine(content, animate = true) {
        const line = document.createElement('div');
        line.className = 'output-line' + (animate ? ' typing' : '');
        line.innerHTML = content;
        this.output.appendChild(line);
    }

    scrollToBottom() {
        this.output.scrollTop = this.output.scrollHeight;
    }

    clearOutput() {
        this.output.innerHTML = '';
    }

    updateStats() {
        // This will be called from the main app
        if (window.taskManager) {
            const stats = window.taskManager.getStats();
            document.getElementById('totalTasks').textContent = stats.total;
            document.getElementById('completedTasks').textContent = stats.completed;
            document.getElementById('pendingTasks').textContent = stats.pending;
            document.getElementById('highPriority').textContent = stats.high;
            document.getElementById('progressFill').style.width = stats.percentage + '%';
            document.getElementById('progressText').textContent = stats.percentage + '% Complete';
        }
    }
}
