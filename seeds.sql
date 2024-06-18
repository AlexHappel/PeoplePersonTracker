-- seeds.sql

-- Insert departments first
INSERT INTO department (name) VALUES ('Sales');
INSERT INTO department (name) VALUES ('Engineering');
INSERT INTO department (name) VALUES ('Finance');

-- Insert roles after departments
INSERT INTO role (title, salary, department_id)
VALUES ('Salesperson', 50000, (SELECT id FROM department WHERE name = 'Sales'));
INSERT INTO role (title, salary, department_id)
VALUES ('Software Engineer', 80000, (SELECT id FROM department WHERE name = 'Engineering'));
INSERT INTO role (title, salary, department_id)
VALUES ('Accountant', 60000, (SELECT id FROM department WHERE name = 'Finance'));

-- Insert employees after roles
INSERT INTO employee (first_name, last_name, role_id, manager_id)
VALUES ('John', 'Doe', (SELECT id FROM role WHERE title = 'Salesperson'), NULL);
INSERT INTO employee (first_name, last_name, role_id, manager_id)
VALUES ('Jane', 'Smith', (SELECT id FROM role WHERE title = 'Software Engineer'), NULL);
INSERT INTO employee (first_name, last_name, role_id, manager_id)
VALUES ('Mike', 'Johnson', (SELECT id FROM role WHERE title = 'Accountant'), NULL);
