import createProject from "./modules/projectFactory";
import createTodo from "./modules/todoFactory";

function testProjectCreation(){
    console.log('---------project creation test--------');
    try{
        console.log('basic project creation->>');

        const project=createProject({
            name:'Web development',
            description:'learning is the key'
        });

        console.log(project.getId());
        console.log(project.getName());
        console.log(project.getDescription());
        console.log(project.getStatus());
        console.log(project.getCreatedAt());
        // passed

        const activeProject=createProject({
            name:'mobile app development',
            status:createProject.STATUS.ACTIVE
        });

        console.log(activeProject.getStatus());
        //passed

        try{
            createProject({name:''})
        }catch(error){
            console.log('invalid name');
        }//passed


    }catch(error){
        console.log('Project creation test failed:',error.message)
    }
}
// testProjectCreation();

function testTodoManagement(){
    console.log('-----todo management test------');
    try{
        const project=createProject({
            name:'Web development',
            description:'learning is the key'
        });

        console.log(project.getTotalTodos());
        // passed

        const todo1=createTodo({
            title:'Learn js',
            description:"master is",
            dueDate:new Date('2024-12-31'),
            priority:createTodo.PRIORITY.LOW
        });
        const todo2 = createTodo({
            title: 'Learn React',
            description: 'Build React applications',
            dueDate: new Date('2024-12-31'),
            priority: createTodo.PRIORITY.MEDIUM
        });

        project.addTodo(todo1);
        project.addTodo(todo2);

        console.log(project.getTotalTodos());

        const todos=project.getTodos();
        console.log(todos);

        todos.forEach((todo,index)=>{
            console.log(`${index+1}`,
                `${todo.getId()}`,
                `${todo.getTitle()}`,
                `${todo.getDescription()}`
            );
        });//passes

        project.removeTodo(todo2.getId());
        console.log(project.getTotalTodos());
        passed

        try {
            project.addTodo(todo1);
            console.log('Duplicate Todo Added (Check implementation)');
        } catch (error) {
            console.log('Duplicate Todo Error:', error.message);
        }//passes

        
        // Test 6: Invalid Todo Addition
        console.log('\n6. Invalid Todo Addition');
        try {
            project.addTodo(null);
        } catch (error) {
            console.log('Invalid Todo Error:', error.message);
        }//passed

    }catch(error){
        console.log(error.message);
    }

}
testTodoManagement();
//passes


function testProjectLifeCycle(){
    console.log('===== Project Lifecycle Test =====');

    try{
        const project = createProject({
            name: 'Web Development Journey',
            description: 'Comprehensive web dev learning path'
        });

        //  // Verify Project Details
         console.log('Project ID:', project.getId());
         console.log('Project Name:', project.getName());
         console.log('Project Description:', project.getDescription());
         console.log('Project Initial Status:', project.getStatus());
         console.log('Project Created At:', project.getCreatedAt());//passed

        console.log('Current Status:', project.getStatus());

        project.changeStatus(createProject.STATUS.ARCHIVED);
        console.log('Updated Status:', project.getStatus()); //passed

        
        // Test 3: JSON Serialization
        console.log('\n3. Project Serialization');
        const projectJSON = project.toJSON();
        console.log('Project JSON:', JSON.stringify(projectJSON, null, 2)); //passed

                // Test 4: Error Handling
        console.log('\n4. Error Handling');
        try {
            // Attempt to create project with invalid name
            createProject({ name: '' });
        } catch (error) {
            console.log('Invalid Name Error (Expected):', error.message);
        }//passed


    }catch(error){
        console.log(error.message);
    }
}
// testProjectLifeCycle();


function testProjectErrorHandling() {
    console.log('===== Project Error Handling Test =====');

    // Test 1: Invalid Project Name
    console.log('\n1. Invalid Project Name Tests');
    
    try {
        // Test empty name
        console.log('Attempting to create project with empty name:');
        createProject({ name: '' });
    } catch (error) {
        console.log('Empty Name Error (Expected):', error.message);
    }

    try {
        // Test very short name
        console.log('Attempting to create project with short name:');
        createProject({ name: 'a' });
    } catch (error) {
        console.log('Short Name Error (Expected):', error.message);
    }

    try {
        // Test extremely long name
        console.log('Attempting to create project with very long name:');
        createProject({ name: 'A'.repeat(51) }); // 51 characters
    } catch (error) {
        console.log('Long Name Error (Expected):', error.message);
    }

    // Test 2: Invalid Status
    console.log('\n2. Invalid Status Tests');
    
    try {
        console.log('Attempting to create project with invalid status:');
        createProject({
            name: 'Test Project',
            status: 'invalid-status'
        });
    } catch (error) {
        console.log('Invalid Status Error (Expected):', error.message);
    }

    // Test 3: Edge Case Inputs
    console.log('\n3. Edge Case Input Tests');
    
    try {
        console.log('Creating project with special characters in name:');
        const specialNameProject = createProject({
            name: 'Project @#$%^&*',
            description: 'Testing special character handling'
        });
        console.log('Special Name Project Created:', specialNameProject.getName());
    } catch (error) {
        console.log('Special Name Error:', error.message);
    }

    try {
        console.log('Creating project with very long description:');
        const longDescProject = createProject({
            name: 'Long Description Project',
            description: 'A'.repeat(1000) // Very long description
        });
        console.log('Long Description Project Created');
    } catch (error) {
        console.log('Long Description Error:', error.message);
    }
}

// Run the test
testProjectErrorHandling();//passed

function testProjectTodoInteraction() {
    console.log('===== Project Todo Interaction Test =====');

    try {
        // Create a project
        const project = createProject({
            name: 'Software Development Learning',
            description: 'Comprehensive software development journey'
        });

        console.log('\n1. Initial Project State');
        console.log('Initial Total Todos:', project.getTotalTodos());

        // Create multiple todos
        const frontendTodo = createTodo({
            title: 'Learn Frontend Frameworks',
            description: 'Master React and Vue.js',
            dueDate: new Date('2024-12-30'),
            priority: createTodo.PRIORITY.HIGH
        });

        const backendTodo = createTodo({
            title: 'Learn Backend Development',
            description: 'Node.js and Express fundamentals',
            dueDate: new Date('2024-12-31'),
            priority: createTodo.PRIORITY.MEDIUM
        });

        console.log('\n2. Adding Todos to Project');
        // Add todos to project
        project.addTodo(frontendTodo);
        project.addTodo(backendTodo);

        // Verify todo addition
        console.log('Total Todos after addition:', project.getTotalTodos());

        console.log('\n3. Retrieving Todos');
        const projectTodos = project.getTodos();
        projectTodos.forEach((todo, index) => {
            console.log(`Todo ${index + 1}:`, 
                `Title: ${todo.getTitle()}, ` +
                `Priority: ${todo.getPriority()}`
            );
        });

        console.log('\n4. Removing a Todo');
        // Remove a specific todo
        project.removeTodo(backendTodo.getId());
        console.log('Total Todos after removal:', project.getTotalTodos());

        console.log('\n5. Project Status and Todo Interaction');
        // Change project status
        const initialStatus = project.getStatus();
        console.log('Initial Project Status:', initialStatus);
        
        project.changeStatus(createProject.STATUS.ARCHIVED);
        console.log('Updated Project Status:', project.getStatus());

    } catch (error) {
        console.error('Project Todo Interaction Test Failed:', error.message);
        console.error('Error Details:', error.stack);
    }
}

// Run the test
testProjectTodoInteraction();//passed