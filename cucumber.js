module.exports = {
  default: {
    paths: ['funcionalidades/**/*.feature'],
    require: [
      'funcionalidades/definiciones_pasos/**/*.js',
      'funcionalidades/soporte/**/*.js'
    ],
    format: [
      'progress-bar',
      'html:test-results/cucumber-report.html',
      'json:test-results/cucumber-report.json'
    ],
    formatOptions: {
      snippetInterface: 'async-await'
    },
    parallel: 1
  }
};