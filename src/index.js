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