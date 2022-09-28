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
    //First question for user to select what they would like to do...list
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
    //once user chooses from list above the corresponding function below will execute. 
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
    .catch ((err)=> {
        if(err) throw err;
    });
}
//end inquirer function  list

//employees function

function viewAllEmployees () {
    let query =
    `SELECT
        employee.id,
        employee.first_name,
        employee.last_name,
        role.title,
        department.name AS department,
        role.salary,
        CONCAT(manager.first_name '' , manager.last_name) AS manager
    FROM employee
    LEFT JOIN role
        ON employee.role_id = role_id
    LEFT JOIN department
        ON department.id = role.department_id
    LEFT JOIN employee.manager
        ON manager.id = employeer.manager.id`
    
    connection.query (query, (err, res)=> {
        if (err) throw err;
        console.table(res);
        questionPrompt();
    });


}

