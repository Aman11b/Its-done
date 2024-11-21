function createContentManager(stateManager) {
    const contentArea = document.getElementById('content-area');
    const overlay = document.getElementById('creaion-overlay');

    function createTodoCard(todo) {
        const card = document.createElement('div');
        card.classList.add('todo-card', 'masonry-item');

        // Add status class for visual indication
        card.classList.add(`todo-status-${todo.getStatus()}`);

        card.innerHTML = `
            <div class="card-header">
                <h3>${todo.getTitle()}</h3>
                <div class="card-actions">
                    <button class="toggle-todo-status" data-todo-id="${todo.getId()}">
                        <i class="fas ${getStatusIcon(todo.getStatus())}"></i>
                    </button>
                    <button class="edit-todo" data-todo-id="${todo.getId()}">
                        <i class="fas fa-edit"></i>
                    </button>
                    <button class="delete-todo" data-todo-id="${todo.getId()}">
                        <i class="fas fa-trash"></i>
                    </button>
                </div>
            </div>
            <span class="todo-priority ${todo.getPriority()}">
                ${todo.getPriority()}
            </span>
            <p class="todo-description">${todo.getDescription()}</p>
            <div class="todo-details">
                <span>Due: ${todo.getDueDate()}</span>
                <span>Status: ${todo.getStatus()}</span>
            </div>
        `;

        // Add event listeners for toggle, edit, and delete
        const toggleBtn = card.querySelector('.toggle-todo-status');
        const editBtn = card.querySelector('.edit-todo');
        const deleteBtn = card.querySelector('.delete-todo');

        if (toggleBtn) {
            toggleBtn.addEventListener('click', () => handleTodoStatusToggle(todo));
        }

        if (editBtn) {
            editBtn.addEventListener('click', () => handleTodoEdit(todo));
        }

        if (deleteBtn) {
            deleteBtn.addEventListener('click', () => handleTodoDelete(todo));
        }

        return card;
    }

    function getStatusIcon(status) {
        switch(status) {
            case 'pending': return 'fa-circle';
            case 'in-progress': return 'fa-spinner';
            case 'completed': return 'fa-check-circle';
            default: return 'fa-circle';
        }
    }

    function handleTodoStatusToggle(todo) {
        try {
            // Toggle todo status using state manager
            stateManager.toggleTodoStatus(todo.getId());
            
            // Refresh content based on current view
            const projectsBtn = document.getElementById('project-btn');
            
            if (projectsBtn.classList.contains('active')) {
                renderProjects();
            } else {
                renderTodos();
            }
        } catch (error) {
            console.error('Error toggling todo status:', error);
            alert('Failed to update todo status. Please try again.');
        }
    }
  
    function renderProjects() {
        // Clear previous content and reset class
        contentArea.innerHTML = '';
        contentArea.classList.add('masonry-grid');

        const projects = stateManager.getAllProjects();

        if (Object.keys(projects).length === 0) {
            contentArea.innerHTML = `
                <div class="no-projects">
                    <p>No projects found. Create your first project!</p>
                </div>
            `;
            return;
        }

        Object.values(projects).forEach(project => {
            const projectCard = createProjectCard(project);
            contentArea.appendChild(projectCard);
        });
    }

    function renderTodos() {
        // Clear previous content and reset class
        contentArea.innerHTML = '';
        contentArea.classList.add('masonry-grid');

        const todos = stateManager.getAllTodos();

        if (Object.keys(todos).length === 0) {
            contentArea.innerHTML = `
                <div class="no-todos">
                    <p>No todos found. Create your first todo!</p>
                </div>
            `;
            return;
        }

        Object.values(todos).forEach(todo => {
            const todoCard = createTodoCard(todo);
            contentArea.appendChild(todoCard);
        });
    }

    function createProjectCard(project) {
        const card = document.createElement('div');
        card.classList.add('project-card', 'masonry-item');
        
        const projectTodos = project.getTodos();

        card.innerHTML = `
            <div class="card-header">
                <h3>${project.getName()}</h3>
                <div class="card-actions">
                    <button class="edit-project" data-project-id="${project.getId()}">
                        <i class="fas fa-edit"></i>
                    </button>
                    <button class="delete-project" data-project-id="${project.getId()}">
                        <i class="fas fa-trash"></i>
                    </button>
                </div>
            </div>
            <span class="project-status ${project.getStatus()}">
                ${project.getStatus()}
            </span>
            <p class="project-description">${project.getDescription()}</p>
            <div class="project-todos">
                <h4>Todos (${projectTodos.length})</h4>
                ${projectTodos.length > 0 ? 
                    projectTodos.map(todo => `
                        <div class="todo-item">
                            <span>${todo.getTitle()}</span>
                            <span class="todo-priority ${todo.getPriority()}">
                                ${todo.getPriority()}
                            </span>
                        </div>
                    `).join('') : 
                    '<p>No todos in this project</p>'
                }
            </div>
        `;

        // Add event listeners for edit and delete
        const editBtn = card.querySelector('.edit-project');
        const deleteBtn = card.querySelector('.delete-project');

        if (editBtn) {
            editBtn.addEventListener('click', () => handleProjectEdit(project));
        }

        if (deleteBtn) {
            deleteBtn.addEventListener('click', () => handleProjectDelete(project));
        }

        return card;
    }

    function createTodoCard(todo) {
        const card = document.createElement('div');
        card.classList.add('todo-card', 'masonry-item');

        card.innerHTML = `
            <div class="card-header">
                <h3>${todo.getTitle()}</h3>
                <div class="card-actions">
                    <button class="complete-todo" data-todo-id="${todo.getId()}">
                        <i class="fas fa-check"></i>
                    </button>
                    <button class="edit-todo" data-todo-id="${todo.getId()}">
                        <i class="fas fa-edit"></i>
                    </button>
                    <button class="delete-todo" data-todo-id="${todo.getId()}">
                        <i class="fas fa-trash"></i>
                    </button>
                </div>
            </div>
            <span class="todo-priority ${todo.getPriority()}">
                ${todo.getPriority()}
            </span>
            <p class="todo-description">${todo.getDescription()}</p>
            <div class="todo-details">
                <span>Due: ${todo.getDueDate()}</span>
                <span>Status: ${todo.getStatus()}</span>
            </div>
        `;

        // Add event listeners for edit, delete, and complete
        const editBtn = card.querySelector('.edit-todo');
        const deleteBtn = card.querySelector('.delete-todo');
        const completeBtn = card.querySelector('.complete-todo');

        if (editBtn) {
            editBtn.addEventListener('click', () => handleTodoEdit(todo));
        }

        if (deleteBtn) {
            deleteBtn.addEventListener('click', () => handleTodoDelete(todo));
        }

        if (completeBtn) {
            completeBtn.addEventListener('click', () => handleTodoComplete(todo));
        }

        return card;
    }

    function handleProjectEdit(project) {
        if (!overlay) return;

        const overlayContent = overlay.querySelector('.overlay-content');
        if (!overlayContent) return;

        overlayContent.innerHTML = `
            <form id="project-edit-form">
                <h2>Edit Project</h2>
                <div class="form-group">
                    <label for="project-name">Project Name</label>
                    <input 
                        type="text" 
                        id="project-name" 
                        name="project-name" 
                        value="${project.getName()}"
                        required 
                        minlength="2" 
                        maxlength="50"
                    >
                </div>
                <div class="form-group">
                    <label for="project-description">Description</label>
                    <textarea 
                        id="project-description" 
                        name="project-description"
                        maxlength="200"
                    >${project.getDescription()}</textarea>
                </div>
                <div class="form-group">
                    <label for="project-status">Status</label>
                    <select id="project-status" name="project-status">
                        <option value="active" ${project.getStatus() === 'active' ? 'selected' : ''}>Active</option>
                        <option value="archived" ${project.getStatus() === 'archived' ? 'selected' : ''}>Archived</option>
                    </select>
                </div>
                <div class="form-actions">
                    <button type="submit" class="btn btn-primary">Update Project</button>
                    <button type="button" class="btn btn-secondary" id="cancel-project-edit">Cancel</button>
                </div>
            </form>
        `;

        const form = overlayContent.querySelector('#project-edit-form');
        form.addEventListener('submit', (event) => {
            event.preventDefault();
            
            const nameInput = event.target.querySelector('#project-name');
            const descInput = event.target.querySelector('#project-description');
            const statusInput = event.target.querySelector('#project-status');

            try {
                // Edit project using state manager
                stateManager.editProject(project.getId(), {
                    name: nameInput.value,
                    description: descInput.value,
                    status: statusInput.value
                });

                // Hide overlay
                overlay.style.display = 'none';
                
                // Refresh project list
                renderProjects();
            } catch (error) {
                console.error('Project Edit Error:', error);
                alert(error.message);
            }
        });

        const cancelBtn = overlayContent.querySelector('#cancel-project-edit');
        cancelBtn.addEventListener('click', () => {
            overlay.style.display = 'none';
        });

        overlay.style.display = 'flex';
    }

    function handleProjectDelete(project) {
        const confirmDelete = window.confirm(`Are you sure you want to delete the project "${project.getName()}"?`);
        
        if (confirmDelete) {
            try {
                // Remove project from state manager
                stateManager.removeProject(project.getId());
                
                // Re-render projects
                renderProjects();
            } catch (error) {
                console.error('Error deleting project:', error);
                alert('Failed to delete project. Please try again.');
            }
        }
    }

    function handleTodoEdit(todo) {
        if (!overlay) return;

        const overlayContent = overlay.querySelector('.overlay-content');
        if (!overlayContent) return;

        // Get current projects for project selection
        const projects = stateManager.getAllProjects();
        const projectOptions = Object.values(projects)
            .map(project => `
                <option 
                    value="${project.getId()}" 
                    ${project.getId() === todo.getProjectId() ? 'selected' : ''}
                >
                    ${project.getName()}
                </option>
            `)
            .join('');
        
        overlayContent.innerHTML = `
            <form id="todo-edit-form">
                <h2>Edit Todo</h2>
                <div class="form-group">
                    <label for="todo-title">Todo Title</label>
                    <input 
                        type="text" 
                        id="todo-title" 
                        name="todo-title" 
                        value="${todo.getTitle()}"
                        required 
                        minlength="3" 
                        maxlength="100"
                    >
                </div>
                <div class="form-group">
                    <label for="todo-description">Description</label>
                    <textarea 
                        id="todo-description" 
                        name="todo-description"
                        maxlength="200"
                    >${todo.getDescription()}</textarea>
                </div>
                <div class="form-group">
                    <label for="todo-project">Project</label>
                    <select id="todo-project" name="todo-project" required>
                        ${projectOptions}
                    </select>
                </div>
                <div class="form-group">
                    <label for="todo-due-date">Due Date</label>
                    <input 
                        type="date" 
                        id="todo-due-date" 
                        name="todo-due-date" 
                        value="${todo.getDueDate()}"
                        required
                    >
                </div>
                <div class="form-group">
                    <label for="todo-priority">Priority</label>
                    <select id="todo-priority" name="todo-priority">
                        <option value="low" ${todo.getPriority() === 'low' ? 'selected' : ''}>Low</option>
                        <option value="medium" ${todo.getPriority() === 'medium' ? 'selected' : ''}>Medium</option>
                        <option value="high" ${todo.getPriority() === 'high' ? 'selected' : ''}>High</option>
                    </select>
                </div>
                <div class="form-actions">
                    <button type="submit" class="btn btn-primary">Update Todo</button>
                    <button type="button" class="btn btn-secondary" id="cancel-todo-edit">Cancel</button>
                </div>
            </form>
        `;

        const form = overlayContent.querySelector('#todo-edit-form');
        form.addEventListener('submit', (event) => {
            event.preventDefault();
            
            const titleInput = event.target.querySelector('#todo-title');
            const descInput = event.target.querySelector('#todo-description');
            const projectInput = event.target.querySelector('#todo-project');
            const dueDateInput = event.target.querySelector('#todo-due-date');
            const priorityInput = event.target.querySelector('#todo-priority');

            try {
                // Edit todo using state manager
                stateManager.editTodo(todo.getId(), {
                    title: titleInput.value,
                    description: descInput.value,
                    projectId: projectInput.value,
                    dueDate: new Date(dueDateInput.value),
                    priority: priorityInput.value
                });

                // Hide overlay
                overlay.style.display = 'none';
                
                // Refresh content based on current view
                const projectsBtn = document.getElementById('project-btn');
                
                if (projectsBtn.classList.contains('active')) {
                    renderProjects();
                } else {
                    renderTodos();
                }
            } catch (error) {
                console.error('Todo Edit Error:', error);
                alert(error.message);
            }
        });

        const cancelBtn = overlayContent.querySelector('#cancel-todo-edit');
        cancelBtn.addEventListener('click', () => {
            overlay.style.display = 'none';
        });

        overlay.style.display = 'flex';
    }

    function handleTodoDelete(todo) {
        const confirmDelete = window.confirm(`Are you sure you want to delete the todo "${todo.getTitle()}"?`);
        
        if (confirmDelete) {
            try {
                // Remove todo from state manager
                stateManager.removeTodo(todo.getId());
                
                // Refresh content based on current view
                const projectsBtn = document.getElementById('project-btn');
                
                if (projectsBtn.classList.contains('active')) {
                    renderProjects();
                } else {
                    renderTodos();
                }
            } catch (error) {
                console.error('Error deleting todo:', error);
                alert('Failed to delete todo. Please try again.');
            }
        }
    }

    function handleTodoComplete(todo) {
        try {
            // Mark todo as complete using state manager
            stateManager.markTodoComplete(todo.getId());
            
            // Refresh content based on current view
            const projectsBtn = document.getElementById('project-btn');
            
            if (projectsBtn.classList.contains('active')) {
                renderProjects();
            } else {
                renderTodos();
            }
        } catch (error) {
            console.error('Error completing todo:', error);
            alert('Failed to mark todo as complete. Please try again.');
        }
    }

    return {
        renderProjects,
        renderTodos
    };
}

export default createContentManager;