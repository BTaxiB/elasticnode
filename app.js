//server initialisation 
const initServer = require('./server');
const serve = new initServer();

//database connection & methods for data manipulation 
const dbPort = '9200'; //default port
const elasticDB = require('./client');
const dbClient = new elasticDB(dbPort);

//filesystem controller, basic methods like read, write and append file for testing purposes
const Includes = require('./includes');
const include = new Includes();

//TODO fake API model/controller with crud operations
const todo_url = "https://jsonplaceholder.typicode.com/todos"; 
const Todos = require('./todos');
const todos = new Todos(dbClient, todo_url, include);

//server starting on port:8081
serve.start();

// todos.load() //indexing data 


let task_id_test = '779';
//create task
todos.create(task_id_test, {id: task_id_test, title: "test", completed: "false"})

//update task
todos.update(task_id_test, {id: task_id_test, title: "testUpdated", completed: "true"} )

//get/find task BY ID
todos.get(task_id_test) 
todos.search(task_id_test)

//delete task
todos.delete(task_id_test)
