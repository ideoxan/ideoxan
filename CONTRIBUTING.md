# Contributing to Ideoxan
## Introduction
First of all, the Ideoxan Developer Team would like to personally thank you for taking the time to contribute to our project and the community! 

This document contains all the necessary information to contribute to the Ideoxan project. If you have any questions, contact us at [hello.skyclo@gmail.com](mailto:hello.skyclo@gmail.com).

### Code of Conduct and Licensing
This project is maintained and governed in accordance with the project's official [Code of Conduct](CODE_OF_CONDUCT.md). Agreement to its terms and conditions, along with [Ideoxan's Official Terms of Service](about:blank) and the included [license (MIT)](LICENSE.md) is *required* to contribute to this organization's project.

### Table of Contents
- [Contributing to Ideoxan](#contributing-to-ideoxan)
  - [Introduction](#introduction)
    - [Code of Conduct and Licensing](#code-of-conduct-and-licensing)
    - [Table of Contents](#table-of-contents)
  - [Setup for Contributing](#setup-for-contributing)
    - [Pre-requisites](#pre-requisites)
        - [Node.js](#nodejs)
        - [Git](#git)
        - [ES6 Supporting Browser](#es6-supporting-browser)
        - [MongoDB](#mongodb)
    - [Installation](#installation)
        - [Environment Variables](#environment-variables)
          - [MongoDB URI](#mongodb-uri)
          - [Express Session Secret](#express-session-secret)
          - [Password Hash](#password-hash)
        - [A Small Note on the Curriculum](#a-small-note-on-the-curriculum)
        - [Another Small Note but this time on Git Branches](#another-small-note-but-this-time-on-git-branches)
    - [Running](#running)
        - [DevRun](#devrun)
        - [Normal SSU](#normal-ssu)
        - [Server Deployment](#server-deployment)
  - [Contributing to the Project](#contributing-to-the-project)
    - [Reporting Security Issues](#reporting-security-issues)
    - [Reporting Bugs or Issues](#reporting-bugs-or-issues)
        - [Bug Checklist](#bug-checklist)
          - [Does this issue pertain to this project?](#does-this-issue-pertain-to-this-project)
          - [Did I cause the issue?](#did-i-cause-the-issue)
          - [Am I using the right version of the required software?](#am-i-using-the-right-version-of-the-required-software)
          - [Has this issue been already reported?](#has-this-issue-been-already-reported)
          - [Is the issue a security related one?](#is-the-issue-a-security-related-one)
        - [Filing and Issue](#filing-and-issue)
    - [Contributing to the Codebase](#contributing-to-the-codebase)
    - [Suggesting and Enhancement or Feature](#suggesting-and-enhancement-or-feature)
    - [Updating Documentation](#updating-documentation)
    - [Other](#other)
  - [Standards and Styleguides](#standards-and-styleguides)
    - [Formatting Styleguide](#formatting-styleguide)
        - [General](#general)
        - [JavaScript](#javascript)
        - [HTML](#html)
        - [CSS](#css)
        - [JSON/Data Formats](#jsondata-formats)
    - [Standards](#standards)
        - [Documentation](#documentation)
        - [Issue/PR Labels](#issuepr-labels)
          - [Bugs](#bugs)
          - [Issue Related](#issue-related)
          - [Specification](#specification)
          - [Misc](#misc)
  - [Contact Us](#contact-us)

## Setup for Contributing
### Pre-requisites
##### Node.js
The Node.js Runtime is required to run the backend server (which is what serves the website). Versions above `10.x` are supported. It is suggested, to use Node `13.x`. NPM is also required but typically comes installed with Node.js. You can check the Node.js version by doing
```shell
node -v
```
##### Git
The Git CLI is required to download the code from the repository.
##### ES6 Supporting Browser
A modern browser that supports the ES6 specs for JS are required to view the website Chrome/Chromium, Firefox, and Safari will do.
##### MongoDB
While MongoDB is not 100% needed to run the website, we suggest you install it anyways so logins and user verification can be used. To install MongoDB see their [documentation guide](https://docs.mongodb.com/manual/installation/). Make sure the server is running on `localhost` or another location specified in the local or system list of [Environment Variables](#environment-variables)

### Installation
Use the following to download the repository and install the needed packages:
```shell
git clone https://github.com/ideoxan/ideoxan.git
cd ideoxan
npm install
```

##### Environment Variables
The server supports using both system-wide and local environment variables. If you are unable to set a system-wide environment variable, then create a `.env` file in the main Ideoxan directory. Make sure that your node environment is not set to `production` otherwise the environment variables will not be used locally. The following is a list of used environment variables. If any of them are conflicting, please inform us.
```env
MONGO_URI
EXPRESS_SESSION_SECRET
PWD_HASH
```
###### MongoDB URI
The `MONGO_URI` environment variable is used to set the URI of the MongoDB database. This URI must be a valid MongoURI String. The default is `mongodb://localhost:27017/ix`
###### Express Session Secret
The `EXPRESS_SESSION_SECRET` environment variable is the secret that all of the sessions authenticated with that server will use. It is best to keep this secure and safe as this can be used to invalidate, modify, and spoof sessions (which is not good). Keep this as long and as complex as possible. There is no default due to security reasons.
###### Password Hash
The `PWD_HASH` environment variable is a integer value that is used to hash passwords within the bcryptjs module. Keep the number high enough where the passwords are secure but low enough that it doesn't cause the server to slow down. Again, for security reasons, there is no default value.

##### A Small Note on the Curriculum
If you are looking to contribute to a course or lesson, please see our other GitHub repos with the prefix of `curriculum-`. All of our curriculum guides are kept on GitHub (not all are publicly available) and are stored serverside under `/static/curriculum` and are requested by the client side under the static Express directory (`/static`). The curriculum is not included with the editor, website, or any of its contents and can be installed under the curriculum directory by using the following:
```shell
cd static/curriculum
git clone https://github.com/ideoxan/curriculum-<WANTED CURRICULUM GUIDE>.git
```
Or, you can use our installer tool. Create a file called `courses.json` under `/static/curriculum`. Modify the array to include the names of courses (excluding the `curriculum-`) prefix. Then run the following:
```shell
node courseInstaller.js
```

##### Another Small Note but this time on Git Branches
There are two main branches that are used: `master` and `prod`. The `prod` branch is what is sent out for production and deployment. We try to only update this branch every so often when needed (hotfixes are slower to be merged). The `master` branch is is where a majority of our new commits go to. Think of this as a fresh nightly build system. While this branch has the newest code, it doesn't mean its the most stable. If you plan on using this on the long term and don't feel like updating every 20 minutes, we suggest you use the `prod` branch.

### Running
There are three options to run the server.
##### DevRun
DevRun is the command to run the server on a development machine. This allows for easy editing and quick server startup. It relies on the Nodemon package, so ensure that the developer dependencies outlined in the `package.json` file are installed via NPM.

To run the server locally use:
```shell
npm run devrun
```
##### Normal SSU
To startup the server without any additional features, run:
```shell
npm run start
```
Alternatively, the server can be started up just like any normal Node.js project:
```shell
node server.js
```
##### Server Deployment
***This method is not suggested to be used since this option is personally tailored for specific servers used by Ideoxan.***

This requires PM2 to be installed ***globally***.
```shell
npm run server
```
If that does not work use:
```shell
pm2 start server.js --name ideoxan --max-memory-restart 500M --watch --cron "0 2 * * *"
```

## Contributing to the Project
### Reporting Security Issues
First and foremost, if you believe the issue to be one pertaining to security, ***DO NOT OPEN AN ISSUE. REPORT THE BUG DIRECTLY TO US THROUGH EMAIL***

The issue you are reporting is typically a security issue when...
- You can access, view, edit, or in any way alter something that is not yours
- You have discovered something that most likely is not the work of Ideoxan, its partners, packages, contributors, verified advertisers or maintainers on the site, in the code repository, or anywhere else
- You have discovered a possible way to abuse the API, site, or server
- Your system has been compromised because of the usage of Ideoxan and its products

If you have experienced any of the above, this is most likely the result of a possible security risk and should be reported. Failure to report could result in possible legal action on our behalf. 

Even if your issue does not meet the above and still believe it is a security related issue, do not hesitate to email us. It’s better to be safe rather than to be sorry.

### Reporting Bugs or Issues
##### Bug Checklist
Please check the following to ensure that you are cleared to open an issue.

###### Does this issue pertain to this project?
If your issue has to do with the Node.js runtime, any of the packages/software that is not covered/maintained by Ideoxan, or anything else, then this is not the proper place to file your issue with. If you need help being directed to the proper bug tracker or troubleshooting guide, feel free to contact us. (See [Contact Us](#contact-us))

###### Did I cause the issue?
If you have modified any of the source, there is a high probability that the issue has been caused by tampering. If the issue still persists after reverting your code, open an issue.

###### Am I using the right version of the required software?
We do not support old software. Please check your versions against the ones specified in the `master` branch's `package.json`/`package-lock.json` and in the [Pre-requisites Section in our Contributing guide](#pre-requisites).

###### Has this issue been already reported?
If the issue has already been reported and it is still open on our GitHub, please comment your issue rather than opening a new issue. If it is not still open check the status of it. If it has the `wont-fix` tag attached to the issue, do not bring it up again unless you see it as a prominent issue and a significant amount of time has passed. Also check to see if there is a solution. Sometimes issues will be closed not because they were marked as invalid or a solution was reached but because of a lack of activity. If you find this to be the case, feel free to request the issue to be re-opened. 

###### Is the issue a security related one?
If you issue relates to security, please see [Reporting Security Issues](#reporting-security-issues).

##### Filing and Issue
If you followed the above and met the requirements, you can now open an issue. Make sure to use a descriptive title, and ***clearly*** describe your issue. Be sure to follow the [bug report template](about:blank) (strongly suggested). If you fail to describe your issue properly your issue will be closed without explanation.

### Contributing to the Codebase
If you are contributing to the codebase (does not include documentation), please make sure to follow our [formatting](#formatting-styleguide) and [documentation](#documentation-standards) standards.

Please check if there are already any issues open that can be resolved. If not, make sure that a pull request doesn't already cover what you are attempting to merge. 

If you are sure of the above, open a pull request using our [PR Template](about:blank)

### Suggesting and Enhancement or Feature
If you are suggesting that Ideoxan adds a new feature or expands upon an existing one, please open an issue using the [Feature Request Template](about:blank)

### Updating Documentation
*Coming Soon*

### Other
If you have a question or concern that doesn't meet the above, feel free to reach out to us (See [Contact Us](#contact-us))

## Standards and Styleguides
This repository strives to allow for compatibility, uniformity, and overall legibility. We suggest if you are attempting to contribute to this project's source, that you read the following.
### Formatting Styleguide
##### General
*Coming Soon*
##### JavaScript
*Coming Soon*
##### HTML
*Coming Soon*
##### CSS
*Coming Soon*
##### JSON/Data Formats
*Coming Soon*

### Standards
##### Documentation
*Coming Soon*
##### Issue/PR Labels
###### Bugs
| Label        | Description                                                                                     |                               Search                                |
| :----------- | :---------------------------------------------------------------------------------------------- | :-----------------------------------------------------------------: |
| Critical Bug | A bug that hinders the website completely useless and is critical to basic operation/management | [🔎](https://github.com/ideoxan/ideoxan/labels/bug%20%28critical%29) |
| Bug (Medium) | A bug of medium severity that impacts a significant portion of the site and/or its users.       |  [🔎](https://github.com/ideoxan/ideoxan/labels/bug%20%28medium%29)  |
| Bug (Low)    | A low priority bug that barely has any impact on the site and/or its users                      |   [🔎](https://github.com/ideoxan/ideoxan/labels/bug%20%28low%29)    |

###### Issue Related
| Label     | Description                                                                                                       |                          Search                          |
| :-------- | :---------------------------------------------------------------------------------------------------------------- | :------------------------------------------------------: |
| Duplicate | An issue that is a duplicate of a previous, closed (solved) issue, open (pending) issue, or a closed pull request | [🔎](https://github.com/ideoxan/ideoxan/labels/duplicate) |
| Won't Fix | An issue unrelated to the project or and issue that can not be resolved                                           |  [🔎](https://github.com/ideoxan/ideoxan/labels/wontfix)  |
| Invalid   | An issue that has no prevalence to the project or can not be replicated                                           |  [🔎](https://github.com/ideoxan/ideoxan/labels/invalid)  |
| Question  | More information must be provided for the question to be valid                                                    | [🔎](https://github.com/ideoxan/ideoxan/labels/question)  |

###### Specification
| Label         | Description                                                                                     |                            Search                            |
| :------------ | :---------------------------------------------------------------------------------------------- | :----------------------------------------------------------: |
| Website       | A website-related issue                                                                         |    [🔎](https://github.com/ideoxan/ideoxan/labels/website)    |
| Server        | A server-related issue                                                                          |    [🔎](https://github.com/ideoxan/ideoxan/labels/server)     |
| Documentation | An issue related to the documentation of the site, server, or API                               | [🔎](https://github.com/ideoxan/ideoxan/labels/documentation) |
| Other         | An issue that does not deal with either the website, server or documentation                    |     [🔎](https://github.com/ideoxan/ideoxan/labels/other)     |
| Enhancement   | A suggestion for a new feature under consideration or an improvement of an already existing one |  [🔎](https://github.com/ideoxan/ideoxan/labels/enhancement)  |

###### Misc
| Label            | Description                                                                                                                                                                                                   |                               Search                                |
| :--------------- | :------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ | :-----------------------------------------------------------------: |
| Help Wanted      | A tag given to an issue or pull request that needs external review or contribution. Usually if given, the issue is either out of the scope of knowledge of the maintainers or is not of the highest priority. |    [🔎](https://github.com/ideoxan/ideoxan/labels/help%20wanted)     |
| Good First Issue | If you are new around here, this is a great place to start! This is either and active issue or a good example of an issue for newcomers to tackle.                                                            | [🔎](https://github.com/ideoxan/ideoxan/labels/good%20first%20issue) |

## Contact Us
If you need to reach out, please contact us at the following links below
- E-Mail: [hello.skyclo@gmail.com](mailto:hello.skyclo@gmail.com)
- Discord: *Coming Soon*

More platforms will be added in the future.
