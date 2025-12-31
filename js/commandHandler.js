// Command Handler Module
import { CONFIG, HELP_COMMANDS, QUOTES } from './config.js';
import { escapeHtml, generateProgressBar, getRandomQuote } from './utils.js';

export class CommandHandler {
    constructor(taskManager, shellExecutor, terminal) {
        this.taskManager = taskManager;
        this.shellExecutor = shellExecutor;
        this.terminal = terminal;
    }

    async execute(cmd, params) {
        switch (cmd) {
            // Task Management Commands
            case 'add':
                return this.handleAdd(params);
            case 'list':
            case 'ls':
                return this.handleList(params[0]);
            case 'done':
            case 'complete':
                return this.handleDone(params[0]);
            case 'delete':
            case 'rm':
                return this.handleDelete(params[0]);
            case 'edit':
                return this.handleEdit(params[0], params.slice(1).join(' '));
            case 'priority':
                return this.handlePriority(params[0], params[1]);
            case 'search':
            case 'find':
                return this.handleSearch(params.join(' '));
            
            // System Commands
            case 'stats':
                return this.handleStats();
            case 'export':
                return this.handleExport();
            case 'reset':
                return this.handleReset();
            case 'clear':
            case 'cls':
                return this.handleClear();
            case 'help':
            case '?':
                return this.handleHelp();
            case 'about':
                return this.handleAbout();
            
            // PowerShell Commands
            case 'ps':
                return await this.handlePowerShell(params.join(' '));
            case 'pwd':
            case 'whoami':
            case 'date':
                return await this.handlePowerShell(cmd);
            case 'cat':
            case 'type':
                return await this.handlePowerShell(`Get-Content ${params.join(' ')}`);
            
            // Easter Eggs
            case 'neofetch':
                return this.handleNeofetch();
            case 'fortune':
                return this.handleFortune();
            case 'matrix':
                return this.handleMatrix();
            
            default:
                // Try to execute as PowerShell command
                return await this.handlePowerShell(cmd + ' ' + params.join(' '));
        }
    }

    handleAdd(params) {
        if (params.length === 0) {
            return { error: 'Usage: add <task description> [priority]' };
        }

        const lastParam = params[params.length - 1].toLowerCase();
        let priority = 'medium';
        let description;

        if (CONFIG.PRIORITY_LEVELS.includes(lastParam)) {
            priority = lastParam;
            description = params.slice(0, -1).join(' ');
        } else {
            description = params.join(' ');
        }

        if (!description) {
            return { error: 'Task description cannot be empty' };
        }

        try {
            const task = this.taskManager.addTask(description, priority);
            return {
                success: `✓ Task added successfully!
  ID: ${task.id} | Priority: ${priority.toUpperCase()}`
            };
        } catch (error) {
            return { error: error.message };
        }
    }

    handleList(filter = 'all') {
        const tasks = this.taskManager.getTasks(filter);
        
        if (tasks.length === 0) {
            let message = 'No tasks found.';
            if (filter === 'all') {
                message += '\nUse \'add <task>\' to create your first task!';
            }
            return { warning: message };
        }

        const sorted = this.taskManager.sortTasks(tasks);
        let output = `<span class="info">═══════════════════════════════════════════════════════</span>
<span class="info">  TASKS (${filter.toUpperCase()}) - Total: ${tasks.length}</span>
<span class="info">═══════════════════════════════════════════════════════</span>\n`;

        sorted.forEach(task => {
            const status = task.completed ? '✓' : '○';
            const statusClass = task.completed ? 'completed' : '';
            const priorityBadge = `<span class="task-priority ${task.priority}">${task.priority.toUpperCase()}</span>`;
            
            output += `<div class="task-item ${task.priority} ${statusClass}">
    <span class="task-id">[${task.id}]</span> ${status} ${escapeHtml(task.description)} ${priorityBadge}
</div>`;
        });

        return { html: output };
    }

    handleDone(id) {
        if (!id) {
            return { error: 'Usage: done <task_id>' };
        }

        try {
            const task = this.taskManager.completeTask(id);
            const celebrations = [
                '🎉 Great job!',
                '⭐ Awesome work!',
                '🚀 Task crushed!',
                '💪 You rock!',
                '🎯 Nailed it!'
            ];
            const celebration = celebrations[Math.floor(Math.random() * celebrations.length)];
            
            return {
                success: `✓ Task completed: ${escapeHtml(task.description)}
${celebration}`
            };
        } catch (error) {
            return { error: error.message };
        }
    }

    handleDelete(id) {
        if (!id) {
            return { error: 'Usage: delete <task_id>' };
        }

        try {
            const task = this.taskManager.deleteTask(id);
            return { success: `✓ Deleted: ${escapeHtml(task.description)}` };
        } catch (error) {
            return { error: error.message };
        }
    }

