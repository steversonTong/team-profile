const inquirer = require("inquirer");
const path = require("path");
const fs = require("fs");
const Manager = require("./lib/Manager");
const Engineer = require("./lib/Engineer");
const Intern = require("./lib/Intern");


const OUTPUT_DIR = path.resolve(__dirname, "output");
const outputPath = path.join(OUTPUT_DIR, "team.html");

const render = require("./lib/htmlRenderer");

const employeeArr = [];

function addUser() {
    if (employeeArr === 0) {
        getInfo();
    }

    else {
        const question = {
            type: "confirm",
            message: "Would you like to add another employee?",
            name: "addUser"
        }

        inquirer.prompt(question).then(function(data) {
            if(data.addAUser) {
                getInfo();
            }

            else {
                try {
                    if(!fs.existsSync(OUTPUT_DIR)) {
                        fs.mkdirSync(OUTPUT_DIR);
                    } 

                    const returnedHTML = render(employees);
                    fs.writeFileSync(outputPath, returnedHTML);
                } 
                catch (err) {
                    console.log(err);
                }
            }
        });
    }
}

function getInfo() {
    const question = {
        type: "list",
        message: "What type of employee do you want to add?",
        name: "type",
        choices: [
            "Manager",
            "Engineer",
            "Intern"
        ]
    };

    inquirer.prompt(question).then(function(employeeType)
    {
        const questions = 
        [
            {
                type: "input",
                message: `What is the name of the ${employeeType.employeeChoice}?`,
                name: "name"
            },
            {
                type: "number",
                message: `What is the id of the ${employeeType.employeeChoice}?`,
                name: "id"
            },
            {
                type: "input",
                message: `What is the email of the ${employeeType.employeeChoice}?`,
                name: "email",
            }
        ];

        inquirer.prompt(questions).then(function(employeeInformation)
        {
            switch (employeeType.employeeChoice)
            {
                case "Manager" :
                    const managerQuestion = [
                        {
                            type: "input", 
                            message: "What is the office number of this manager?",
                            name: "officeNumber" 
                        }];

                    inquirer.prompt(managerQuestion).then(function(managerInformation) {
                        const addManager = new Manager(employeeInformation.name, employeeInformation.id, employeeInformation.email, managerInformation.officeNumber);
                        
                        employees.push(addManager);

                        addUser();
                    });
                    break;
                    
                case "Engineer" :
                    const engineerQuestion = [
                        {
                            type: "input", 
                            message: "What is their GitHub username?",
                            name: "github" 
                        }];

                    inquirer.prompt(engineerQuestion).then(function(engineerInformation) {
                        const addEngineer = new Engineer(employeeInformation.name, employeeInformation.id, employeeInformation.email, engineerInformation.github);
                        
                        employees.push(addEngineer);

                        addUser();
                    });
                    break;

                case "Intern" :
                    const internQuestion = [
                        {
                            type: "input", 
                            message: "What school are they attending?",
                            name: "school"
                        }];

                    inquirer.prompt(internQuestion).then(function(internInformation) {
                        const addIntern = new Intern(employeeInformation.name, employeeInformation.id, employeeInformation.email, internInformation.school);
                        
                        employees.push(addIntern);

                        addUser();
                    });
                    break;
                default:
                    break;
                    
            }
        });
    });
}

