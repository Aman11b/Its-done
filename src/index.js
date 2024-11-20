import '../src/styles/styles.css';

import createTodo from "./modules/todoFactory";
import createProject from "./modules/projectFactory";
import createStorageManager from "./modules/storageManager";
import createAppStateManager from "./modules/stateManager";

// Import animation libraries
import Typed from 'typed.js';
import { gsap } from 'gsap';

function initSplashScreen() {
    const splashScreen = document.getElementById('splash-screen');
    const mainApp = document.getElementById('main-app');

    // Simple Typed.js Animation
    new Typed('#typed-title', {
        strings: ['Lets mark ItsDone'],
        typeSpeed: 100,
        showCursor: false,
        onComplete: () => {
            // Fade out splash screen after typing
            gsap.to(splashScreen, {
                opacity: 0,
                duration: 1,
                onComplete: () => {
                    splashScreen.style.display = 'none';
                    mainApp.classList.remove('hidden');
                }
            });
        }
    });
}

function initApp() {
    // Create State and Storage Managers
    const stateManager = createAppStateManager();
    const storageManager = createStorageManager();

    // Attempt to restore previous state
    storageManager.restoreAppState(stateManager);

    // Initialize Splash Screen
    initSplashScreen();

    // Future: Add more initialization logic
}

// Run initialization when DOM is fully loaded
document.addEventListener('DOMContentLoaded', initApp);

document.addEventListener('DOMContentLoaded', () => {
    // Project Form Interaction
    const addProjectBtn = document.getElementById('add-project-btn');
    const projectFormContainer = document.getElementById('project-form-container');
    const cancelProjectFormBtn = document.getElementById('cancel-project-form');
    const projectCreationForm = document.getElementById('project-creation-form');

    // Todo Form Interaction
    const addTodoBtn = document.getElementById('add-todo-btn');
    const todoFormContainer = document.getElementById('todo-form-container');
    const cancelTodoFormBtn = document.getElementById('cancel-todo-form');
    const todoCreationForm = document.getElementById('todo-creation-form');

    // Color Picker Interaction
    const colorOptions = document.querySelectorAll('.color-option');
    const selectedProjectColorInput = document.getElementById('selected-project-color');

    // Project Form Show/Hide
    addProjectBtn.addEventListener('click', () => {
        projectFormContainer.classList.remove('hidden');
    });

    cancelProjectFormBtn.addEventListener('click', () => {
        projectFormContainer.classList.add('hidden');
        projectCreationForm.reset();
    });

    // Todo Form Show/Hide
    addTodoBtn.addEventListener('click', () => {
        todoFormContainer.classList.remove('hidden');
    });

    cancelTodoFormBtn.addEventListener('click', () => {
        todoFormContainer.classList.add('hidden');
        todoCreationForm.reset();
    });

    // Color Picker Functionality
    colorOptions.forEach(option => {
        option.addEventListener('click', () => {
            // Remove selected state from all options
            colorOptions.forEach(opt => opt.classList.remove('selected'));
            
            // Add selected state to clicked option
            option.classList.add('selected');
            
            // Set the selected color value
            selectedProjectColorInput.value = option.dataset.color;
        });
    });

    // Project Form Validation
    projectCreationForm.addEventListener('submit', (e) => {
        e.preventDefault();
        
        const projectName = document.getElementById('project-name').value.trim();
        const projectDescription = document.getElementById('project-description').value.trim();
        const selectedColor = selectedProjectColorInput.value;

        // Validation
        if (!projectName) {
            alert('Project name is required');
            return;
        }

        if (!selectedColor) {
            alert('Please select a project color');
            return;
        }

        // Simulate project creation
        console.log('Project Created:', {
            name: projectName,
            description: projectDescription,
            color: selectedColor
        });

        // Hide form
        projectFormContainer.classList.add('hidden');
        projectCreationForm.reset();
    });

    // Todo Form Validation
    todoCreationForm.addEventListener('submit', (e) => {
        e.preventDefault();
        
        const todoTitle = document.getElementById('todo-title').value.trim();
        const todoDescription = document.getElementById('todo-description').value.trim();
        const todoProject = document.getElementById('todo-project').value;
        const todoPriority = document.getElementById('todo-priority').value;
        const todoDueDate = document.getElementById('todo-due-date').value;

        // Validation
        const validationErrors = [];

        if (!todoTitle) validationErrors.push('Todo title is required');
        if (!todoProject) validationErrors.push('Please select a project');
        if (!todoPriority) validationErrors.push('Please select a priority');
        if (!todoDueDate) validationErrors.push('Due date is required');

        // Display or handle errors
        if (validationErrors.length > 0) {
            alert(validationErrors.join('\n'));
            return;
        }

        // Simulate todo creation
        console.log('Todo Created:', {
            title: todoTitle,
            description: todoDescription,
            project: todoProject,
            priority: todoPriority,
            dueDate: todoDueDate
        });

        // Hide form
        todoFormContainer.classList.add('hidden');
        todoCreationForm.reset();
    });

    // Optional: Close forms when clicking outside
    document.addEventListener('click', (e) => {
        // Project Form
        if (
            !projectFormContainer.contains(e.target) && 
            e.target !== addProjectBtn && 
            !projectFormContainer.classList.contains('hidden')
        ) {
            projectFormContainer.classList.add('hidden');
        }

        // Todo Form
        if (
            !todoFormContainer.contains(e.target) && 
            e.target !== addTodoBtn && 
            !todoFormContainer.classList.contains('hidden')
        ) {
            todoFormContainer.classList.add('hidden');
        }
    });
});

