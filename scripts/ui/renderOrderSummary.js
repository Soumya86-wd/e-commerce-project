import { retrieveCartItems } from "../data/cartData.js";
import { getProductById } from "../data/productsData.js";
import { getDeliveryOptionById, retrieveDeliveryOptions } from "../data/deliveryOptions.js";

export function renderOrderSummary() {
  const cartItems = retrieveCartItems();

  let cartSummaryHTML = '';

  cartItems.forEach((cartItem) => {
    cartSummaryHTML += renderCartItemSummary(cartItem);
  });

  document.getElementById('js-order-summary').innerHTML = cartSummaryHTML;
  console.log('Order Summary Rendered');
}

function renderDeliveryOptionsHtml(cartItem) {

  let deliveryOptionsHTML = '';
  const deliveryOptions = retrieveDeliveryOptions();
  const productId = cartItem.productId;

  deliveryOptions.forEach((deliveryOption) => {
    const isOptionChecked = (cartItem.deliveryOptionId === deliveryOption.id);

    deliveryOptionsHTML += `
      <div class="delivery-option"
            data-product-id="${productId}"
            data-delivery-option-id="${deliveryOption.id}">
        <input type="radio" 
          ${isOptionChecked ? 'checked' : ''}
          class="delivery-option-input"
          name="delivery-option-${productId}">
        <div>
          <div class="delivery-option-date">
            ${deliveryOption.getDeliveryDateString()}
          </div>
          <div class="delivery-option-price">
            ${deliveryOption.getPriceString()} Shipping
          </div>
        </div>
      </div>
    `;
    
  });

  return deliveryOptionsHTML;
}

function renderProductDetailsHtml(cartItem) {
  const productDetails = getProductById(cartItem.productId);

  return `
    <img class="product-image"
        src="${productDetails.getImagePath()}">

    <div class="cart-item-details"
          data-product-id=${productDetails.id}>
      <div class="product-name">
        ${productDetails.name}
      </div>
      <div class="product-price">
        ${productDetails.getPriceinRupees()}
      </div>
      <div class="product-quantity">
        <span>
          Quantity: <span class="quantity-label">${cartItem.quantity}</span>
        </span>
        <span class="update-quantity-link link-primary">
          Update
        </span>
        <span class="delete-quantity-link link-primary">
          Delete
        </span>
      </div>
    </div>
  `;
}

function renderDeliveryDateText(cartItem) {
  const selectedDeliveryOption = getDeliveryOptionById(cartItem.deliveryOptionId);
  return selectedDeliveryOption.getDeliveryDateString();
}

function renderCartItemSummary(cartItem) {
  return `
    <div class="cart-item-container">
      <div class="delivery-date">
        Delivery date: ${renderDeliveryDateText(cartItem)}
      </div>

      <div class="cart-item-details-grid">
        ${renderProductDetailsHtml(cartItem)}

        <div class="delivery-options">
          <div class="delivery-options-title">
            Choose a delivery option:
          </div>
          ${renderDeliveryOptionsHtml(cartItem)}
        </div>
      </div>
    </div>
  `;
}

