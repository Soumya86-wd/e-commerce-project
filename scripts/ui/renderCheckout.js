import { renderOrderSummary } from "./renderOrderSummary.js";
import { renderPaymentSummary } from "./renderPaymentSummary.js";
import { intializeCart } from "../data/cartData.js";
import { loadProducts } from "../data/productsData.js";

async function renderCheckoutPage() {
  try {
    await loadProducts();
    await intializeCart();
    renderOrderSummary();
    renderPaymentSummary();
  } catch (error) {
    console.error('Problem in loading cart', error);
  }
}

renderCheckoutPage();