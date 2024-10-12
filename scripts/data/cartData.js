import { retrieveDeliveryOptions, loadDeliveryOptions } from "./deliveryOptions.js";

let config = {};
let cart = null;

async function initializeDeliveryOptions() {
  await loadDeliveryOptions();
  const deliveryOptions = retrieveDeliveryOptions();
  config = {
    jsonDataFilePath: './temp-backend/cart.json',
    validDeliveryIds: deliveryOptions.map((deliveryDetails) => {
      return deliveryDetails.id;
    }),
    defaultDeliveryId: deliveryOptions.find((deliveryDetails) => 
      deliveryDetails.pricePaisa === 0
    ).id
  };
}

export async function intializeCart() {
  await initializeDeliveryOptions();
  await loadCart();
}

export function saveCart(newCart) {
  cart = newCart;
}

export function retrieveCartItems() {
  if(!cart) {
    return [];
  }
  return cart.cartItems;
}

class Cart {
  userId;
  cartItems;

  constructor(cartDetails) {
    this.userId = cartDetails.userId;
    this.cartItems = cartDetails.cartItems;
  }

  addToCart(productId, quantity) {
    if (!cart || quantity <= 0 || !Number.isInteger(quantity)) {
      return false;
    }
    
    const matchingItem = this.cartItems.find(cartItem => 
      cartItem.productId === productId
    );
    
    if(matchingItem) {
      matchingItem.quantity += quantity;
    } else {
      this.cartItems.push({
        productId,
        quantity,
        deliveryOptionId: config.defaultDeliveryId
      });
    }

    return true;
  }

  removeFromCart(productId) {
    if(!cart) {
      return false;
    }
    
    const originalCartLength = this.cartItems.length;
    this.cartItems = this.cartItems.filter(cartItem => 
      cartItem.productId !== productId
    );

    return !(originalCartLength === this.cartItems.length);
  }

  updateDeliveryOption(productId, deliveryOptionId) {
    if(!cart) {
      return false;
    }

    const matchingItem = this.cartItems.find(cartItem => 
      cartItem.productId === productId
    );
    
    if(matchingItem && config.validDeliveryIds.includes(deliveryOptionId)) {
      matchingItem.deliveryOptionId = deliveryOptionId;
    } else {
      return false;
    }
    
    return true;
  }
}

async function loadCart() {
  try {
    const response = await fetch(config.jsonDataFilePath);
    const cartDetails = await response.json();

    saveCart(new Cart(cartDetails));
  } catch (error) {
    console.error('Error fetching cart', error);
  }
}
