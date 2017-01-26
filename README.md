# NPM-Typescript-Template
Template repo for new node/typescript repos.  This is also used by my GitHub-API repo as a semi-stable/consistent repo to test against.

## Prereqs
Install the cli's globally.  You may have to use `sudo` if you're on OSX.  Technically, you don't really need to do this to follow the instructions below, but you'll probably want to be able to run `gulp`, `gulp test`, and `tsc` at times rather than always going through the `npm test` command. 

```bash
npm install -g typescript gulp jasmine
```

## Instructions
Just clone this repo, re-initialize the git repo and manually update the package.json to start your module.  GitHub has [instructions](https://help.github.com/articles/adding-an-existing-project-to-github-using-the-command-line/) on how to then upload it, if you so wish.

You can copy and paste the bash script below to get you started.   You'll just need to edit the first line to reference your new module's name, and you'll have to manually edit the package.json file afterwards.

```bash
NEW_REPO_NAME="MyNewModule"
mkdir $NEW_REPO_NAME && cd $NEW_REPO_NAME 
git clone https://github.com/JonathonRichardson/NPM-Typescript-Template.git .
npm install
rm -rf ./.git
git init .
git add ./*
git commit -m "Initial Commit"
npm test
```

## Description
`src/` contains the code, and `spec` contains the tests.  Any file in spec will get run as part of the test, and any `.ts` files in either directory will be compiled to javascript files in place, and appropriate definition files (`.d.ts`)will also be generated.  `src/index.ts` is referenced as the package entry point, so whatever it exports will be what other node modules get when they `require` this package.  The `package.json` file also points to `src/index.d.ts`, so if the consumer of this package is written in Typescript, the typings will be exported.

If you want to add other files and export classes from them, just re-export them in `index.ts` (see [here](https://www.typescriptlang.org/docs/handbook/modules.html) for more details).

Gulp is used as the build tool.  `gulp` will build the project, and `gulp test` will run the tests.

A **prepublish** hook is used to ensure that the necessary Javascript and definition files are present when pushing to **npm**.  The `in-publish` and `not-in-publish` makes sure that it [only runs when publishing](https://github.com/npm/npm/issues/3059).

By default, npm publishes everything in the directory except for things specified in `.gitignore`.  This would prevent this repo from working as a good **npm** module, as `npm install` wouldn't have the `\*.js`/`\*.d.ts` files that it needs.  That's why we need a custom `.npmignore`, to allow the  `\*.js`/`\*.d.ts` files to be part of the **npm** package.

Typings, jasmine, and gulp are all under **devDependencies** in `package.json`, because they are only required to build the project, and that keeps the package nice and small.  A package only needs to be in **dependencies** if it is referenced somewhere beneath `src/**`.

The `tsconfig.json` file was altered from the default that gets created by running `node_modules/typescript/bin/tsc --init` by adding `"declaration": true`, which generates declaration files, and `"strictNullChecks": true`, which helps prevents lots of issues with trying to access properties on `null` or `undefined` values.  It might seem annoying, but just use it.  Your code will be better, safer, and less frustrating to use.

## Additional Notes

Although they are not referenced in the code here, I strongly recommend using my [typescript-error](https://github.com/JonathonRichardson/typescript-error) module.  By returning `Result<>`, you indicate your function may "throw" an error, and returns it instead.  That allows consuming code to properly handle it, and allows you to indicate subclasses of `Error` that they might need to handle, rather than playing around with `try`/`catch` blocks and checking the error message string to see the type.  You should almost never `throw`.

Similarly, use `Option<>` from that same package to indicate that something may not return a value, rather than returning `null` or `undefined`.  It clearly marks the code as possibly not returning a value, and forces the consumer to deal with that reality, rather than them assuming they got an object that they can call methods on and getting `Cannot read property 'x' of undefined` errors. **strictNullChecks** will help with this too.