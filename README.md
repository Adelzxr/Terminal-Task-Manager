# 🖥️ Terminal Task Manager

<div align="center">

![Terminal Task Manager](https://img.shields.io/badge/version-1.0.0-green.svg)
![License](https://img.shields.io/badge/license-MIT-blue.svg)
![JavaScript](https://img.shields.io/badge/JavaScript-ES6+-yellow.svg)

A retro-style terminal task management application with CRT monitor effects, built with vanilla JavaScript, HTML, and CSS.

[Live Demo](#) · [Report Bug](#) · [Request Feature](#)

</div>

---

## ✨ Features

- 🎨 **Retro CRT Terminal Design** - Authentic terminal look with scanlines, glow effects, and cursor animation
- ⌨️ **Command-Line Interface** - Familiar terminal commands for power users
- 📝 **Full Task Management** - Add, edit, delete, complete, and search tasks
- 🎯 **Priority Levels** - High, Medium, Low priority with visual indicators
- 💾 **Persistent Storage** - Tasks saved to localStorage automatically
- 📊 **Live Statistics** - Real-time stats panel with progress tracking
- 📤 **Export to JSON** - Backup your tasks anytime
- ⬆️ **Command History** - Navigate previous commands with arrow keys
- 🔤 **Auto-Complete** - Tab to auto-complete commands
- 🐣 **Easter Eggs** - Try `neofetch`, `fortune`, or `matrix`!

## 🚀 Quick Start

1. Clone the repository:
```bash
git clone https://github.com/yourusername/terminal-task-manager.git
```

2. Open `index.html` in your browser

3. Start typing commands!

## 📖 Commands

| Command | Description |
|---------|-------------|
| `help` | Show all available commands |
| `add <task> [priority]` | Add a new task (priority: high/medium/low) |
| `list [filter]` | List tasks (all/pending/done/high/medium/low) |
| `done <id>` | Mark a task as completed |
| `delete <id>` | Delete a task |
| `edit <id> <text>` | Edit a task's description |
| `priority <id> <level>` | Change task priority |
| `search <query>` | Search tasks by keyword |
| `stats` | Show detailed statistics |
| `export` | Export tasks to JSON file |
| `reset` | Delete all tasks |
| `clear` | Clear terminal output |
| `about` | About this application |

### 🐣 Easter Eggs

| Command | Description |
|---------|-------------|
| `neofetch` | Display system info (Linux-style) |
| `fortune` | Get a random programming quote |
| `matrix` | Toggle Matrix rain effect |

## 🎮 Usage Examples

```bash
# Add a high priority task
add "Fix critical bug in production" high

# Add a regular task
add "Update documentation"

# List only pending tasks
list pending

# Complete a task
done 1704067200000

# Search for tasks
search bug

# Change priority
priority 1704067200000 low
```

## 💻 Technologies

- **HTML5** - Semantic markup
- **CSS3** - Animations, CRT effects, Flexbox
- **JavaScript (ES6+)** - Classes, LocalStorage API, DOM manipulation
- **Google Fonts** - Fira Code monospace font

## 🎨 Customization

The terminal uses CSS custom properties for easy theming:

```css
:root {
    --terminal-green: #00ff41;
    --terminal-bg: #0a0a0a;
    --error-red: #ff3333;
    --warning-yellow: #ffff00;
    --info-cyan: #00ffff;
}
```

## 📁 Project Structure

```
terminal-task-manager/
├── index.html      # Main HTML file
├── styles.css      # Styling and animations
├── app.js          # Application logic
└── README.md       # Documentation
```

## 🤝 Contributing

Contributions are welcome! Feel free to:

1. Fork the project
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📝 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- Inspired by classic terminal emulators
- CRT effect techniques from various CSS experiments
- Font: [Fira Code](https://github.com/tonsky/FiraCode)

---

<div align="center">

Made with ❤️ and lots of ☕

⭐ Star this repo if you found it useful!

</div>
