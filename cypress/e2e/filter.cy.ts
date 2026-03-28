/// <reference types="cypress" />

describe("Filters and Sorting", () => {
  it("should filter by category", () => {
    cy.visit("/");

    cy.get('input[type="checkbox"]').first().click();

    cy.url().should("include", "category=");
  });

  it("should sort products", () => {
    cy.visit("/");

    cy.get("select").select("priceLow");

    cy.url().should("include", "sort=priceLow");
  });
});