    handleEdit(id, newDescription) {
        if (!id || !newDescription) {
            return { error: 'Usage: edit <task_id> <new description>' };
        }

        try {
            const { task, oldDescription } = this.taskManager.editTask(id, newDescription);
            return {
                success: `✓ Task updated:
  <span class="warning">Old:</span> ${escapeHtml(oldDescription)}
  <span class="info">New:</span> ${escapeHtml(newDescription)}`
            };
        } catch (error) {
            return { error: error.message };
        }
    }

    handlePriority(id, priority) {
        if (!id || !priority) {
            return { error: 'Usage: priority <task_id> <high|medium|low>' };
        }

        try {
            this.taskManager.setPriority(id, priority);
            return { success: `✓ Priority updated to ${priority.toUpperCase()}` };
        } catch (error) {
            return { error: error.message };
        }
    }

    handleSearch(query) {
        if (!query) {
            return { error: 'Usage: search <keyword>' };
        }

        const results = this.taskManager.searchTasks(query);
        if (results.length === 0) {
            return { warning: `No tasks matching: "${query}"` };
        }

        let output = `<span class="info">Found ${results.length} task(s) matching "${query}":</span>\n`;
        results.forEach(task => {
            const status = task.completed ? '✓' : '○';
            output += `  <span class="task-id">[${task.id}]</span> ${status} ${escapeHtml(task.description)}\n`;
        });

        return { info: output };
    }

    handleStats() {
        const stats = this.taskManager.getStats();
        
        const output = `<span class="info">╔═══════════════════════════════════════════════════════╗</span>
<span class="info">║              📊 TASK STATISTICS                       ║</span>
<span class="info">╠═══════════════════════════════════════════════════════╣</span>
<span class="info">║</span>  Total Tasks:        <span class="success">${String(stats.total).padStart(5)}</span>                          <span class="info">║</span>
<span class="info">║</span>  Completed:          <span class="success">${String(stats.completed).padStart(5)}</span>                          <span class="info">║</span>
<span class="info">║</span>  Pending:            <span class="warning">${String(stats.pending).padStart(5)}</span>                          <span class="info">║</span>
<span class="info">╠═══════════════════════════════════════════════════════╣</span>
<span class="info">║</span>  <span class="error">High Priority:    ${String(stats.high).padStart(5)}</span>                          <span class="info">║</span>
<span class="info">║</span>  <span class="warning">Medium Priority:  ${String(stats.medium).padStart(5)}</span>                          <span class="info">║</span>
<span class="info">║</span>  <span class="success">Low Priority:     ${String(stats.low).padStart(5)}</span>                          <span class="info">║</span>
<span class="info">╠═══════════════════════════════════════════════════════╣</span>
<span class="info">║</span>  Progress: [${generateProgressBar(stats.percentage)}] ${String(stats.percentage).padStart(3)}%   <span class="info">║</span>
<span class="info">╚═══════════════════════════════════════════════════════╝</span>`;

        return { html: output };
    }

