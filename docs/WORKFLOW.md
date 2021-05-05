# Document Workflow

This file contains some basic guidlines related to this project. This help new developers to easily understand and contribute to the code and also help existing developers to work parallerly without worrying much about conflicts.

**Developers are requested to follow these guidlines**

# Contributing
For contributing follow these steps:
1. Clone this repository using `git clone`
2. Create a local branch with proper name. `fix-abc` for fixes and `feature-abc` for features.
3. Use proper commit message and keep it short and precise. Use description to explain more about commit. Gnereal format for commit `git commit -m "Short main heading" -m "Short description about commit"`
4. After you are done run `npm run struct` and then create merge request and write informative description about MR.
5. Keep your local branches up to date with remote branches using `git rebase`.

# Coding Standards
Will add clang format in near future.

# Convention
1. **All functions related to database (firebase) should be written in firebase-functions file.**
2. Keep the components isolated so that changing one wont create issue in other
3. Components go into components folder. For each component create a folder with component name and inside it use `index.js` for main file and create suitable files like `functions.js` to prevent overcrowding `index.js`