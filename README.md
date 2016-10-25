# react-app-dawn

A breifly opinionated React/Redux/Webpack2/Babel/PostCSS/CSSModules/esLint/CSSLint application seed.

## Brief description of tools used (including implementation deails):

### Node Version Manager

* [Node Version Manager](https://github.com/creationix/nvm) is used to manage which version of node is used for this app
* the [`.nvmrc`](.nvmrc) defines the current version of node

### Yarn Dependancy Manager

* [Yarn](https://yarnpkg.com/) is used to manage [npm](https://www.npmjs.com/) packages and modules, via configurations set in [package.json](https://yarnpkg.com/en/docs/package-json)
* The [package.json](package.json) file is used by [Yarn](https://yarnpkg.com/) to mangae dependencies.
* The [yarn.lock](yarn.lock) file is [auto generatoed so that Yarn knows at all times the exact versions of all dependencies](https://yarnpkg.com/en/docs/yarn-lock).
* 

### Webpack2

* Webpack is used to take es2015 modules and translate them into a format the can run by web browser
* The configuration file for webpack is webpack.config.babel.js. By using babel in the name of the file the file itself will be babalized before running.

### Babel

* Webpack uses Babel to transform [latest](http://babeljs.io/docs/plugins/preset-latest/), [stage0](http://babeljs.io/docs/plugins/preset-stage-0/), and [react](http://babeljs.io/docs/plugins/preset-react/) code to ES5 code.


## Stack conventions used:

* Don't place unecessary configurations in package.json that can be contained in there own configuration file (e.g. .babelrc, .nvmrc, .eslintrc, .stylelintrc)


