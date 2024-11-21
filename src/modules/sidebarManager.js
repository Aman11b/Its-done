// src/modules/sidebarManager.js
export function sidebarManager(stateManager) {
    const projectsBtn = document.getElementById('project-btn');
    const todosBtn = document.getElementById('todo-btn');
    const statusButtons = document.querySelectorAll('.sidebar-status button');
    const addProjectBtn = document.getElementById('add-project-btn');
    const addTodoBtn = document.getElementById('add-todo-btn');

    function initialize() {
        // Ensure buttons exist before adding event listeners
        if (projectsBtn) {
            projectsBtn.addEventListener('click', () => switchView('projects'));
        }
        
        if (todosBtn) {
            todosBtn.addEventListener('click', () => switchView('todos'));
        }
        
        statusButtons.forEach(button => {
            button.addEventListener('click', handleStatusFilter);
        });

        // Initially hide add todo button
        if (addTodoBtn) {
            addTodoBtn.style.display = 'none';
        }
    }

    function switchView(view) {
        const contentHeader = document.querySelector('.content-header h1');
        
        if (view === 'projects') {
            // Projects view
            if (projectsBtn) projectsBtn.classList.add('active');
            if (todosBtn) todosBtn.classList.remove('active');
            
            if (contentHeader) contentHeader.textContent = 'Projects';
            
            if (addProjectBtn) addProjectBtn.style.display = 'block';
            if (addTodoBtn) addTodoBtn.style.display = 'none';
        } else {
            // Todos view
            if (todosBtn) todosBtn.classList.add('active');
            if (projectsBtn) projectsBtn.classList.remove('active');
            
            if (contentHeader) contentHeader.textContent = 'Todos';
            
            if (addProjectBtn) addProjectBtn.style.display = 'none';
            if (addTodoBtn) addTodoBtn.style.display = 'block';
        }
    }

    function handleStatusFilter(event) {
        const filterType = event.target.textContent;
        console.log(`Filtering by: ${filterType}`);
        // Implement actual filtering logic
    }

    return {
        initialize,
        switchView,
        handleStatusFilter
    };
}