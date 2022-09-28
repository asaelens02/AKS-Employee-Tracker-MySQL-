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
    questionPrompt();
});

function questionPrompt() {

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
            ]
        


        }
        
    ])

    .then((res)=> {
        console.log(res.userChoice);
        switch(res.userChoice){
            case 'View All Employees':
                viewAllEmployees();
                break;
            case 'View All Departments':
                viewAllDepartments();
                break;
            case 'View All Roles':
                viewAllRoles();
                break;
            case 'View Employees by Department':
                viewEmployeesByDepartment();
                break;
            case 'Add Employee':
                addEmployee();
                break;
            case 'Remove Employee':
                removeEmployee();
                break;
            case 'Update Employee Role':
                updateRole();
                break;
            case 'Add Role':
                addRole();
                break;
            case 'Add Department':
                addDepartment();
                break;
            case 'Exit':
                connection.end();
                break;
        }
    })
}