    handleExport() {
        if (this.taskManager.tasks.length === 0) {
            return { warning: 'No tasks to export' };
        }

        const data = this.taskManager.exportTasks();
        const blob = new Blob([data], { type: 'application/json' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `tasks_${new Date().toISOString().slice(0, 10)}.json`;
        a.click();
        URL.revokeObjectURL(url);

        return { success: '✓ Tasks exported to JSON file' };
    }

    handleReset() {
        const count = this.taskManager.reset();
        if (count === 0) {
            return { warning: 'No tasks to reset' };
        }
        return { success: `✓ Deleted ${count} task(s). Fresh start!` };
    }

    handleClear() {
        this.terminal.clearOutput();
        return { info: 'Terminal cleared. Type \'help\' for commands.' };
    }

    handleHelp() {
        let output = `<div class="help-section">
<span class="info">╔═══════════════════════════════════════════════════════╗</span>
<span class="info">║            TERMINAL TASK MANAGER - COMMANDS           ║</span>
<span class="info">╚═══════════════════════════════════════════════════════╝</span>\n`;

        for (const [category, commands] of Object.entries(HELP_COMMANDS)) {
            output += `\n<span class="warning">▸ ${category}</span>\n<table class="help-table">`;
            for (const [cmd, desc] of Object.entries(commands)) {
                output += `<tr><td>${cmd}</td><td>${desc}</td></tr>`;
            }
            output += `</table>`;
        }

        output += `\n<span class="warning">TIP:</span> Use arrow keys to navigate command history
<span class="warning">TIP:</span> Press TAB to auto-complete commands
</div>`;

        return { html: output };
    }

    handleAbout() {
        const output = `<span class="info">╔═══════════════════════════════════════════════════════╗</span>
<span class="info">║         TERMINAL TASK MANAGER v${CONFIG.VERSION}                  ║</span>
<span class="info">╠═══════════════════════════════════════════════════════╣</span>
<span class="info">║</span>  A retro terminal-style task management app           <span class="info">║</span>
<span class="info">║</span>  built with vanilla JavaScript, HTML & CSS.           <span class="info">║</span>
<span class="info">║</span>                                                        <span class="info">║</span>
<span class="info">║</span>  <span class="success">Features:</span>                                           <span class="info">║</span>
<span class="info">║</span>  • Modular ES6 architecture                           <span class="info">║</span>
<span class="info">║</span>  • PowerShell command simulation                      <span class="info">║</span>
<span class="info">║</span>  • Priority-based task management                     <span class="info">║</span>
<span class="info">║</span>  • Local storage persistence                          <span class="info">║</span>
<span class="info">║</span>  • Export to JSON                                     <span class="info">║</span>
<span class="info">║</span>  • CRT monitor effects                                <span class="info">║</span>
<span class="info">║</span>  • Command history & auto-complete                    <span class="info">║</span>
<span class="info">║</span>                                                        <span class="info">║</span>
<span class="info">║</span>  <span class="warning">Made with ❤️ and lots of coffee</span>                     <span class="info">║</span>
<span class="info">╚═══════════════════════════════════════════════════════╝</span>`;

        return { html: output };
    }

    async handlePowerShell(command) {
        if (!command.trim()) {
            return { error: 'Usage: ps <PowerShell command>' };
        }

        const result = await this.shellExecutor.executeCommand(command);
        
        if (!result.success) {
            return { warning: result.error };
        }

        return { info: `<pre class="shell-output">${result.output}</pre>` };
    }

    handleNeofetch() {
        const stats = this.taskManager.getStats();
        const memoryUsed = (performance.memory?.usedJSHeapSize / 1024 / 1024)?.toFixed(2) || 'N/A';
        const uptime = Math.floor((Date.now() - (performance.timing?.navigationStart || Date.now())) / 1000);

        const output = `<span class="success">        .--.           </span> <span class="info">guest@taskman</span>
<span class="success">       |o_o |          </span> <span class="info">--------------</span>
<span class="success">       |:_/ |          </span> <span class="warning">OS:</span> ${CONFIG.APP_NAME} v${CONFIG.VERSION}
<span class="success">      //   \\ \\         </span> <span class="warning">Host:</span> Web Browser
<span class="success">     (|     | )        </span> <span class="warning">Kernel:</span> JavaScript ES6+
<span class="success">    /'\\_   _/\`\\        </span> <span class="warning">Shell:</span> TerminalShell 1.0
<span class="success">    \\___)=(___/        </span> <span class="warning">Tasks:</span> ${stats.total} total, ${stats.completed} done
<span class="success">                        </span> <span class="warning">Memory:</span> ${memoryUsed} MB
<span class="success">                        </span> <span class="warning">Uptime:</span> ${uptime}s`;

        return { html: output };
    }

    handleFortune() {
        const quote = getRandomQuote(QUOTES);
        return { info: `🔮 "${quote}"` };
    }

    handleMatrix() {
        let existing = document.getElementById('matrixCanvas');
        if (existing) {
            existing.remove();
            return { warning: 'Matrix mode: OFF' };
        }

        const canvas = document.createElement('canvas');
        canvas.id = 'matrixCanvas';
        canvas.style.cssText = 'position:fixed;top:0;left:0;width:100%;height:100%;z-index:-1;opacity:0.15;';
        document.body.appendChild(canvas);

        const ctx = canvas.getContext('2d');
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;

        const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789@#$%^&*()';
        const fontSize = 14;
        const columns = canvas.width / fontSize;
        const drops = Array(Math.floor(columns)).fill(1);

        function draw() {
            ctx.fillStyle = 'rgba(0, 0, 0, 0.05)';
            ctx.fillRect(0, 0, canvas.width, canvas.height);
            ctx.fillStyle = '#0f0';
            ctx.font = fontSize + 'px monospace';

            for (let i = 0; i < drops.length; i++) {
                const text = chars[Math.floor(Math.random() * chars.length)];
                ctx.fillText(text, i * fontSize, drops[i] * fontSize);
                if (drops[i] * fontSize > canvas.height && Math.random() > 0.975) {
                    drops[i] = 0;
                }
                drops[i]++;
            }
        }

        setInterval(draw, 33);
        return { success: 'Matrix mode: ON' };
    }
}
