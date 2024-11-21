export function overlayManager(stateManager, contentManager) {
    const overlay = document.getElementById('creaion-overlay');
    const addProjectBtn = document.getElementById('add-project-btn');
    const addTodoBtn = document.getElementById('add-todo-btn');

    function setupEventListeners() {
        if (addProjectBtn) {
            addProjectBtn.addEventListener('click', showProjectCreationForm);
        }
        
        if (addTodoBtn) {
            addTodoBtn.addEventListener('click', showTodoCreationForm);
        }

        // Close overlay when clicking outside
        if (overlay) {
            overlay.addEventListener('click', (event) => {
                if (event.target === overlay) {
                    hideOverlay();
                }
            });
        }
    }

    function showProjectCreationForm() {
        if (!overlay) return;

        const overlayContent = overlay.querySelector('.overlay-content');
        if (!overlayContent) return;
        
        overlayContent.innerHTML = `
            <form id="project-creation-form">
                <h2>Create New Project</h2>
                <div class="form-group">
                    <label for="project-name">Project Name</label>
                    <input 
                        type="text" 
                        id="project-name" 
                        name="project-name" 
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
                    ></textarea>
                </div>
                <div class="form-group">
                    <label for="project-status">Status</label>
                    <select id="project-status" name="project-status">
                        <option value="active">Active</option>
                        <option value="archived">Archived</option>
                    </select>
                </div>
                <div class="form-actions">
                    <button type="submit" class="btn btn-primary">Create Project</button>
                    <button type="button" class="btn btn-secondary" id="cancel-project-creation">Cancel</button>
                </div>
            </form>
        `;

        const form = overlayContent.querySelector('#project-creation-form');
        form.addEventListener('submit', handleProjectCreation);

        const cancelBtn = overlayContent.querySelector('#cancel-project-creation');
        cancelBtn.addEventListener('click', hideOverlay);

        overlay.style.display = 'flex';
    }

    function showTodoCreationForm() {
        if (!overlay) return;

        const overlayContent = overlay.querySelector('.overlay-content');
        if (!overlayContent) return;

        // Get current projects for project selection
        const projects = stateManager.getAllProjects();
        const projectOptions = Object.values(projects)
            .map(project => `<option value="${project.getId()}">${project.getName()}</option>`)
            .join('');
        
        overlayContent.innerHTML = `
            <form id="todo-creation-form">
                <h2>Create New Todo</h2>
                <div class="form-group">
                    <label for="todo-title">Todo Title</label>
                    <input 
                        type="text" 
                        id="todo-title" 
                        name="todo-title" 
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
                    ></textarea>
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
                        required
                    >
                </div>
                <div class="form-group">
                    <label for="todo-priority">Priority</label>
                    <select id="todo-priority" name="todo-priority">
                        <option value="low">Low</option>
                        <option value="medium">Medium</option>
                        <option value="high">High</option>
                    </select>
                </div>
                <div class="form-actions">
                    <button type="submit" class="btn btn-primary">Create Todo</button>
                    <button type="button" class="btn btn-secondary" id="cancel-todo-creation">Cancel</button>
                </div>
            </form>
        `;

        const form = overlayContent.querySelector('#todo-creation-form');
        form.addEventListener('submit', handleTodoCreation);

        const cancelBtn = overlayContent.querySelector('#cancel-todo-creation');
        cancelBtn.addEventListener('click', hideOverlay);

        // Set default date to today
        const dueDateInput = overlayContent.querySelector('#todo-due-date');
        dueDateInput.valueAsDate = new Date();

        overlay.style.display = 'flex';
    }

    function handleProjectCreation(event) {
        event.preventDefault();
        
        const nameInput = event.target.querySelector('#project-name');
        const descInput = event.target.querySelector('#project-description');
        const statusInput = event.target.querySelector('#project-status');

        try {
            // Create project
            const newProject = stateManager.createProject({
                name: nameInput.value,
                description: descInput.value || '',
                status: statusInput.value
            });

            hideOverlay();
            
            // Refresh project list
            if (contentManager && typeof contentManager.renderProjects === 'function') {
                contentManager.renderProjects();
            } else {
                console.error('Content manager or renderProjects method not found');
            }

            // Reset form
            event.target.reset();
        } catch (error) {
            console.error('Project Creation Error:', error);
            alert(error.message);
        }
    }

    function handleTodoCreation(event) {
        event.preventDefault();
        
        const titleInput = event.target.querySelector('#todo-title');
        const descInput = event.target.querySelector('#todo-description');
        const projectInput = event.target.querySelector('#todo-project');
        const dueDateInput = event.target.querySelector('#todo-due-date');
        const priorityInput = event.target.querySelector('#todo-priority');

        try {
            // Create todo for specific project
            const newTodo = stateManager.createTodoForProject(projectInput.value, {
                title: titleInput.value,
                description: descInput.value || '',
                dueDate: new Date(dueDateInput.value),
                priority: priorityInput.value
            });

            hideOverlay();
            
            // Refresh content based on current view
            const projectsBtn = document.getElementById('project-btn');
            const todosBtn = document.getElementById('todo-btn');

            if (projectsBtn.classList.contains('active')) {
                contentManager.renderProjects();
            } else {
                contentManager.renderTodos();
            }

            // Reset form
            event.target.reset();
        } catch (error) {
            console.error('Todo Creation Error:', error);
            alert(error.message);
        }
    }

    function hideOverlay() {
        if (overlay) {
            overlay.style.display = 'none';
        }
    }

    return {
        setupEventListeners,
        showProjectCreationForm,
        showTodoCreationForm,
        hideOverlay
    };
}