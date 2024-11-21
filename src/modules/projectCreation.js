import createAppStateManager from "./stateManager";

export function initProjectCreation(){
    const stateManager=createAppStateManager();
    const projectForm=document.getElementById('project-creation-form');
    const projectList=document.getElementById('project-list');

    projectForm.addEventListener('submit',(event)=>{
        event.preventDefault();

        const projectNameInput=document.getElementById('project-name');
        const projectDescription=document.getElementById('project-description');

        try{
            const newProject=stateManager.createProject({
                name:projectNameInput.value,
                description:projectDescription.value || ''
            });
            projectForm.reset();

            renderProject(newProject,projectList);
        }catch(error){
            alert(error.message);
        }
    });
}
function renderProject(project,container){
    const projectCard=document.createElement('div');
    projectCard.classList.add('project-card');
    projectCard.innerHTML=`
        <h3>${project.getName()}</h3>
        <p>${project.getDescription()}</p>
        <span class='project-status'>${project.getStatus()}</span>    
    `;
    container.appendChild(projectCard);
}