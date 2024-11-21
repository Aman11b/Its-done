// src/modules/stateManager.js
import createTodo from './todoFactory.js';
import createProject from './projectFactory.js';

function createAppStateManager() {
    const appState = {
        projectCollection: {},
        todoCollection: {},
        projectTodoMapping: {}
    };

    return {
        createProject(projectData) {
            // Ensure a method to update name and description exists in project factory
            const newProject = createProject({
                ...projectData,
                // Add a method to update project details
                updateName: function(newName) {
                    this.name = newName;
                    return this;
                },
                updateDescription: function(newDesc) {
                    this.description = newDesc;
                    return this;
                }
            });
            const projectId = newProject.getId();

            appState.projectCollection[projectId] = newProject;
            appState.projectTodoMapping[projectId] = [];

            return newProject;
        },

        getProject(projectId) {
            return appState.projectCollection[projectId] || null;
        },

        editProject(projectId, updatedData) {
            const project = this.getProject(projectId);
            if (!project) {
                throw new Error(`Project with ID ${projectId} not found`);
            }

            // Ensure methods exist for updating
            if (updatedData.name) {
                if (typeof project.updateName === 'function') {
                    project.updateName(updatedData.name);
                } else {
                    project.name = updatedData.name;
                }
            }

            if (updatedData.description !== undefined) {
                if (typeof project.updateDescription === 'function') {
                    project.updateDescription(updatedData.description);
                } else {
                    project.description = updatedData.description;
                }
            }

            if (updatedData.status) {
                if (typeof project.changeStatus === 'function') {
                    project.changeStatus(updatedData.status);
                } else {
                    project.status = updatedData.status;
                }
            }

            return project;
        },

        removeProject(projectId) {
            const project = this.getProject(projectId);
            if (!project) {
                throw new Error(`Project with ID ${projectId} not found`);
            }

            // Remove all todos associated with this project
            const projectTodos = this.getProjectTodos(projectId);
            projectTodos.forEach(todo => {
                this.removeTodo(todo.getId());
            });

            // Remove project from collections
            delete appState.projectCollection[projectId];
            delete appState.projectTodoMapping[projectId];

            return true;
        },

        createTodoForProject(projectId, todoData) {
            const project = this.getProject(projectId);
            if (!project) {
                throw new Error(`Project with ID ${projectId} not found`);
            }

            // Ensure due date is a Date object
            const dueDate = todoData.dueDate instanceof Date 
                ? todoData.dueDate 
                : new Date(todoData.dueDate);

            const newTodo = createTodo({
                ...todoData,
                dueDate,
                projectId: projectId
            });

            const todoId = newTodo.getId();

            appState.todoCollection[todoId] = newTodo;
            appState.projectTodoMapping[projectId].push(todoId);
            project.addTodo(newTodo);

            return newTodo;
        },

        editTodo(todoId, updatedData) {
            const todo = this.getTodo(todoId);
            if (!todo) {
                throw new Error(`Todo with ID ${todoId} not found`);
            }

            // Remove todo from current project
            const currentProjectId = todo.getProjectId();
            if (currentProjectId) {
                const currentProject = this.getProject(currentProjectId);
                if (currentProject) {
                    currentProject.removeTodo(todoId);
                }
            }

            // Create updated todo
            const updatedTodo = createTodo({
                title: updatedData.title || todo.getTitle(),
                description: updatedData.description !== undefined 
                    ? updatedData.description 
                    : todo.getDescription(),
                dueDate: updatedData.dueDate 
                    ? new Date(updatedData.dueDate) 
                    : new Date(todo.getDueDate()),
                priority: updatedData.priority || todo.getPriority(),
                projectId: updatedData.projectId || todo.getProjectId()
            });

            // Update todo in collection
            appState.todoCollection[todoId] = updatedTodo;

            // Add to new project if project changed
            const newProjectId = updatedData.projectId || currentProjectId;
            if (newProjectId) {
                const newProject = this.getProject(newProjectId);
                if (newProject) {
                    newProject.addTodo(updatedTodo);
                }
            }

            return updatedTodo;
        },

        markTodoComplete(todoId) {
            const todo = this.getTodo(todoId);
            if (!todo) {
                throw new Error(`Todo with ID ${todoId} not found`);
            }

            // Ensure markComplete method exists
            if (typeof todo.markComplete === 'function') {
                todo.markComplete();
            } else {
                todo.status = 'completed';
            }

            return todo;
        },

        removeTodo(todoId) {
            const todo = this.getTodo(todoId);
            if (!todo) {
                throw new Error(`Todo with ID ${todoId} not found`);
            }

            // Remove from project's todo list
            const projectId = todo.getProjectId();
            if (projectId) {
                const project = this.getProject(projectId);
                if (project) {
                    project.removeTodo(todoId);
                }

                // Remove from project's todo mapping
                appState.projectTodoMapping[projectId] = 
                    appState.projectTodoMapping[projectId].filter(id => id !== todoId);
            }

            // Remove from todo collection
            delete appState.todoCollection[todoId];

            return true;
        },

        getProjectTodos(projectId) {
            const project = this.getProject(projectId);
            return project ? project.getTodos() : [];
        },

        getTodo(todoId) {
            return appState.todoCollection[todoId] || null;
        },

        removeTodoFromProject(projectId, todoId) {
            const project = this.getProject(projectId);
            const todo = this.getTodo(todoId);

            if (!project || !todo) {
                throw new Error('Invalid project or todo ID');
            }

            appState.projectTodoMapping[projectId] = 
                appState.projectTodoMapping[projectId].filter(id => id !== todoId);

            project.removeTodo(todoId);
            delete appState.todoCollection[todoId];

            return true;
        },

        getAllProjects() {
            return appState.projectCollection;
        },

        getAllTodos() {
            return appState.todoCollection;
        },

        // Additional utility methods
        getProjectById(projectId) {
            return this.getProject(projectId);
        },

        getTodoById(todoId) {
            return this.getTodo(todoId);
        },

        cleanState() {
            appState.projectCollection = {};
            appState.todoCollection = {};
            appState.projectTodoMapping = {};
            return true;
        },

        markTodoComplete(todoId) {
            const todo = this.getTodo(todoId);
            if (!todo) {
                throw new Error(`Todo with ID ${todoId} not found`);
            }

            // Create a new todo instance with completed status
            const completedTodo = createTodo({
                ...todo.toJSON(),
                status: 'completed'
            });

            // Update todo in collections
            appState.todoCollection[todoId] = completedTodo;

            // Update in project's todo list if applicable
            const projectId = todo.getProjectId();
            if (projectId) {
                const project = this.getProject(projectId);
                if (project) {
                    // Remove old todo and add completed todo
                    project.removeTodo(todoId);
                    project.addTodo(completedTodo);
                }
            }

            return completedTodo;
        },

        // Add method to toggle todo status
        toggleTodoStatus(todoId) {
            const todo = this.getTodo(todoId);
            if (!todo) {
                throw new Error(`Todo with ID ${todoId} not found`);
            }

            let newStatus;
            switch(todo.getStatus()) {
                case 'pending':
                    newStatus = 'in-progress';
                    break;
                case 'in-progress':
                    newStatus = 'completed';
                    break;
                case 'completed':
                    newStatus = 'pending';
                    break;
                default:
                    newStatus = 'pending';
            }

            // Create a new todo with updated status
            const updatedTodo = createTodo({
                ...todo.toJSON(),
                status: newStatus
            });

            // Update todo in collections
            appState.todoCollection[todoId] = updatedTodo;

            // Update in project's todo list if applicable
            const projectId = todo.getProjectId();
            if (projectId) {
                const project = this.getProject(projectId);
                if (project) {
                    project.removeTodo(todoId);
                    project.addTodo(updatedTodo);
                }
            }

            return updatedTodo;
        }
    };
}

export default createAppStateManager;