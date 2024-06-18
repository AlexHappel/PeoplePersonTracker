(async () => {
    const inquirer = await import('inquirer');
    const db = await import('./db.js');

    async function mainMenu() {
        const { choice } = await inquirer.default.prompt({
            name: 'choice',
            type: 'list',
            message: 'What would you like to do?',
            choices: [
                'View all departments',
                'View all roles',
                'View all employees',
                'Add a department',
                'Add a role',
                'Add an employee',
                'Update an employee role',
                'Update employee manager',
                'View employees by manager',
                'View employees by department',
                'Delete department',
                'Delete role',
                'Delete employee',
                'View total utilized budget of a department',
                'Exit'
            ]
        });

        switch (choice) {
            case 'View all departments':
                return viewAllDepartments();
            case 'View all roles':
                return viewAllRoles();
            case 'View all employees':
                return viewAllEmployees();
            case 'Add a department':
                return addDepartment();
            case 'Add a role':
                return addRole();
            case 'Add an employee':
                return addEmployee();
            case 'Update an employee role':
                return updateEmployeeRole();
            case 'Update employee manager':
                return updateEmployeeManager();
            case 'View employees by manager':
                return viewEmployeesByManager();
            case 'View employees by department':
                return viewEmployeesByDepartment();
            case 'Delete department':
                return deleteDepartment();
            case 'Delete role':
                return deleteRole();
            case 'Delete employee':
                return deleteEmployee();
            case 'View total utilized budget of a department':
                return viewDepartmentBudget();
            case 'Exit':
                db.default.end();
                process.exit();
        }
    }

    async function viewAllDepartments() {
        const res = await db.default.query('SELECT * FROM department');
        console.table(res.rows);
        mainMenu();
    }

    async function viewAllRoles() {
        const res = await db.default.query('SELECT role.id, role.title, role.salary, department.name AS department FROM role JOIN department ON role.department_id = department.id');
        console.table(res.rows);
        mainMenu();
    }

    async function viewAllEmployees() {
        const res = await db.default.query('SELECT employee.id, employee.first_name, employee.last_name, role.title, department.name AS department, role.salary, manager.first_name AS manager_first_name, manager.last_name AS manager_last_name FROM employee JOIN role ON employee.role_id = role.id JOIN department ON role.department_id = department.id LEFT JOIN employee manager ON employee.manager_id = manager.id');
        console.table(res.rows);
        mainMenu();
    }

    async function addDepartment() {
        const { name } = await inquirer.default.prompt({
            name: 'name',
            type: 'input',
            message: 'Enter the name of the department:'
        });

        await db.default.query('INSERT INTO department (name) VALUES ($1)', [name]);
        console.log(`Added ${name} to the database`);
        mainMenu();
    }

    async function addRole() {
        const departments = await db.default.query('SELECT * FROM department');
        const departmentChoices = departments.rows.map(dept => ({
            name: dept.name,
            value: dept.id
        }));

        const { title, salary, department_id } = await inquirer.default.prompt([
            {
                name: 'title',
                type: 'input',
                message: 'Enter the title of the role:'
            },
            {
                name: 'salary',
                type: 'input',
                message: 'Enter the salary of the role:'
            },
            {
                name: 'department_id',
                type: 'list',
                message: 'Select the department for the role:',
                choices: departmentChoices
            }
        ]);

        await db.default.query('INSERT INTO role (title, salary, department_id) VALUES ($1, $2, $3)', [title, salary, department_id]);
        console.log(`Added ${title} to the database`);
        mainMenu();
    }

    async function addEmployee() {
        const roles = await db.default.query('SELECT * FROM role');
        const roleChoices = roles.rows.map(role => ({
            name: role.title,
            value: role.id
        }));

        const employees = await db.default.query('SELECT * FROM employee');
        const managerChoices = employees.rows.map(emp => ({
            name: `${emp.first_name} ${emp.last_name}`,
            value: emp.id
        }));
        managerChoices.unshift({ name: 'None', value: null });

        const { first_name, last_name, role_id, manager_id } = await inquirer.default.prompt([
            {
                name: 'first_name',
                type: 'input',
                message: 'Enter the first name of the employee:'
            },
            {
                name: 'last_name',
                type: 'input',
                message: 'Enter the last name of the employee:'
            },
            {
                name: 'role_id',
                type: 'list',
                message: 'Select the role for the employee:',
                choices: roleChoices
            },
            {
                name: 'manager_id',
                type: 'list',
                message: 'Select the manager for the employee:',
                choices: managerChoices
            }
        ]);

        await db.default.query('INSERT INTO employee (first_name, last_name, role_id, manager_id) VALUES ($1, $2, $3, $4)', [first_name, last_name, role_id, manager_id]);
        console.log(`Added ${first_name} ${last_name} to the database`);
        mainMenu();
    }

    async function updateEmployeeRole() {
        const employees = await db.default.query('SELECT * FROM employee');
        const employeeChoices = employees.rows.map(emp => ({
            name: `${emp.first_name} ${emp.last_name}`,
            value: emp.id
        }));

        const roles = await db.default.query('SELECT * FROM role');
        const roleChoices = roles.rows.map(role => ({
            name: role.title,
            value: role.id
        }));

        const { employee_id, role_id } = await inquirer.default.prompt([
            {
                name: 'employee_id',
                type: 'list',
                message: 'Select the employee to update:',
                choices: employeeChoices
            },
            {
                name: 'role_id',
                type: 'list',
                message: 'Select the new role for the employee:',
                choices: roleChoices
            }
        ]);

        await db.default.query('UPDATE employee SET role_id = $1 WHERE id = $2', [role_id, employee_id]);
        console.log(`Updated employee's role`);
        mainMenu();
    }

    async function updateEmployeeManager() {
        const employees = await db.default.query('SELECT * FROM employee');
        const employeeChoices = employees.rows.map(emp => ({
            name: `${emp.first_name} ${emp.last_name}`,
            value: emp.id
        }));

        const { employee_id, manager_id } = await inquirer.default.prompt([
            {
                name: 'employee_id',
                type: 'list',
                message: 'Select the employee to update:',
                choices: employeeChoices
            },
            {
                name: 'manager_id',
                type: 'list',
                message: 'Select the new manager for the employee:',
                choices: employeeChoices
            }
        ]);

        await db.default.query('UPDATE employee SET manager_id = $1 WHERE id = $2', [manager_id, employee_id]);
        console.log(`Updated employee's manager`);
        mainMenu();
    }

    async function viewEmployeesByManager() {
        const employees = await db.default.query('SELECT * FROM employee');
        const managerChoices = employees.rows.map(emp => ({
            name: `${emp.first_name} ${emp.last_name}`,
            value: emp.id
        }));

        const { manager_id } = await inquirer.default.prompt({
            name: 'manager_id',
            type: 'list',
            message: 'Select the manager to view employees:',
            choices: managerChoices
        });

        const res = await db.default.query('SELECT * FROM employee WHERE manager_id = $1', [manager_id]);
        console.table(res.rows);
        mainMenu();
    }

    async function viewEmployeesByDepartment() {
        const departments = await db.default.query('SELECT * FROM department');
        const departmentChoices = departments.rows.map(dept => ({
            name: dept.name,
            value: dept.id
        }));

        const { department_id } = await inquirer.default.prompt({
            name: 'department_id',
            type: 'list',
            message: 'Select the department to view employees:',
            choices: departmentChoices
        });

        const res = await db.default.query('SELECT employee.id, employee.first_name, employee.last_name, role.title FROM employee JOIN role ON employee.role_id = role.id WHERE role.department_id = $1', [department_id]);
        console.table(res.rows);
        mainMenu();
    }

    async function deleteDepartment() {
        const departments = await db.default.query('SELECT * FROM department');
        const departmentChoices = departments.rows.map(dept => ({
            name: dept.name,
            value: dept.id
        }));

        const { department_id } = await inquirer.default.prompt({
            name: 'department_id',
            type: 'list',
            message: 'Select the department to delete:',
            choices: departmentChoices
        });

        await db.default.query('DELETE FROM department WHERE id = $1', [department_id]);
        console.log(`Deleted department`);
        mainMenu();
    }

    async function deleteRole() {
        const roles = await db.default.query('SELECT * FROM role');
        const roleChoices = roles.rows.map(role => ({
            name: role.title,
            value: role.id
        }));

        const { role_id } = await inquirer.default.prompt({
            name: 'role_id',
            type: 'list',
            message: 'Select the role to delete:',
            choices: roleChoices
        });

        await db.default.query('DELETE FROM role WHERE id = $1', [role_id]);
        console.log(`Deleted role`);
        mainMenu();
    }

    async function deleteEmployee() {
        const employees = await db.default.query('SELECT * FROM employee');
        const employeeChoices = employees.rows.map(emp => ({
            name: `${emp.first_name} ${emp.last_name}`,
            value: emp.id
        }));

        const { employee_id } = await inquirer.default.prompt({
            name: 'employee_id',
            type: 'list',
            message: 'Select the employee to delete:',
            choices: employeeChoices
        });

        await db.default.query('DELETE FROM employee WHERE id = $1', [employee_id]);
        console.log(`Deleted employee`);
        mainMenu();
    }

    async function viewDepartmentBudget() {
        const departments = await db.default.query('SELECT * FROM department');
        const departmentChoices = departments.rows.map(dept => ({
            name: dept.name,
            value: dept.id
        }));

        const { department_id } = await inquirer.default.prompt({
            name: 'department_id',
            type: 'list',
            message: 'Select the department to view budget:',
            choices: departmentChoices
        });

        const res = await db.default.query('SELECT SUM(role.salary) AS total_budget FROM employee JOIN role ON employee.role_id = role.id WHERE role.department_id = $1', [department_id]);
        console.table(res.rows);
        mainMenu();
    }

    mainMenu();
})();