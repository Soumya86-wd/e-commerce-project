import { getDeliveryOptionById } from "../data/deliveryOptions.js";
import { getProductById } from "../data/productsData.js";

const config = {
  taxRate: 0.125
}

export function formatPaisaToRupees(pricePaisa) {
  return (Math.round(pricePaisa) / 100).toFixed(2);
}

export function getPaymentSummary(cartItems) {
  const paymentSummary = {
    itemsTotalRupees: 0,
    shippingTotalRupees: 0,
    beforeTaxRupees: 0,
    taxTotalRupees: 0,
    totalAmountRupees: 0,
    totalItems: 0,
    taxRate: (config.taxRate * 100).toFixed(2)
  }

  let itemsTotalPaisa = 0;
  let shippingTotalPaisa = 0;

  cartItems.forEach((cartItem) => {
    const productDetails = getProductById(cartItem.productId);
    itemsTotalPaisa += productDetails.pricePaisa;

    const selectedDeliveryOption = getDeliveryOptionById(cartItem.deliveryOptionId);
    shippingTotalPaisa += selectedDeliveryOption.pricePaisa;

    paymentSummary.totalItems += cartItem.quantity;
  });

  const beforeTaxPaisa = itemsTotalPaisa + shippingTotalPaisa;
  const taxTotalPaisa = beforeTaxPaisa * config.taxRate;
  const totalAmountPaisa = beforeTaxPaisa + taxTotalPaisa;

  paymentSummary.itemsTotalRupees = formatPaisaToRupees(itemsTotalPaisa);
  paymentSummary.shippingTotalRupees = formatPaisaToRupees(shippingTotalPaisa);
  paymentSummary.beforeTaxRupees = formatPaisaToRupees(beforeTaxPaisa);
  paymentSummary.taxTotalRupees = formatPaisaToRupees(taxTotalPaisa);
  paymentSummary.totalAmountRupees = formatPaisaToRupees(totalAmountPaisa);

  return paymentSummary;
}