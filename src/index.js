import './styles/styles.css';
import { createUIManager } from './modules/uiManager';

document.addEventListener('DOMContentLoaded',()=>{
    const uiManager=createUIManager();

    uiManager.init();

    uiManager.renderProjects();

});