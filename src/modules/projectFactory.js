const PROJECT_STATUS={
    ACTIVE:'active',
    ARCHIVED:'archived'
};

const PROJECT_COLOR={
    BLUE: '#3498db',
    GREEN: '#2ecc71',
    PURPLE: '#9b59b6',
    ORANGE: '#e67e22',
    RED: '#e74c3c',
    TEAL: '#1abc9c'
};

// validation module
const projectValidation={
    /**
     * 
     * @param {string} name-project name 
     * @returns {string} validated name
     */

    validateName(name){
        // type check
        if(typeof name !=='string'){
            throw new Error ('Project name must be string');
        }

        const trimmedName=name.trim();

        if(trimmedName.length<2){
            throw new Error ('Project name must be at least 2 character long');
        }

        
        if(trimmedName.length>50){
            throw new Error ('Project name cannot exceed 50 characters');
        }
        return trimmedName;
    },

    /**
     * 
     * @param {string} status project status 
     * @returns {string} validated status
     */

    validateStatus(status){
        if(!Object.values(PROJECT_STATUS).includes(status)){
            throw new Error(`Invalid status. Must be one of: ${Object.values(PROJECT_STATUS).join(', ')}`);
        }
        return status;
    }
};

/**
 * 
 * @param {Object} params -project creation parameters 
 * @returns {Object} project instance
 */


function createProject({
    name,
    description='',
    status=PROJECT_STATUS.ACTIVE
}){
    // VALIDATE INPUT
    const validatedName=projectValidation.validateName(name);

    // Create a closure variable to store status
    let validatedStatus = projectValidation.validateStatus(status);

    // generate unique id
    const id=`project_${Date.now()}_${Math.random().toString(36).substr(2,9)}`;

    // create certain date
    const createdAt=new Date();

    // create todo storage
    const todoStorage=[];

    return{
        getId(){
            return id;
        },

        getName(){
            return validatedName;
        },
        getDescription(){
            return description
        },
        getStatus(){
            return validatedStatus;
        },
        getCreatedAt(){
            return createdAt;
        },
        changeStatus(newStatus) {
            // Validate new status
         validatedStatus = projectValidation.validateStatus(newStatus);
            
            // Return the current instance with updated status
            return this;
        },
        addTodo(todo){
            if(!todo || typeof todo.getId!=='function'){
                throw new Error ('Invalid todo object');
            }
            todo.setProjectId(this.getId());
            todoStorage.push(todo);
            return this;
        },
        removeTodo(todoId){
            const index=todoStorage.findIndex(todo=>todo.getId()==todoId);

            if(index!==-1){
                const removedTodo = todoStorage.splice(index, 1)[0];
                removedTodo.setProjectId(null);
            }
            return this;
        },
        getTodos(){
            return [...todoStorage];
        },
        getTotalTodos(){
            return todoStorage.length;
        },
        getCompletedTodos(){
            return todoStorage.filter(todo=>todo.getStatus()==='completed');
        },
        hasTodo(todoId) {
            return todoStorage.some(todo => todo.getId() === todoId);
        },

        toJSON(){
            return{
                id,
                name:validatedName,
                description,
                status:validatedStatus,
                createdAt,
                todos:todoStorage.map(todo=>todo.toJSON())
            };
        }
    };
}

// Attach constants to the factory
createProject.STATUS = PROJECT_STATUS;
createProject.COLORS = PROJECT_COLOR;

export default createProject;