// Utility Functions

export function escapeHtml(text) {
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
}

export function parseCommand(command) {
    const args = command.match(/(?:[^\s"]+|"[^"]*")+/g) || [];
    const cmd = args[0]?.toLowerCase();
    const params = args.slice(1).map(p => p.replace(/^"|"$/g, ''));
    return { cmd, params, raw: command };
}

export function formatDate(dateString) {
    const date = new Date(dateString);
    return date.toLocaleDateString() + ' ' + date.toLocaleTimeString();
}

export function generateProgressBar(percentage, length = 20) {
    const filled = Math.round(percentage / (100 / length));
    const empty = length - filled;
    return '<span class="success">' + '█'.repeat(filled) + '</span>' + '░'.repeat(empty);
}

export function getRandomQuote(quotes) {
    return quotes[Math.floor(Math.random() * quotes.length)];
}

export function debounce(func, wait) {
    let timeout;
    return function executedFunction(...args) {
        const later = () => {
            clearTimeout(timeout);
            func(...args);
        };
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
    };
}
