module.exports = {
  default: {
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
    timeout: 60000  // ⭐ 60 segundos (antes eran 5)
  }
};