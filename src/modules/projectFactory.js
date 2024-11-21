// src/modules/projectFactory.js
const PROJECT_STATUS = {
    ACTIVE: 'active',
    ARCHIVED: 'archived'
};

const PROJECT_COLOR = {
    BLUE: '#3498db',
    GREEN: '#2ecc71',
    PURPLE: '#9b59b6',
    ORANGE: '#e67e22',
    RED: '#e74c3c',
    TEAL: '#1abc9c'
};

// Validation module
const projectValidation = {
    /**
     * Validate project name
     * @param {string} name - project name 
     * @returns {string} validated name
     */
    validateName(name) {
        // Type check
        if (typeof name !== 'string') {
            throw new Error('Project name must be a string');
        }

        const trimmedName = name.trim();

        if (trimmedName.length < 2) {
            throw new Error('Project name must be at least 2 characters long');
        }
        
        if (trimmedName.length > 50) {
            throw new Error('Project name cannot exceed 50 characters');
        }
        return trimmedName;
    },

    /**
     * Validate project status
     * @param {string} status - project status 
     * @returns {string} validated status
     */
    validateStatus(status) {
        if (!Object.values(PROJECT_STATUS).includes(status)) {
            throw new Error(`Invalid status. Must be one of: ${Object.values(PROJECT_STATUS).join(', ')}`);
        }
        return status;
    },

    /**
     * Validate project description
     * @param {string} description - project description
     * @returns {string} validated description
     */
    validateDescription(description) {
        if (description === undefined) return '';
        
        if (typeof description !== 'string') {
            throw new Error('Project description must be a string');
        }

        return description.trim().slice(0, 200);
    }
};

/**
 * Create a project instance
 * @param {Object} params - project creation parameters 
 * @returns {Object} project instance
 */
function createProject({
    name,
    description = '',
    status = PROJECT_STATUS.ACTIVE,
    color = null
}) {
    // Validate inputs
    const validatedName = projectValidation.validateName(name);
    const validatedDescription = projectValidation.validateDescription(description);
    const validatedStatus = projectValidation.validateStatus(status);

    // Generate unique id
    const id = `project_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;

    // Create creation date
    const createdAt = new Date();

    // Todo storage
    const todoStorage = [];

    // Project instance
    const projectInstance = {
        // Getters
        getId() {
            return id;
        },

        getName() {
            return validatedName;
        },

        getDescription() {
            return validatedDescription;
        },

        getStatus() {
            return validatedStatus;
        },

        getCreatedAt() {
            return createdAt;
        },

        getColor() {
            return color;
        },

        // Mutator methods
        updateName(newName) {
            return createProject({
                name: newName,
                description: validatedDescription,
                status: validatedStatus,
                color
            });
        },

        updateDescription(newDescription) {
            return createProject({
                name: validatedName,
                description: newDescription,
                status: validatedStatus,
                color
            });
        },

        changeStatus(newStatus) {
            return createProject({
                name: validatedName,
                description: validatedDescription,
                status: newStatus,
                color
            });
        },

        // Todo management methods
        addTodo(todo) {
            if (!todo || typeof todo.getId !== 'function') {
                throw new Error('Invalid todo object');
            }
            
            // Set project ID for todo
            todo.setProjectId(id);
            
            // Add to todo storage
            todoStorage.push(todo);
            
            return this;
        },

        removeTodo(todoId) {
            const index = todoStorage.findIndex(todo => todo.getId() === todoId);

            if (index !== -1) {
                const removedTodo = todoStorage.splice(index, 1)[0];
                removedTodo.setProjectId(null);
            }
            
            return this;
        },

        getTodos() {
            return [...todoStorage];
        },

        getTotalTodos() {
            return todoStorage.length;
        },

        getCompletedTodos() {
            return todoStorage.filter(todo => todo.getStatus() === 'completed');
        },

        hasTodo(todoId) {
            return todoStorage.some(todo => todo.getId() === todoId);
        },

        // Serialization method
        toJSON() {
            return {
                id,
                name: validatedName,
                description: validatedDescription,
                status: validatedStatus,
                color,
                createdAt,
                todos: todoStorage.map(todo => todo.toJSON())
            };
        }
    };

    return projectInstance;
}

// Attach constants to the factory
createProject.STATUS = PROJECT_STATUS;
createProject.COLORS = PROJECT_COLOR;

export default createProject;