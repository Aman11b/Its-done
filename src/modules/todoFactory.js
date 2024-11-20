// import date manipulation library for robust data handling

import { format, isValid, isFuture} from 'date-fns';

// enum-like object for priority and status

const PRIORITY={
    LOW:'low',
    MEDIUM:'medium',
    HIGH:'high'
};

const STATUS={
    PENDING:'pending',
    IN_PROGRESS:'in-progress',
    COMPLETED:'completed',
    CANCELLED:'cancelled'
};

// validation function moved before they are used
const todoValidation={
    /**
    * validation and sanitizes the todo titles
    * @param {string} title-the title of the todo
    * @returns {string} cleaned and validated title
    * @throws {Error} if title is valid
    */
    validateTitle(title){
        // ensure title is a string
        if(typeof title!=='string'){
            throw new Error ('title must be string');
        }

        // trim whitespace
        const cleanTitle=title.trim();
    
        // validate rules
        if(!cleanTitle){
            throw new Error('title cannot be empty');
        }
    
        if(cleanTitle.length<3){
            throw new Error("Title must be at least 3 character long");
        }
    
        if(cleanTitle.length>100){
            throw new Error("title cannot exceed 100 characters");
        }
    
        return cleanTitle;
    },

    /**
    * validate the due date
    * @param {Date} dueDate-the due date for the todo
    * @returns {Date} validate due date
    * @throws {Error} if date is invalid
    */

    validateDueDate(dueDate){
        // Check if date is a valid Date object
        if (!(dueDate instanceof Date)) {
            throw new Error('Due date must be a Date object');
        }

        // check if date is valid
        if(!isValid(dueDate)){
            throw new Error("Invalid date");
        }
        // ensure due date is in the future
        if(!isFuture(dueDate)){
            throw new Error("due date must be in the future");
        }
        return dueDate;
    },

    /**
    * validate priority level
    * @param {string} priority-the priority of the todo
    * @returns {string} validate priority
    * @throws {Error}  if priority is invalid
    */

    validatePriority(priority){
        // Ensure priority is a string
        if (typeof priority !== 'string') {
            throw new Error('Priority must be a string');
        }

        // convert to lowercase for consistancy
        const normalizedPriority=priority.toLowerCase();
    
        if(!Object.values(PRIORITY).includes(normalizedPriority)){
            throw new Error(`invalid priority .must be on of ${Object.values(PRIORITY).join(', ')}`);
        }
    
        return normalizedPriority;
    }

};

/**
 * factory function to create todo items
 * @param {Object} todoParams-parameter for creating a todo
 * @returns {Object} todo item with method
 */

function createTodo({
    title,
    description='',
    dueDate,
    priority=PRIORITY.LOW,
    projectId=null
}){
    // VALIDATE INPUT
    const validateTitle=todoValidation.validateTitle(title);
    const validateDueDate=todoValidation.validateDueDate(dueDate);
    const validatePriority=todoValidation.validatePriority(priority);

    // generate unique id using timestamp with millisecond precision

    const id=`todo_${Date.now()}_${Math.random().toString(36).substr(2,9)}`;

    // private states
    let currentStatus=STATUS.PENDING;
    const createdAt=new Date();
    let completedAt=null;
    let currentProjectId = projectId;

    return{
        // immutable getters
        getId:()=>id,
        getTitle:()=>validateTitle,
        getDescription:()=>description,
        getDueDate:()=>format(validateDueDate,'PPP'),
        getPriority:()=>validatePriority,
        getStatus:()=>currentStatus,
        getCreatedAt:()=>format(createdAt,'PPP'),

        // mutable methods

        updateTitle(newTitle){
            return createTodo({
                title:newTitle,
                description,
                dueDate:validateDueDate,
                priority:validatePriority
            });
        },

        // Existing methods
        getProjectId() {
            return currentProjectId;
        },

        setProjectId(newProjectId) {
            currentProjectId = newProjectId;
            return this;
        },

        markComplete(){
            currentStatus=STATUS.COMPLETED;
            completedAt=new Date();
            return this;
        },

        // additional helper methods
        isOverdue(){
            return currentStatus!==STATUS.COMPLETED &&new Date()>validateDueDate;
        },
        // serialization for storage
        toJSON(){
            return{
                id,
                title:validateTitle,
                description,
                dueDate:validateDueDate,
                priority:validatePriority,
                status:currentStatus,
                createdAt,
                completedAt
            };
        }
    };
}

// export constants for external use
createTodo.PRIORITY=PRIORITY;
createTodo.STATUS=STATUS;

export default createTodo;
