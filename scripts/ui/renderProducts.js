import { retrieveAllProducts, loadProducts } from "../data/productsData.js";

let products = [];

async function renderProductsPage() {
  try {
    await loadProducts();
    products = retrieveAllProducts();
    if (products.length > 0) {
      renderProductsGrid();
    } else {
      displayErrorMessage('No products available at the moment.');
    }
  } catch(error) {
    displayErrorMessage('Failed to load products. Please try again later.');
    console.error('Error loading or processing products.json', error);
  }
}

renderProductsPage();

function renderProductsGrid() {
  const productsGridElement = document.getElementById('js-products-grid');
  const fragment = document.createDocumentFragment();

  products.forEach((productObj) => {
    const productHTML = renderProductHTML(productObj);
    const tempDiv = document.createElement('div');
    tempDiv.innerHTML = productHTML;
    fragment.appendChild(tempDiv.firstElementChild);
  });

  productsGridElement.appendChild(fragment);
}

function renderProductHTML(productObj) {
  return `
        <div class="product-container"
              data-id="${productObj.id}">

        <div class="product-clickable-area">
          <div class="product-image-container">
            <img class="product-image"
              src="${productObj.getImagePath()}">
          </div>

          <div class="product-name limit-text-to-2-lines">
            ${productObj.name}
          </div>
        </div>
          
        <div class="product-rating-container">
          <img class="product-rating-stars"
            src="${productObj.getStarsURL()}">
          <div class="product-rating-count link-primary">
            ${productObj.rating.count}
          </div>
        </div>

        <div class="product-price">
          ${productObj.getPriceinRupees()}
        </div>

        <div class="product-quantity-container">
          <select>
            <option selected value="1">1</option>
            <option value="2">2</option>
            <option value="3">3</option>
            <option value="4">4</option>
            <option value="5">5</option>
            <option value="6">6</option>
            <option value="7">7</option>
            <option value="8">8</option>
            <option value="9">9</option>
            <option value="10">10</option>
          </select>
        </div>

        ${productObj.extraInfoHTML()}

        <div class="product-spacer"></div>

        <div class="added-to-cart">
          <img src="./assets/images/icons/checkmark.png">
          Added
        </div>

        <button class="add-to-cart-button button-primary">
          Add to Cart
        </button>
      </div>
  `;
}

function displayErrorMessage(message) {
  const productsGridElement = document.getElementById('js-products-grid');
  productsGridElement.innerHTML = `<div class="error-message">${message}</div>`;
}