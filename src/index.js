import createTodo from "./modules/todoFactory";

try{
    const myTodo=createTodo({
        title:'learn factory pattern',
        description:"deep dive into java",
        dueDate:new Date('2024-12-31'),
        priority:createTodo.PRIORITY.HIGH
    });

    console.log(myTodo.getId());
    console.log(myTodo.getTitle());
    console.log(myTodo.getDueDate());
}catch(error){
    console.error('todo creation failed: ',error.message);
}