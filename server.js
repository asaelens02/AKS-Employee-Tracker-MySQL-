//require mySQL, inquirer
const mysql =require ('mysql2');
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

//employees function joins tables to retrieve all employee data and displays the table, some is written in sql syntax

function viewAllEmployees () {
    let query =
    `SELECT
        employee.id,
        employee.first_name,
        employee.last_name,
        role.title,
        department.name AS department,
        role.salary,
        CONCAT(manager.first_name, '' , manager.last_name) AS manager
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

    //add function to view department table
    //add function to view roles table

    //Employees by department
    function viewEmployeesByDepartment(){
        let query =
        `SELECT
            department.id, 
            department.name,
            role.salary
        FROM employee
        LEFT JOIN role
            ON employee.role_id = role.id
        LEFT JOIN department
            ON department.id = role.department_id
        GROUP BY department.id, department.name, role.salary`; //semi-colon ends sql function 

    connection.query (query, (err, res)=> {
        if (err) throw err;
        const deptChoices = res.map((choices)=> ({
            value: choices.id, name: choices.name
        }));
        console.table(res);
        getDept(deptChoices);
    });
    }
    //Select department (inquirer prompt)
    function getDept (deptChoices){
        inquirer
            .prompt ([
                {
                    type: 'list',
                    name:'department', 
                    message:'Department List:',
                    choices: deptChoices
                }
            ])
            .then ((res)=> {
            let query =
                `SELECT 
                    employee.id,
                    employee.first_name,
                    employee.last_name,
                    role.title,
                    department.name
                FROM employee
                JOIN role
                    ON employee.role_id = role.id
                JOIN department
                    ON department.id = role.department_id
                WHERE department.id =?` //question mark lets id be variable

            connection.query(query, res.department, (err,res)=> {
                if (err)throw err;
                questionPrompt();//re-asks beginning question
                console.table (res);
            });
        })
    }
    //function to add employee to employee table
    function addEmployee () {
        let query = 
        `SELECT
            role.id,
            role.title,
            role.salary
        FROM role` 

    connection.query(query, (err,res)=> {
        //creates 'mapping' to table to enter the id, title, and salary.
        if (err) throw err;
        const role = res.map (({id, title,salary}) => ({
            value: id,
            title: `${title}`,
            salary: `${salary}`
        }));
        console.table (res);//this shows the table in Node
        employeeRole(role);//calls next function to enter employee information
    });
    }

    function employeeRole(role){ //inquirer prompts to enter employee name and role
        inquirer
            .prompt ([{
                type:'input',
                name: 'firstName',
                message:"Please enter employee's first name:"
            },
            {
                type: 'input',
                name: 'lastName',
                message: "Please enter employee's last name:"
            },
            {
                type: 'list',
                name: 'roleId',
                message: "Please select employee role",
                choices: role
            }

            ])
            .then ((res) => {
                let query = `INSERT INTO employee SET ?`
                connection.query (query, {
                    first_name: res.firstName,
                    last_name: res.lastName,
                    role_id: res.roleId
                }, (err, res) =>{
                    if (err) throw err;
                    questionPrompt();//back to first question
                });
            });
    }
}




