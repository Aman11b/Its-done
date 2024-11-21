// src/modules/contentManager.js
export function contentManager(stateManager) {
    const contentArea = document.getElementById('content-area');

    function renderProjects() {
        // Clear previous content
        contentArea.innerHTML = '';

        // Get all projects from state manager
        const projects = stateManager.getAllProjects();

        // Render each project
        Object.values(projects).forEach(project => {
            const projectCard = createProjectCard(project);
            contentArea.appendChild(projectCard);
        });
    }

    function createProjectCard(project) {
        const card = document.createElement('div');
        card.classList.add('project-card');
        card.innerHTML = `
            <h3>${project.getName()}</h3>
            <p>${project.getDescription()}</p>
            <div class="project-card-footer">
                <span>Status: ${project.getStatus()}</span>
                <button class="view-project" data-id="${project.getId()}">
                    View Project
                </button>
            </div>
        `;

        card.querySelector('.view-project').addEventListener('click', () => {
            // Implement project detail view
            console.log(`Viewing project: ${project.getName()}`);
        });

        return card;
    }

    function renderTodos() {
        // Similar to renderProjects, but for todos
    }

    return {
        renderProjects,
        renderTodos,
        createProjectCard
    };
}