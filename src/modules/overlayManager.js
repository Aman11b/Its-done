// src/modules/overlayManager.js
export function overlayManager(stateManager) {
    const overlay = document.getElementById('creaion-overlay'); // Note the typo in 'creation'
    const addProjectBtn = document.getElementById('add-project-btn');

    function setupEventListeners() {
        if (!overlay || !addProjectBtn) {
            console.error('Overlay or Add Project Button not found');
            return;
        }

        addProjectBtn.addEventListener('click', showProjectCreationForm);
        
        // Close overlay when clicking outside
        overlay.addEventListener('click', (event) => {
            if (event.target === overlay) {
                hideOverlay();
            }
        });
    }

    function showProjectCreationForm() {
        if (!overlay) return;

        const overlayContent = overlay.querySelector('.overlay-content');
        if (!overlayContent) return;
        
        // Create project creation form
        overlayContent.innerHTML = `
            <form id="project-creation-form">
                <h2>Create New Project</h2>
                <div class="form-group">
                    <label for="project-name">Project Name</label>
                    <input 
                        type="text" 
                        id="project-name" 
                        name="project-name" 
                        required 
                        minlength="2" 
                        maxlength="50"
                    >
                </div>
                <div class="form-group">
                    <label for="project-description">Description</label>
                    <textarea 
                        id="project-description" 
                        name="project-description"
                        maxlength="200"
                    ></textarea>
                </div>
                <button type="submit" class="btn btn-primary">Create Project</button>
                <button type="button" class="btn btn-secondary" id="cancel-project-creation">Cancel</button>
            </form>
        `;

        // Add form submission handler
        const form = overlayContent.querySelector('#project-creation-form');
        form.addEventListener('submit', handleProjectCreation);

        // Add cancel button handler
        const cancelBtn = overlayContent.querySelector('#cancel-project-creation');
        cancelBtn.addEventListener('click', hideOverlay);

        // Show overlay
        overlay.style.display = 'flex';
    }

    function handleProjectCreation(event) {
        event.preventDefault();
        
        const nameInput = event.target.querySelector('#project-name');
        const descInput = event.target.querySelector('#project-description');

        try {
            // Create project using state manager
            stateManager.createProject({
                name: nameInput.value,
                description: descInput.value || ''
            });

            // Hide overlay
            hideOverlay();

            // Optionally, refresh project list
            // This would depend on how you've set up your content manager
        } catch (error) {
            // Handle validation errors
            alert(error.message);
        }
    }

    function hideOverlay() {
        if (overlay) {
            overlay.style.display = 'none';
        }
    }

    return {
        setupEventListeners,
        showProjectCreationForm,
        hideOverlay
    };
}