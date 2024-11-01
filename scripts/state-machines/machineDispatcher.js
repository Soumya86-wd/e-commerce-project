import { cartMachine, cartEvents, cartService } from './cartMachine.js';

const services = {
  cartService,
};

export const sendEvent = (event, payload) => {
  
  // Dispatch events to the appropriate service
  switch (event) {
  
    case cartEvents.LOAD_ITEMS:
      services.cartService.send(event);
      break;

    case cartEvents.RETRY_LOAD:
      services.cartService.send(event);
      break;
  
    case cartEvents.ADD_ITEM:
      services.cartService.send(event, { cartItem: payload });
      break;
  
    case cartEvents.REMOVE_ITEM:
      services.cartService.send(event, { productId: payload });
      break;
  
    case cartEvents.UPDATE_QUANTITY:
      services.cartService.send(event, { productId: payload.productId, newQuantity: payload.newQuantity });
      break;
  
    case cartEvents.PROCEED_TO_CHECKOUT:
      services.cartService.send(event);
      break;
  
    case cartEvents.COMPLETE_PURCHASE:
      services.cartService.send(event);
      break;
  
    case cartEvents.CANCEL_ORDER:
      services.cartService.send(event);
      break;
  
    default:
      console.warn(`Unhandled event: ${event}`);
      break;
  }
};


export const getCurrentCartState = () => services.cartService.state;

export const getCartItems = () => services.cartService.state.context.cartItems;

export const getUserId = () => services.cartService.state.context.userId;

