import { getCartQuantity } from "../utils/cartUtilities.js";

const config = {
  htmlPage: {
    productsPage: './products.html',
    checkoutPage: './checkout.html',
    ordersPage: './orders.html'
  },
  iconLogoPath: {
    mainLogoLight: './assets/images/common/main-logo-white.png',
    mobileLogoLight: './assets/images/common/mobile-logo-white.png',
    mainLogoDark: './assets/images/common/main-logo.png',
    mobileLogoDark: './assets/images/common/mobile-logo.png',
    searchIcon: './assets/images/icons/search-icon.png',
    cartIcon: './assets/images/icons/cart-icon.png',
    checkoutLockIcon: './assets/images/icons/checkout-lock-icon.png'
  }
}

export async function renderMainHeaderHtml() {
  const cartQuantity = await getCartQuantity();
  console.log(cartQuantity);
  const cartQuantityDisplay = (cartQuantity)
                            ? '' + cartQuantity
                            : '';
  
  const mainHeaderHtml = `
    <div class="main-header-left-section">
      <a href="${config.htmlPage.productsPage}" class="header-link">
        <img class="main-logo"
          src="${config.iconLogoPath.mainLogoLight}">
        <img class="mobile-logo"
          src="${config.iconLogoPath.mobileLogoLight}">
      </a>
    </div>

    <div class="main-header-middle-section">
      <input class="search-bar" type="text" placeholder="Search">

      <button class="search-button">
        <img class="search-icon" src="${config.iconLogoPath.searchIcon}">
      </button>
    </div>

    <div class="main-header-right-section">
      <a class="orders-link header-link" href="${config.htmlPage.ordersPage}">
        <span class="returns-text">Returns</span>
        <span class="orders-text">& Orders</span>
      </a>

      <a class="cart-link header-link" href="${config.htmlPage.checkoutPage}">
        <img class="cart-icon" src="${config.iconLogoPath.cartIcon}">
        <div class="cart-quantity">${cartQuantityDisplay}</div>
        <div class="cart-text">Cart</div>
      </a>
    </div>
  `;

  return mainHeaderHtml;
}

export function renderCheckoutHeaderHtml(){

}