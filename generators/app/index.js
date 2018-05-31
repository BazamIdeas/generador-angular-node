'use strict';
// Require dependencies
var Generator = require('yeoman-generator');

module.exports = class extends Generator {
  // Configurations will be loaded here.
  // Ask for user input
  prompting() {
    return this.prompt([
      {
        type: 'input',
        name: 'name',
        message: 'Che como querés que se chame tu proyecto',
        // Defaults to the project's folder name if the input is skipped
        default: this.appname
      }
    ]).then(answers => {
      this.props = answers;
    });
  }

  // Writing Logic here
  writing() {

    let props = this.props;

    const dirs = require('./loader');

    dirs.forEach(_el => {
      let el = _el.split('_').join('');

      this.fs.copyTpl(this.templatePath(_el), this.destinationPath(el));
    });
  }
};
