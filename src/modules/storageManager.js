
// factory function for storage management
const createStorageManager=()=>{
    const store=window.localStorage;
    // private cant be directly accessed

    const safeJsonParse=(jsonString)=>{
        try{
            return JSON.parse(jsonString);
        }catch(error){
            console.error('JSON Parsing Error:', error.message);
            return null;
        }
    };

    const safeJsonStringify=(data)=>{
        try{
            return JSON.stringify(data,(key,value)=>{
                if(value instanceof Date){
                    return value.toISOString();
                }
                return value;
            });
        }catch (error) {
            console.error('JSON Stringify Error:', error.message);
            return null;
        }
    };

    //public methods returned
    return{
        saveAppState(stateManager){
            try{

                const appState={
                    projects:Object.values(stateManager.getAllProjects()).map(project=>project.toJSON()),
                    todos:Object.values(stateManager.getAllTodos()).map(todo=>todo.toJSON())
                };

                const jsonString=safeJsonStringify(appState);

                if(jsonString){
                    store.setItem('itsDoneAppState', jsonString);
                    console.log('App state saved successfully');
                    return true;
                }
                return false;
            }catch(error){
                console.error('App State Save Error:', error);
                return false;
            }
        },

        restoreAppState(stateManager){
            try{
                const storeState=store.getItem('itsDoneAppState');

                if(!storeState){
                    console.log('no saved state found');
                    return false;
                }

                const parsedState=safeJsonParse(storeState);

                if(!parsedState){
                    console.log('failed to parse stored state');
                    return false;
                }

                if(parsedState.projects){
                    parsedState.projects.forEach(projectData=>{
                        const project=stateManager.createProject({
                            name:projectData.name,
                            description:projectData.description,
                            status:projectData.status
                        });
                        if(projectData.todos){
                            projectData.todos.forEach(todoData=>{
                                stateManager.createTodoForProject(project.getId(),{
                                    title:todoData.title,
                                    description:todoData.description,
                                    dueDate:new Date(todoData.dueDate),
                                    priority:todoData.priority
                                });
                            });
                        }
                    });

                }

                console.log('App state restored successfully');
                return true;
            }catch(error){
                console.error('App State Restore Error:', error);
                return false;                
            }
        },

        // save data to local storage
        save(key,data){
            if(!key){
                console.error('invalid key for storage');
                return false;
            }
            try{
                const jsonString=safeJsonStringify(data);
                if(jsonString){
                    store.setItem(key,jsonString);
                    return true;
                }
                return false;
            }catch(error){
                console.error('Storage Save Error:', error);
                return false;
            }
        },
        //retrieve data from local storage
        get(key){
            // VALIDATE KEY
            if(!key){
                console.error('Invalid key for retrieval');
                return null;                
            }
            try{
                const jsonString=store.getItem(key);

                return jsonString?safeJsonParse(jsonString):null;
            }catch (error) {
                console.error('Storage Retrieval Error:', error);
                return null;
            }
        },
        has(key){
            if(!key){
                console.error('Invalid key for checking existence');
                return false;
            }

            const item=store.getItem(key);
            // Log existence for debugging
            console.log(`Key '${key}' ${item ? 'exists' : 'does not exist'}`);

            return item !== null;
        },
        remove(key){
            // Validate key
            if (!key) {
                console.error('Invalid key for removal');
                return false;
            }
            try{
                if(this.has(key)){
                    store.removeItem(key);
                    console.log(`Successfully removed key: ${key}`);
                    return true;
                }else{
                    console.warn(`Key not found: ${key}`);
                    return false;
                }
            }catch(error){
                console.error('Storage Removal Error:', error);
                return false;
            }
        },
        getAllKeys(){
            try{
                const keys=Object.keys(store);
                console.log('All Stored Keys:', keys);
                return keys;
            }catch(error){
                console.error('Error retrieving keys:', error);
                return [];
            }
        },
        clear(){
            try{
                store.clear();
                console.log('All storage cleared successfully');
                return true;
            }catch (error) {
                console.error('Storage Clear Error:', error);
                return false;
            }
        }
    };
};

// Export factory function
export default createStorageManager;