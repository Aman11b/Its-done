import createAppStateManager from "./stateManager";
import createStorageManager from "./storageManager";
import createSidebarManager from "./sidebarManager";
import createContentManager from "./contentManager";
import { overlayManager } from "./overlayManager";

function createUIManager() {
    const stateManager = createAppStateManager();
    const storageManager = createStorageManager();
    
    const contentManager = createContentManager(stateManager);
    const sidebarManager = createSidebarManager(stateManager, contentManager);
    const overlay = overlayManager(stateManager, contentManager);

    function init() {
        storageManager.initializeDefaultData(stateManager);
        storageManager.restoreAppState(stateManager);

        sidebarManager.initialize();
        contentManager.renderProjects();
        overlay.setupEventListeners();
    }

    function saveAppState() {
        storageManager.saveAppState(stateManager);
    }

    return {
        init,
        saveAppState,
        stateManager,
        storageManager,
        sidebarManager,
        contentManager,
        overlay
    };
}

export default createUIManager;