// src/index.js
import { createUIManager } from './modules/uiManager.js';
import './styles/styles.css';

document.addEventListener('DOMContentLoaded', () => {
    const uiManager = createUIManager();
    uiManager.init();

    // Optional: Save state before page unload
    window.addEventListener('beforeunload', () => {
        uiManager.saveAppState();
    });
});