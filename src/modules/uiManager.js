// src/modules/uiManager.js
import createAppStateManager from './stateManager.js';
import createStorageManager from './storageManager.js';
import { sidebarManager } from './sidebarManager.js';
import { contentManager } from './contentManager.js';
import { overlayManager } from './overlayManager.js';

export function createUIManager() {
    // Core dependencies
    const stateManager = createAppStateManager();
    const storageManager = createStorageManager();
    
    // UI Sub-managers
    const sidebar = sidebarManager(stateManager);
    const content = contentManager(stateManager);
    const overlay = overlayManager(stateManager);

    function init() {
        // Initial setup
        sidebar.initialize();
        content.renderProjects();
        overlay.setupEventListeners();
        
        // Restore previous state if exists
        storageManager.restoreAppState(stateManager);
    }

    function saveAppState() {
        storageManager.saveAppState(stateManager);
    }

    return {
        init,
        saveAppState,
        stateManager,
        sidebar,
        content,
        overlay
    };
}