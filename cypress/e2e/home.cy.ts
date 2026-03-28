/// <reference types="cypress" />

describe("Home Page", () => {
  it("should load products", () => {
    cy.visit("/");

    cy.get('[data-testid="product-item"]').should("exist");
  });
});