import { deliveryOptions, fetchDeliveryOptions } from "./deliveryOptions.js";

let config = {};
export let cart = new Cart({ userId: null, cartItems: [] });

async function initializeDeliveryOptions() {
  await fetchDeliveryOptions();
  console.log(deliveryOptions);
  
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
  await fetchCart();
  console.log(cart);
}

intializeCart();

class Cart {
  userId;
  cartItems;

  constructor(cartDetails) {
    this.userId = cartDetails.userId;
    this.cartItems = cartDetails.cartItems;
  }

  addToCart(productId, quantity) {
    if (quantity <= 0 || !Number.isInteger(quantity)) {
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
    const originalCartLength = this.cartItems.length;
    this.cartItems = this.cartItems.filter(cartItem => 
      cartItem.productId !== productId
    );

    return !(originalCartLength === this.cartItems.length);
  }

  updateDeliveryOption(productId, deliveryOptionId) {
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

async function fetchCart() {
  try {
    const response = await fetch(config.jsonDataFilePath);
    const cartDetails = await response.json();

    cart = new Cart(cartDetails);
  } catch (error) {
    console.error('Error fetching cart', error);
  }
}
