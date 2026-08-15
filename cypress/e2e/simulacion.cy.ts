describe('Flujo de Simulación de Inversiones', () => {
  beforeEach(() => {
    cy.intercept('POST', '**/api/v1/inversiones/simular', (req) => {
      const { monto, plazoMeses } = req.body as {
        monto: number;
        plazoMeses: number;
      };
      const tasaAplicada = plazoMeses <= 6 ? 0.08 : plazoMeses <= 12 ? 0.1 : 0.125;
      const gananciaEstimada =
        Math.round(monto * tasaAplicada * (plazoMeses / 12) * 100) / 100;

      req.reply({
        statusCode: 200,
        body: {
          monto,
          plazoMeses,
          tasaAplicada,
          gananciaEstimada,
          montoTotal: Math.round((monto + gananciaEstimada) * 100) / 100,
        },
      });
    }).as('simular');

    cy.intercept('GET', '**/api/v1/inversiones/usuario/**', {
      statusCode: 200,
      body: { success: true, data: [] },
    });

    cy.visit('http://localhost:4200');
  });

  it('debe permitir ingresar un monto, seleccionar plazo y ver el resultado', () => {
    // 1. Llenar el formulario
    cy.get('input[name="monto"]').clear().type('2000');
    cy.get('select[name="plazoMeses"]').select('12');

    // 2. Hacer clic en Simular
    cy.get('button[type="submit"]').click();

    cy.wait('@simular');

    // 3. Validar resultados en pantalla
    cy.get('.tarjeta-resultado').within(() => {
      cy.contains('10.0%');
      cy.contains('S/ 200.00'); // Ganancia
      cy.contains('S/ 2,200.00'); // Total
    });
  });
});
