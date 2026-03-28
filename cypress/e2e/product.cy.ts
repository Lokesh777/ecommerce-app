/// <reference types="cypress" />

describe("Product Detail Page", () => {
  it("should navigate to product detail", () => {
    cy.visit("/");

    cy.get('[data-testid="product-item"]')
      .first()
      .click();

    cy.url().should("include", "/product/");
  });

  it("should add product to cart", () => {
    cy.visit("/");

    cy.get('[data-testid="product-item"]')
      .first()
      .click();

    cy.contains("Add to Cart").click();

    cy.contains("✓ Added").should("exist");
  });
});