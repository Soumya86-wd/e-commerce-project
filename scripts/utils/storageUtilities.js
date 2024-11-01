export function retrieveLocalCart() {
  return JSON.parse(localStorage.getItem('cartData'));
}

export function updateLocalCart(userId, cartItems, cartState) {
  const cartData = {
    userId, 
    cartItems,
    cartState
  };

  localStorage.setItem('cartData', JSON.stringify(cartData));
}