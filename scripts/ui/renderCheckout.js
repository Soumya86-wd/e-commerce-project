import { renderOrderSummary } from "./renderOrderSummary.js";
import { renderPaymentSummary } from "./renderPaymentSummary.js";
import { intializeCart } from "../data/cartData.js";
import { loadProducts } from "../data/productsData.js";
import { renderCheckoutHeaderHtml } from "./renderHeaders.js";

async function renderCheckoutPage() {
  try {
    await renderPageHeader();
  } catch (error) {
    console.error('Error loading cart quantity', error);
  }

  try {
    await loadProducts();
    await intializeCart();
    renderOrderSummary();
    renderPaymentSummary();
  } catch (error) {
    displayErrorMessage('Failed to load cart. Please try again later.');
    console.error('Problem in loading cart', error);
  }
}

renderCheckoutPage();

async function renderPageHeader() {
  const checkoutHeaderHtml = await renderCheckoutHeaderHtml();
  document.getElementById('js-checkout-header')
    .innerHTML = checkoutHeaderHtml;
}

function displayErrorMessage(message) {
  const mainBodyElement = document.getElementById('js-main');
  mainBodyElement.innerHTML = `<div class="error-message">${message}</div>`;
}