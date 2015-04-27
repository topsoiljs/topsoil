# topsoil
The topsoil for your terminal.

npm install -g topsoil

![topsoil_home](/images/topsoil_home.png?raw=true)



# Building From Source:

## Set Up in the root directory

Clone down the repo

- git clone https://github.com/topsoiljs/topsoil

Install all npm dependencies

- npm install

Install the typings

- tsd reinstall

Install all front end dependencies

- bower install

To compile javascript code:
- gulp build-all

To run server under the deploy directory 
- nodemon app.js

Topsoil will be hosted on local host 8000

http://localhost:8000/

# Writing a View:

Topsoil is composed of user authored views. Views are context specific ui's for terminal tasks.

Views are made up of components and stores. A view normally has one store, and a main component that may contain many sub-components. 

```
magic.registerView({
  name: 'super grep',
  commands: [
    {
      name: "Set Directory",
      description: "sets the directory for the super grep view",
      args: ['path'],
      tags: ["set dir", "folder", "current dir", "grep"],
      categories: ['set'],
      method: grepStore['setDir']
    }
  ],
  category: 'filesystem',
  icon: 'file-text-o',
  component: SGrepComponent
});
```




