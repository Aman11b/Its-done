import createAppStateManager from "./stateManager";
import createStorageManager from "./storageManager";

export function createUIManager(){

    const stateManager=createAppStateManager();
    const storageManager=createStorageManager();

    function init(){
        setupProjectButton();
        setupTodoButton();
    }

    function setupProjectButton(){
        const addProjectBtn=document.getElementById('add-project-btn');
        addProjectBtn.addEventListener('click',()=>{
            console.log('project button clicked');
        });
    }

    function setupTodoButton(){
        const addTodoBtn=document.getElementById('add-todo-btn');
        addTodoBtn.addEventListener('click',()=>{
            console.log('Todo button clicked');
        });
    }

    function renderProjects(){
        const contentArea=document.getElementById('content-area');
        const projects=stateManager.getAllProjects();


        contentArea.innerHTML='';

        Object.values(projects).forEach(project=>{
            const projectElement=document.createElement('div');
            projectElement.classList.add('project-item');
            projectElement.textContent=project.getName();
            contentArea.appendChild(projectElement);
        });
    }

    return{
        init,
        renderProjects,
        stateManager,
        stateManager
    };
}