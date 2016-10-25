# react-app-dawn

It is likley the case that using one of these boilerplates is more than adequite for the average developer working on an average React app.

* [http://reactboilerplate.com](http://reactboilerplate.com)
* [redux-easy-boilerplate](https://github.com/anorudes/redux-easy-boilerplate)

This isn't a slight of the boilerplates or the average developer. Both get the job done in most situtaions.

However, a time will come when knowing the details off all aspects of a development stack will be required. When this happens you'll need something that more boilerplate and less application seed.

## Brief description of tools used (including implementation deails):

### Node Version Manager

* [Node Version Manager](https://github.com/creationix/nvm) is used to manage which version of node is used for this app.
* the [`.nvmrc`](.nvmrc) defines the current version of node.

### Yarn Dependancy Manager

* [Yarn](https://yarnpkg.com/) is used to manage [npm](https://www.npmjs.com/) packages and modules, via configurations set in [package.json](https://yarnpkg.com/en/docs/package-json).
* The [package.json](package.json) file is used by [Yarn](https://yarnpkg.com/) to manage dependencies.
* The [yarn.lock](yarn.lock) file is [auto generatoed so that Yarn knows at all times the exact versions of all dependencies](https://yarnpkg.com/en/docs/yarn-lock).

### Webpack 2

* Webpack 2 is used to take es2015 modules and translate them into a format the can run in the web browser.
* The configuration file for webpack is [webpack.config.babel.js](webpack.config.babel.js). By using babel in the name of the file the file itself will be babalized before running.

### Babel

* Webpack uses Babel to transform [latest](http://babeljs.io/docs/plugins/preset-latest/), [stage0](http://babeljs.io/docs/plugins/preset-stage-0/), and [react](http://babeljs.io/docs/plugins/preset-react/) code to ES5 code.


## Conventions used:

* Don't place unecessary configurations in package.json that can be contained in there own configuration file (e.g. .babelrc, .nvmrc, .eslintrc, .stylelintrc).


