function createSidebarManager(stateManager, contentManager) {
    const projectsBtn = document.getElementById('project-btn');
    const todosBtn = document.getElementById('todo-btn');
    const addProjectBtn = document.getElementById('add-project-btn');
    const addTodoBtn = document.getElementById('add-todo-btn');
    const contentHeader = document.querySelector('.content-header h1');

    function initialize() {
        if (projectsBtn) {
            projectsBtn.addEventListener('click', () => switchView('projects'));
        }
        
        if (todosBtn) {
            todosBtn.addEventListener('click', () => switchView('todos'));
        }

        switchView('projects');
    }

    function switchView(view) {
        if (projectsBtn) {
            projectsBtn.classList.toggle('active', view === 'projects');
        }
        if (todosBtn) {
            todosBtn.classList.toggle('active', view === 'todos');
        }

        if (contentHeader) {
            contentHeader.textContent = view === 'projects' ? 'Projects' : 'Todos';
        }

        if (addProjectBtn) {
            addProjectBtn.style.display = view === 'projects' ? 'block' : 'none';
        }
        if (addTodoBtn) {
            addTodoBtn.style.display = view === 'todos' ? 'block' : 'none';
        }

        if (view === 'projects') {
            contentManager.renderProjects();
        } else {
            contentManager.renderTodos();
        }
    }

    return {
        initialize,
        switchView
    };
}

export default createSidebarManager;