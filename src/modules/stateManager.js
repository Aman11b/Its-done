// src/modules/stateManager.js
import createTodo from './todoFactory.js';
import createProject from './projectFactory.js';

const createAppStateManager = () => {
    const appState = {
        projectCollection: {
            // projectID: projectObjects
        },
        todoCollection: {
            // todoID: todoObject
        },
        projectTodoMapping: {
            // projectID: [todoId1....]
        }
    };

    return {
        // Create a new project
        createProject(projectData) {
            const newProject = createProject(projectData);

            const projectId = newProject.getId();

            // Store project in collection
            appState.projectCollection[projectId] = newProject;
            
            // Initialize project's todo mapping
            appState.projectTodoMapping[projectId] = [];

            return newProject;
        },

        // Get project by ID
        getProject(projectId) {
            return appState.projectCollection[projectId] || null;
        },

        // Create todo for a specific project
        createTodoForProject(projectId, todoData) {
            const project = this.getProject(projectId);
            if (!project) {
                throw new Error(`Project with ID ${projectId} not found`);
            }

            const newTodo = createTodo({
                ...todoData,
                projectId: projectId
            });

            const todoId = newTodo.getId();

            // Store todo in collection
            appState.todoCollection[todoId] = newTodo;
            
            // Add todo to project's todo mapping
            appState.projectTodoMapping[projectId].push(todoId);

            // Add todo to project
            project.addTodo(newTodo);

            return newTodo;
        },

        // Get todos for a specific project
        getProjectTodos(projectId) {
            const project = this.getProject(projectId);
            if (!project) {
                throw new Error(`Project with ID ${projectId} not found`);
            }

            return project.getTodos();
        },

        // Get todo by ID
        getTodo(todoId) {
            return appState.todoCollection[todoId] || null;
        },

        // Remove todo from a project
        removeTodoFromProject(projectId, todoId) {
            const project = this.getProject(projectId);
            const todo = this.getTodo(todoId);

            if (!project || !todo) {
                throw new Error('Invalid project or todo ID');
            }

            // Remove todo from project's todo mapping
            appState.projectTodoMapping[projectId] = 
                appState.projectTodoMapping[projectId].filter(id => id !== todoId);

            // Remove todo from project
            project.removeTodo(todoId);

            // Optionally remove from todo collection
            delete appState.todoCollection[todoId];

            return true;
        },
        getAllProjects(){
            return appState.projectCollection;
        },
        getAllTodos(){
            return appState.todoCollection;
        },
        cleanState(){
            appState.projectCollection = {};
            appState.todoCollection = {};
            appState.projectTodoMapping = {};
            return true;           
        }
    };
};

export default createAppStateManager;