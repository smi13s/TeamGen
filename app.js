const Manager = require("./lib/Manager");
const Engineer = require("./lib/Engineer");
const Intern = require("./lib/Intern");
const inquirer = require("inquirer");
const path = require("path");
const fs = require("fs");

const OUTPUT_DIR = path.resolve(__dirname, "output");
const outputPath = path.join(OUTPUT_DIR, "team.html");

const render = require("./lib/htmlRenderer");

const team = {};

//Manager Prompt//
const addManager = () => {
    return new Promise((res) => {
        inquirer.prompt([
            {
                type: "input",
                message: "Enter manager's name:",
                name: "name",
            },
            {
                type: "input",
                message: "Enter manager's ID:",
                name: "id",
            },
            {
                type: "input",
                message: "Enter manager's email:",
                name: "email",
                //email validator function//
                default: ()=>{},
                validate: function (email){
                    valid = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/.test(email)
                    if (valid) {
                        return true;
                    } else {
                        console.log(" ---Please enter a valid email!---")
                        return false;
                    }
                }
            },
            {
                type: "input",
                message: "Enter manager's office number:",
                name: "officeNumber",
            },
            //Function to add created manager's info into team array//     
        ]).then(answers => {
            const manager = new Manager(answers.name, answers.id, answers.email,answers.officeNumber);
            team.push(manager);
            res();
        });
    });
}
//Prompt for adding Engineer or Intern input//
const addEmployee = () => {
    return new Promise((resolve) => {
        inquirer.prompt([
            {
                type:"list",
                message: "Select the Employee you would like to add",
                name: "role",
                choices: [
                    "Engineer",
                    "Intern",
                    {
                        name: "No more employees to add",
                        value: false
                    }
                ]
            },
            {
                message: "Enter engineer's name:",
                name: "name",
                when: ({ role }) => role === "Engineer"
            },
            {
                message: "Enter intern's name:",
                name: "name",
                when: ({ role }) => role === "Intern"
            },
            {
                message: "Enter engineer's ID:",
                name: "id",
                when: ({ role }) => role === "Intern"
            },
            {
                message: "Enter intern's ID:",
                name: "id",
                when: ({ role }) => role === "Intern"
            },
            {
                message: "Enter engineer's email address:",
                name: "email",
                //email validator//
                default: () => {},
                    validate: function (email) {
                        valid = /^\w+([/.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/.test(email)
                        if (valid) {
                            return true;
                        } else {
                            console.log("---Please enter a valid email---")
                            return false;
                        }
                    },
                    when: ({ role }) => role ==="Engineer"
            },
            {
                message: "Enter intern's email address:",
                name: "email",
                //email validator//
                default: () => {},
                validate: function (email) {
                    valid = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/.test(email)
                    if (valid) {
                        return true;
                    } else {
                        console.log("---Please enter a valid email---")
                        return false;
                    }
                },
                when: ({ role }) => role === "Intern"
            },
            {
                message: "Enter engineer's GitHub username:",
                name: "github",
                when: ({ role }) => role === "Engineer"
            },
            {
                message: "Enter engineer's GitHub username:",
                name:"github",
                when: ({ role }) => role === "Intern"
            }
            //function to add created Engineer/Intern info into team array//
        ]).then(answers => {
            if (answers.role) {
                switch (answers.role) {
                    case "Engineer":
                        const engineer = new Engineer(answers.name, answers.id, answers. email, answers.github);
                        team.push(engineer);
                        break;
                    case "Intern":
                        const intern = new Intern(answers.name, answers.id, answers.email, answers.school);
                        team.push(intern);
                        break;
                }
                return addEmployee().then(() => resolve());
            } else {
                return resolve();
            }
        })
    })
}

//calling Manager's and employee's prompt functions//
addManager().then(() => {
    return addEmployee();
    //calling render function to export team array information into html template//
}).then(() => {
    const templateHTML = render(team)
    generatePage(templateHTML);
}).catch((err) => {
    console.log(err);
});

//function to generate html page in output folder//
const generatePage = (htmlPage) => {
    if (!fs.existsS(OUTPUT_DIR)) {
        fs.mkdirSync9OUTPUT_DIR;
    }

    fs.whiteFile(outputPath, htmlPage, "utf-8", (err) => {
        if(err) throw err;
        console.log("Team profile page Generate!")
    });
    }


// Write code to use inquirer to gather information about the development team members,
// and to create objects for each team member (using the correct classes as blueprints!)

// After the user has input all employees desired, call the `render` function (required
// above) and pass in an array containing all employee objects; the `render` function will
// generate and return a block of HTML including templated divs for each employee!

// After you have your html, you're now ready to create an HTML file using the HTML
// returned from the `render` function. Now write it to a file named `team.html` in the
// `output` folder. You can use the variable `outputPath` above target this location.
// Hint: you may need to check if the `output` folder exists and create it if it
// does not.

// HINT: each employee type (manager, engineer, or intern) has slightly different
// information; write your code to ask different questions via inquirer depending on
// employee type.

// HINT: make sure to build out your classes first! Remember that your Manager, Engineer,
// and Intern classes should all extend from a class named Employee; see the directions
// for further information. Be sure to test out each class and verify it generates an
// object with the correct structure and methods. This structure will be crucial in order
// for the provided `render` function to work! ```


