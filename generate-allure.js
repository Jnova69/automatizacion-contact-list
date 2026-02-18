const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

// Verificar que existe el JSON de Cucumber
const cucumberJsonPath = path.join(__dirname, 'test-results', 'cucumber-report.json');
if (!fs.existsSync(cucumberJsonPath)) {
  console.error('Error: No se encontró cucumber-report.json');
  console.error('Ejecuta las pruebas primero: npm test');
  process.exit(1);
}

// Leer el JSON de Cucumber
const cucumberJson = JSON.parse(fs.readFileSync(cucumberJsonPath, 'utf8'));

// Crear carpeta de resultados de Allure si no existe
const allureResultsDir = path.join(__dirname, 'test-results', 'allure-results');
if (fs.existsSync(allureResultsDir)) {
  // Limpiar carpeta existente
  fs.rmSync(allureResultsDir, { recursive: true, force: true });
}
fs.mkdirSync(allureResultsDir, { recursive: true });

console.log('Convirtiendo resultados de Cucumber a formato Allure...');

// Convertir cada escenario de Cucumber a formato Allure
let testCount = 0;
cucumberJson.forEach((feature, featureIndex) => {
  if (!feature.elements) return;
  
  feature.elements.forEach((scenario, scenarioIndex) => {
    const uuid = `${Date.now()}-${featureIndex}-${scenarioIndex}`;
    
    // Determinar status del escenario
    let status = 'passed';
    let statusDetails = null;
    
    if (scenario.steps) {
      const failedStep = scenario.steps.find(s => s.result && s.result.status === 'failed');
      if (failedStep) {
        status = 'failed';
        statusDetails = {
          message: failedStep.result.error_message || 'Test failed'
        };
      } else if (scenario.steps.some(s => s.result && s.result.status === 'skipped')) {
        status = 'skipped';
      }
    }
    
    const allureResult = {
      uuid: uuid,
      historyId: scenario.id || `${feature.id}-${scenario.name}`,
      fullName: `${feature.name}: ${scenario.name}`,
      labels: [
        { name: 'feature', value: feature.name },
        { name: 'suite', value: feature.name },
        { name: 'story', value: scenario.name }
      ],
      links: [],
      name: scenario.name,
      status: status,
      statusDetails: statusDetails,
      stage: 'finished',
      steps: (scenario.steps || []).map((step, stepIndex) => ({
        name: `${step.keyword}${step.name}`,
        status: step.result ? step.result.status : 'skipped',
        stage: 'finished',
        start: Date.now() - 1000 - (stepIndex * 100),
        stop: Date.now() - 1000 - (stepIndex * 100) + (step.result && step.result.duration ? step.result.duration / 1000000 : 100)
      })),
      start: Date.now() - 2000,
      stop: Date.now()
    };

    // Guardar resultado en formato Allure
    const resultFile = path.join(allureResultsDir, `${uuid}-result.json`);
    fs.writeFileSync(resultFile, JSON.stringify(allureResult, null, 2));
    testCount++;
  });
});

console.log(`${testCount} resultados convertidos a formato Allure`);
console.log('Generando reporte HTML de Allure...');

try {
  // Generar el reporte HTML de Allure
  execSync('npx allure generate test-results/allure-results --clean -o test-results/allure-report', {
    stdio: 'inherit'
  });
  console.log('Reporte Allure generado exitosamente en test-results/allure-report/');
} catch (error) {
  console.error('Error generando reporte Allure:', error.message);
  process.exit(1);
}