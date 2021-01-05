const Manager = require("./lib/Manager");
const Engineer = require("./lib/Engineer");
const Intern = require("./lib/Intern");
const inquirer = require("inquirer");
const path = require("path");
const fs = require("fs");

const OUTPUT_DIR = path.resolve(__dirname, "output");
const outputPath = path.join(OUTPUT_DIR, "team.html");

const render = require("./lib/htmlRenderer");

const employeeCollection = [];

let employeeInformation = [];

// Write code to use inquirer to gather information about the development team members,
// and to create objects for each team member (using the correct classes as blueprints!)

// create questions to ask user
// implement some sort of loop later    
const generateEmployee = check => {
    if (check) {
        inquirer.prompt([{
            type: 'list',
            message: 'What is the role of this employee?',
            name: 'employeeRole',
            choices: ['Manager', 'Engineer', 'Intern'],
        },
        {
            type: 'input',
            message: 'What is the name of this employee?',
            name: 'employeeName',
        },
        {
            type: 'number',
            message: 'What is the ID number for this employee?',
            name: 'employeeID',
        },
        {
            type: 'input',
            message: 'What is the email address of this employee?',
            name:'employeeEmail'
        }]).then((data) => {
            employeeInformation = [];
            employeeInformation.push(data.employeeName, data.employeeID, data.employeeEmail);

    
            switch(data.employeeRole) {
                case 'Manager':
                    generateManager(employeeInformation);
                    break;
                case 'Engineer':
                    generateEngineer(employeeInformation);
                    break;
                case 'Intern':
                    generateIntern(employeeInformation);
                    break;
            }
        });
    }
}

const generateManager = values => {
    inquirer.prompt([{
        type: 'number',
        message: "What is this manager's office number?",
        name: 'officeNumber'
    },
    {
        type: 'confirm',
        message: 'Are there more employees to add?',
        name: 'continue',

    }]).then((data) => {
        const manager = new Manager(values[0], values[1], values[2], data.officeNumber);
        employeeCollection.push(manager);
        generateEmployee(data.continue);
        
        if (!data.continue) {
            createHTML(employeeCollection);
        }

    });
}

const generateEngineer = values => {
    inquirer.prompt([{
        type: 'input',
        message: "What is this engineer's GitHub?",
        name: 'github',
    },
    {
        type: 'confirm',
        message: 'Are there more employees to add?',
        name: 'continue',
    }]).then((data) => {
        const engineer = new Engineer(values[0], values[1], values[2], data.github);
        employeeCollection.push(engineer);
        generateEmployee(data.continue);
        
        if (!data.continue) {
            createHTML(employeeCollection);
        }

    });
}

const generateIntern = values => {
    inquirer.prompt([{
        type: 'input',
        message: "What school does this intern go to?",
        name: 'school',
    },
    {
        type: 'confirm',
        message: 'Are there more employees to add?',
        name: 'continue',
    }]).then((data) => {
        const intern = new Intern(values[0], values[1], values[2], data.school);
        employeeCollection.push(intern);
        generateEmployee(data.continue);

        if (!data.continue) {
            createHTML(employeeCollection);
        }

    });
}

generateEmployee(true);

// After the user has input all employees desired, call the `render` function (required
// above) and pass in an array containing all employee objects; the `render` function will
// generate and return a block of HTML including templated divs for each employee!

// After you have your html, you're now ready to create an HTML file using the HTML
// returned from the `render` function. Now write it to a file named `team.html` in the
// `output` folder. You can use the variable `outputPath` above target this location.
// Hint: you may need to check if the `output` folder exists and create it if it
// does not.

const createHTML = values => {

    const returnedHTML = render(values);

    try {
        if (!fs.existsSync(OUTPUT_DIR)) {
            fs.mkdirSync(OUTPUT_DIR);
            fs.writeFileSync(outputPath, returnedHTML);
        }
    } catch (err) {
        console.error(err);
    }

}

// HINT: each employee type (manager, engineer, or intern) has slightly different
// information; write your code to ask different questions via inquirer depending on
// employee type.

// HINT: make sure to build out your classes first! Remember that your Manager, Engineer,
// and Intern classes should all extend from a class named Employee; see the directions
// for further information. Be sure to test out each class and verify it generates an
// object with the correct structure and methods. This structure will be crucial in order
// for the provided `render` function to work! ```
