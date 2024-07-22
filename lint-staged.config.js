const path = require('path')
const currentWorkingDirectory = process.cwd()

module.exports = {
  // Lint
  'src/**/*.{js,ts,jsx,tsx,vue}': () => {
    return `eslint ./src --ext .vue,.js,.jsx,.ts,.tsx --fix --ignore-path .gitignore`
  },
}
