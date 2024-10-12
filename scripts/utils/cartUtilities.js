import { intializeCart, retrieveCartItems } from "../data/cartData.js";

export async function getCartQuantity() {
  let cartItems = retrieveCartItems();
  if(!cartItems || cartItems.length === 0) {
    try {
      await intializeCart();
      cartItems = retrieveCartItems();
    } catch (error) {
      console.error('Error loading cart', error);
    }
  }

  let cartQuantity = 0;
  if(cartItems && cartItems.length > 0) {
    cartItems.forEach((cartItem) => {
      cartQuantity += cartItem.quantity;
    });
  }
  
  return cartQuantity;
}