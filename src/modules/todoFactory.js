import { format, isValid, isFuture, parseISO } from 'date-fns';

const PRIORITY = {
    LOW: 'low',
    MEDIUM: 'medium',
    HIGH: 'high'
};

const STATUS = {
    PENDING: 'pending',
    IN_PROGRESS: 'in-progress',
    COMPLETED: 'completed',
    CANCELLED: 'cancelled'
};

const todoValidation = {
    validateTitle(title) {
        if (typeof title !== 'string') {
            throw new Error('Title must be a string');
        }

        const cleanTitle = title.trim();

        if (!cleanTitle) {
            throw new Error('Title cannot be empty');
        }

        if (cleanTitle.length < 3) {
            throw new Error('Title must be at least 3 characters long');
        }

        if (cleanTitle.length > 100) {
            throw new Error('Title cannot exceed 100 characters');
        }

        return cleanTitle;
    },

    validateDueDate(dueDate) {
        const dateToValidate = dueDate instanceof Date 
            ? dueDate 
            : parseISO(dueDate);

        if (!isValid(dateToValidate)) {
            throw new Error('Invalid date');
        }

        return dateToValidate;
    },

    validatePriority(priority) {
        if (typeof priority !== 'string') {
            throw new Error('Priority must be a string');
        }

        const normalizedPriority = priority.toLowerCase();

        if (!Object.values(PRIORITY).includes(normalizedPriority)) {
            throw new Error(`Invalid priority. Must be one of: ${Object.values(PRIORITY).join(', ')}`);
        }

        return normalizedPriority;
    }
};

function createTodo({
    title,
    description = '',
    dueDate,
    priority = PRIORITY.LOW,
    status = STATUS.PENDING,
    projectId = null
}) {
    const validatedTitle = todoValidation.validateTitle(title);
    const validatedDueDate = todoValidation.validateDueDate(dueDate);
    const validatedPriority = todoValidation.validatePriority(priority);

    const id = `todo_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    const createdAt = new Date();
    let completedAt = null;
    let currentProjectId = projectId;
    let currentStatus = status;

    return {
        getId: () => id,
        getTitle: () => validatedTitle,
        getDescription: () => description,
        getDueDate: () => format(validatedDueDate, 'PPP'),
        getPriority: () => validatedPriority,
        getStatus: () => currentStatus,
        getCreatedAt: () => format(createdAt, 'PPP'),
        getProjectId: () => currentProjectId,
        getOriginalDueDate: () => validatedDueDate,

        setProjectId(newProjectId) {
            currentProjectId = newProjectId;
            return this;
        },

        markComplete() {
            currentStatus = STATUS.COMPLETED;
            completedAt = new Date();
            return this;
        },

        markInProgress() {
            currentStatus = STATUS.IN_PROGRESS;
            return this;
        },

        markPending() {
            currentStatus = STATUS.PENDING;
            return this;
        },

        isOverdue() {
            return currentStatus !== STATUS.COMPLETED && new Date() > validatedDueDate;
        },

        toJSON() {
            return {
                id,
                title: validatedTitle,
                description,
                dueDate: validatedDueDate,
                priority: validatedPriority,
                status: currentStatus,
                createdAt,
                completedAt,
                projectId: currentProjectId
            };
        }
    };
}

createTodo.PRIORITY = PRIORITY;
createTodo.STATUS = STATUS;

export default createTodo;