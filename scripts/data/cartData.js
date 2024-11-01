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

export function retrieveCartUser() {
  if(!cart) {
    return null;
  }
  return cart.userId;
}

export class Cart {
  userId;
  cartItems;

  constructor(cartDetails) {
    this.userId = cartDetails.userId;
    this.cartItems = cartDetails.cartItems;
  }

  addToCart(productId, quantity) {
    if (quantity <= 0 || !Number.isInteger(quantity)) {
      return this;
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

    return this;
  }

  removeFromCart(productId) {
    this.cartItems = this.cartItems.filter(cartItem => 
      cartItem.productId !== productId
    );

    return this;
  }

  updateQuantity(productId, newQuantity) {
    if (newQuantity <= 0 || !Number.isInteger(newQuantity)) {
      return this;
    }

    const matchingItem = this.cartItems.find(cartItem => 
      cartItem.productId === productId
    );

    if(matchingItem) {
      matchingItem.quantity = newQuantity;
    }

    return this;
  }

  updateDeliveryOption(productId, newDeliveryId) {
    const matchingItem = this.cartItems.find(cartItem => 
      cartItem.productId === productId
    );
    
    if(matchingItem && config.validDeliveryIds.includes(newDeliveryId)) {
      matchingItem.deliveryOptionId = newDeliveryId;
    } else {
      return this;
    }
    
    return this;
  }

  resetCartItems() {
    this.cartItems = [];
    return this;
  }
}

async function loadCart() {
  try {
    const response = await fetch(config.jsonDataFilePath);

    if (!response.ok) {
      const errorMessage = 'Failed to fetch cart data';
      console.error(errorMessage);
      throw new Error(errorMessage);
    }

    const cartDetails = await response.json();
    saveCart(new Cart(cartDetails));

  } catch (error) {
    console.error('Error in loadCart', error.message);
    throw error;
  }
}
