import createUIManager from './modules/uiManager.js';
import './styles/styles.css';

document.addEventListener('DOMContentLoaded', () => {
    const uiManager = createUIManager();
    uiManager.init();

    window.addEventListener('beforeunload', () => {
        uiManager.saveAppState();
    });
});