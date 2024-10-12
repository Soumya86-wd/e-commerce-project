import { retrieveCartItems } from "../data/cartData.js";
import { getPaymentSummary } from "../utils/moneyUtilities.js";

export function renderPaymentSummary() {
  const cartItems = retrieveCartItems();
  const paymentSummary = getPaymentSummary(cartItems);

  document.getElementById('js-payment-summary')
    .innerHTML = renderPaymentHtml(paymentSummary);

  console.log('Payment Summary Rendered');
}

function renderPaymentHtml(paymentSummary) {
  return `
    <div class="payment-summary-title">
      Order Summary
    </div>

    <div class="payment-summary-row">
      <div>Items (${paymentSummary.totalItems}):</div>
      <div class="payment-summary-money">INR ${paymentSummary.itemsTotalRupees}</div>
    </div>

    <div class="payment-summary-row">
      <div>Shipping &amp; handling:</div>
      <div class="payment-summary-money">INR ${paymentSummary.shippingTotalRupees}</div>
    </div>

    <div class="payment-summary-row subtotal-row">
      <div>Total before tax:</div>
      <div class="payment-summary-money">INR ${paymentSummary.beforeTaxRupees}</div>
    </div>

    <div class="payment-summary-row">
      <div>Estimated tax (${paymentSummary.taxRate}%):</div>
      <div class="payment-summary-money">INR ${paymentSummary.taxTotalRupees}</div>
    </div>

    <div class="payment-summary-row total-row">
      <div>Order total:</div>
      <div class="payment-summary-money">INR ${paymentSummary.totalAmountRupees}</div>
    </div>

    <button class="place-order-button button-primary">
      Place your order
    </button>
  `;
}