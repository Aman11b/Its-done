import createTodo from './todoFactory.js';
import createProject from './projectFactory.js';

function createStorageManager() {
    const store = window.localStorage;

    const safeJsonParse = (jsonString) => {
        try {
            return JSON.parse(jsonString);
        } catch (error) {
            console.error('JSON Parsing Error:', error.message);
            return null;
        }
    };

    const safeJsonStringify = (data) => {
        try {
            return JSON.stringify(data, (key, value) => {
                if (value instanceof Date) {
                    return value.toISOString();
                }
                return value;
            });
        } catch (error) {
            console.error('JSON Stringify Error:', error.message);
            return null;
        }
    };

    const DEFAULT_PROJECTS = [
        {
            name: 'Personal Development',
            description: 'Goals and tasks for personal growth',
            status: 'active'
        },
        {
            name: 'Work Projects',
            description: 'Professional tasks and objectives',
            status: 'active'
        }
    ];

    const DEFAULT_TODOS = [
        {
            projectName: 'Personal Development',
            todos: [
                {
                    title: 'Read 20 pages daily',
                    description: 'Consistent reading for personal development',
                    dueDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
                    priority: 'high'
                }
            ]
        },
        {
            projectName: 'Work Projects',
            todos: [
                {
                    title: 'Prepare quarterly report',
                    description: 'Compile and analyze quarterly performance',
                    dueDate: new Date(Date.now() + 45 * 24 * 60 * 60 * 1000),
                    priority: 'high'
                }
            ]
        }
    ];

    function initializeDefaultData(stateManager) {
        const isFirstRun = !store.getItem('itsDoneAppState');

        if (isFirstRun) {
            const createdProjects = DEFAULT_PROJECTS.map(projectData => 
                stateManager.createProject(projectData)
            );

            DEFAULT_TODOS.forEach(projectTodos => {
                const matchingProject = createdProjects.find(
                    project => project.getName() === projectTodos.projectName
                );

                if (matchingProject) {
                    projectTodos.todos.forEach(todoData => {
                        stateManager.createTodoForProject(matchingProject.getId(), {
                            title: todoData.title,
                            description: todoData.description,
                            dueDate: todoData.dueDate,
                            priority: todoData.priority
                        });
                    });
                }
            });

            saveAppState(stateManager);
        }
    }

    function saveAppState(stateManager) {
        try {
            const appState = {
                projects: Object.values(stateManager.getAllProjects()).map(project => project.toJSON()),
                todos: Object.values(stateManager.getAllTodos()).map(todo => todo.toJSON())
            };

            const jsonString = safeJsonStringify(appState);

            if (jsonString) {
                store.setItem('itsDoneAppState', jsonString);
                console.log('App state saved successfully');
                return true;
            }
            return false;
        } catch (error) {
            console.error('App State Save Error:', error);
            return false;
        }
    }

    function restoreAppState(stateManager) {
        try {
            const storeState = store.getItem('itsDoneAppState');

            if (!storeState) {
                initializeDefaultData(stateManager);
                return true;
            }

            const parsedState = safeJsonParse(storeState);

            if (!parsedState) {
                console.log('Failed to parse stored state');
                return false;
            }

            if (parsedState.projects) {
                parsedState.projects.forEach(projectData => {
                    const project = stateManager.createProject({
                        name: projectData.name,
                        description: projectData.description,
                        status: projectData.status
                    });

                    if (projectData.todos) {
                        projectData.todos.forEach(todoData => {
                            stateManager.createTodoForProject(project.getId(), {
                                title: todoData.title,
                                description: todoData.description,
                                dueDate: new Date(todoData.dueDate),
                                priority: todoData.priority
                            });
                        });
                    }
                });
            }

            console.log('App state restored successfully');
            return true;
        } catch (error) {
            console.error('App State Restore Error:', error);
            return false;
        }
    }

    return {
        saveAppState,
        restoreAppState,
        initializeDefaultData
    };
}

export default createStorageManager;