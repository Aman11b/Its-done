
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
            return JSON.stringify(data);
        }catch (error) {
            console.error('JSON Stringify Error:', error.message);
            return null;
        }
    };

    //public methods returned
    return{
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