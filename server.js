//require mySQL, inquirer
const mysql =require ('mysql');
const inquirer = require ('inquirer');
require ('console.table');

//create connection with mysql
const connection =mysql.createConnection({

    host: "localhost",
    port:"3001",
    user: "root",
    password: "@BamBam2020",
    database:"employees"
})

//err if connection fails
connection.connect(function (err){
    if (err) throw err;

    //begin inquiries function 
    firstPrompt();
});

function firstPrompt() {

    inquirer.prompt ([
        {
            type:'list', 
            name:'userChoice',
            message:'What would you like to do?',
            choices: [
                'View All Employees',
                'View All Departments',
                'View All Roles',
                'View Employees by Department',
                'Add Employee',
                'Remove Employee',
                'Update Employee Role',
                'Add Role', 
                'Add Department',
                'Exit'
            
        


        }
        
    ])
}