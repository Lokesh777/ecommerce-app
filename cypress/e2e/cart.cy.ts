/// <reference types="cypress" />

describe("Cart Page", () => {
  it("should show cart items", () => {
    cy.visit("/");

    cy.get('[data-testid="product-item"]')
      .first()
      .click();

    cy.contains("Add to Cart").click();

    cy.visit("/cart");

    cy.contains("Your Cart").should("exist");
  });
});