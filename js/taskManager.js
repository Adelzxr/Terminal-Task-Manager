// Task Management Module
import { CONFIG } from './config.js';

export class TaskManager {
    constructor() {
        this.tasks = this.loadTasks();
    }

    loadTasks() {
        const saved = localStorage.getItem(CONFIG.STORAGE_KEY);
        return saved ? JSON.parse(saved) : [];
    }

    saveTasks() {
        localStorage.setItem(CONFIG.STORAGE_KEY, JSON.stringify(this.tasks));
    }

    addTask(description, priority = 'medium') {
        if (!CONFIG.PRIORITY_LEVELS.includes(priority)) {
            throw new Error(`Invalid priority. Use: ${CONFIG.PRIORITY_LEVELS.join(', ')}`);
        }

        const task = {
            id: Date.now(),
            description: description,
            priority: priority,
            completed: false,
            createdAt: new Date().toISOString(),
            completedAt: null
        };

        this.tasks.push(task);
        this.saveTasks();
        return task;
    }

    getTask(id) {
        return this.tasks.find(t => t.id === parseInt(id));
    }

    getTasks(filter = 'all') {
        let filtered = [...this.tasks];

        switch (filter.toLowerCase()) {
            case 'pending':
                return filtered.filter(t => !t.completed);
            case 'done':
            case 'completed':
                return filtered.filter(t => t.completed);
            case 'high':
            case 'medium':
            case 'low':
                return filtered.filter(t => t.priority === filter.toLowerCase());
            default:
                return filtered;
        }
    }

    completeTask(id) {
        const task = this.getTask(id);
        if (!task) {
            throw new Error(`Task not found: ${id}`);
        }
        if (task.completed) {
            throw new Error('Task is already completed');
        }

        task.completed = true;
        task.completedAt = new Date().toISOString();
        this.saveTasks();
        return task;
    }

    deleteTask(id) {
        const index = this.tasks.findIndex(t => t.id === parseInt(id));
        if (index === -1) {
            throw new Error(`Task not found: ${id}`);
        }

        const task = this.tasks[index];
        this.tasks.splice(index, 1);
        this.saveTasks();
        return task;
    }

    editTask(id, newDescription) {
        const task = this.getTask(id);
        if (!task) {
            throw new Error(`Task not found: ${id}`);
        }

        const oldDescription = task.description;
        task.description = newDescription;
        this.saveTasks();
        return { task, oldDescription };
    }

    setPriority(id, priority) {
        if (!CONFIG.PRIORITY_LEVELS.includes(priority.toLowerCase())) {
            throw new Error(`Invalid priority. Use: ${CONFIG.PRIORITY_LEVELS.join(', ')}`);
        }

        const task = this.getTask(id);
        if (!task) {
            throw new Error(`Task not found: ${id}`);
        }

        task.priority = priority.toLowerCase();
        this.saveTasks();
        return task;
    }

    searchTasks(query) {
        return this.tasks.filter(t => 
            t.description.toLowerCase().includes(query.toLowerCase())
        );
    }

    getStats() {
        const total = this.tasks.length;
        const completed = this.tasks.filter(t => t.completed).length;
        const pending = total - completed;
        const high = this.tasks.filter(t => t.priority === 'high' && !t.completed).length;
        const medium = this.tasks.filter(t => t.priority === 'medium' && !t.completed).length;
        const low = this.tasks.filter(t => t.priority === 'low' && !t.completed).length;
        const percentage = total > 0 ? Math.round((completed / total) * 100) : 0;

        return { total, completed, pending, high, medium, low, percentage };
    }

    exportTasks() {
        return JSON.stringify(this.tasks, null, 2);
    }

    reset() {
        const count = this.tasks.length;
        this.tasks = [];
        this.saveTasks();
        return count;
    }

    sortTasks(tasks) {
        return tasks.sort((a, b) => {
            if (a.completed !== b.completed) return a.completed ? 1 : -1;
            return CONFIG.PRIORITY_ORDER[a.priority] - CONFIG.PRIORITY_ORDER[b.priority];
        });
    }
}
