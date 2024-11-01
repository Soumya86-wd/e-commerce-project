import { createMachine, assign, createActor } from 'xstate';
import { Cart, intializeCart, retrieveCartItems, retrieveCartUser } from '../data/cartData.js';
import { retrieveLocalCart, updateLocalCart } from '../utils/storageUtilities.js';

const config = {
  guestUser: 'guest'
}

export const cartStates = {
  PRELOAD: 'preload',
  LOAD_SUCCESS: 'loadSuccess',
  LOAD_ERROR: 'loadError',
  EMPTY: 'empty',
  HAS_ITEMS: 'hasItems',
  CHECKOUT: 'checkout',
};

export const cartEvents = {
  LOAD_ITEMS: 'LOAD_ITEMS',
  RETRY_LOAD: 'RETRY_LOAD',
  ADD_ITEM: 'ADD_ITEM',
  REMOVE_ITEM: 'REMOVE_ITEM',
  UPDATE_QUANTITY: 'UPDATE_QUANTITY',
  UPDATE_DELIVERY_OPTION: 'UPDATE_DELIVERY_OPTION',
  PROCEED_TO_CHECKOUT: 'PROCEED_TO_CHECKOUT',
  COMPLETE_PURCHASE: 'COMPLETE_PURCHASE',
  CANCEL_ORDER: 'CANCEL_ORDER',
};

export const cartMachine = createMachine(
  {
    /** @xstate-layout N4IgpgJg5mDOIC5QGMCGAnALgOgA7rABsB7VCAYgmIDsxsBLagN2IGs6SyBhDTASUxgAtrADaABgC6iULmKx6mejRkgAHogDMAFgAc2AJwA2XQHYArABoQAT0TnzARmxGATOfHjNux9qMHTTQBfIOs0LDwCTgowdHRidDxCVEwAMwShbGieLAFhMSlVOQUlFSR1LSNNQxMLazsETU1nTQtPb19-U1dTELDeLNIIAGUAV2RkOFhyCWly4sVlalUNBF1dbWxtVqtbewNxbE9PNwcA7cc+kHCcaLGJqZnHOdl5RbLQVfNdAy2d+vsviOx3EjgOgT05iuN0GZAAonEEuQAEpwgAqyIAmgB9AAyAHkAIIAEVmRTepWW5VWriM2F84lOAMark2ZihoWuA2EuEwNnIJOJ2L4aLhAFkyfMKUsVohHI5GdhvuYDNovKZjNpVczHBZgccOn4Aj1oQMABaoWB5EQC4lCkXiyWvEoy6mIVyaX4bf57BAAWl1R005lMCu0odBplBrlNEQtVsENtRYvxADU4cLRRLClKXR8Kgg3HSNbVdg0enT3AafEbur1OTD49bpsm0xmHRLnuS81TPogjArsLTzEzfZ7DqHtK4fuZpwZdMEG+bLc3yABVAAKxMJouxAEU14SAHJokWYp0gBaU2UIBX6VxeRzuZkBsFK4MR8MK3Wg2M4JuJtMm7bruxJwrifDpli2L4hup74keF5Xq6fb+to5iGAyo4NH6HrVKYughmGEa6n+2AAfk5Absi+JcHCcJCmi+LYlwAAScJcAA0via5okh0r5qsBH6KG7LMhsSpkcgZpgMgrDEKMmDkFw+JihuuLohmG5rsibGEsMcL8T2N5PgYzjbHUvquAYvy+BstLbNovh+FJMlyQpSlcMedG4jByJgciRnvL2BaOM0pjYBYpjCSqBxeC+pjFlqNm6OIBjDmF9actQxAQHAqg3N2wU3n6BjVGZarYYgfqaK4zjTkR4hfpGZH4EQQxFdeboIFOzLaGqkUeO0NZdCaS4RHc4yTLA8C5sV3XmDofyWQ0DiHENw2dAEi79BNQwIvE6CdShBYPpsFllu6qXYAuTStHZXiMmRPJ8sdglygqvwlmJvp6PeQ09NFf1pWRFEiG9IWrFqmwrYg85Dr4c6zj8C5Na5snyYpEMmZo4gYVOxjRdZRGaEYzJGIcNkpVG8545VIQhEAA */
    id: 'cart',
    initial: cartStates.PRELOAD,

    context: {
      userId: config.guestUser, // To be set after authentication. default is guest.
      cartItems: [], // Array of cart items: { productId, deliveryOptionId, quantity }
      error: null, // To capture any loading errors
      currentState: cartStates.PRELOAD,
    },

    states: {
      [cartStates.PRELOAD]: {
        entry: assign({
          currentState: () => cartStates.PRELOAD,
        }),
        invoke: {
          id: 'loadCartItems',
          src: 'loadCartItems', // Asynchronous service to load cart items
          onDone: {
            target: cartStates.LOAD_SUCCESS,
            actions: 'assignCartItems', // Assign loaded items to context
          },
          onError: {
            target: cartStates.LOAD_ERROR,
            actions: 'assignError',
          },
        },
      },

      [cartStates.LOAD_SUCCESS]: {
        entry: [
          assign({
            currentState: () => cartStates.LOAD_SUCCESS,
          }),
        ],
        on: {
          '': [
            {
              target: cartStates.EMPTY,
              cond: 'cartIsEmpty',
            },
            {
              target: cartStates.HAS_ITEMS,
              cond: 'cartHasItems',
            }
          ],
        },
      },

      [cartStates.LOAD_ERROR]: {
        entry: assign({
          currentState: () => cartStates.LOAD_ERROR,
        }),
        on: {
          [cartEvents.RETRY_LOAD]: {
            target: cartStates.PRELOAD, // Retry loading items by transitioning back to preload
          }
        },
      },

      [cartStates.EMPTY]: {
        entry: assign({
          currentState: () => cartStates.EMPTY,
        }),
        on: {
          [cartEvents.ADD_ITEM]: {
            target: cartStates.HAS_ITEMS,
            actions: 'addOrUpdateItem',
          },
        },
      },

      [cartStates.HAS_ITEMS]: {
        entry: assign({
          currentState: () => cartStates.HAS_ITEMS,
        }),
        on: {
          [cartEvents.ADD_ITEM]: {
            actions: 'addOrUpdateItem',
          },
          [cartEvents.REMOVE_ITEM]: [
            {
              actions: 'removeItemFromCart',
              cond: 'cartIsEmpty',
              target: cartStates.EMPTY,
            },
            {
              actions: 'removeItemFromCart',
              target: cartStates.HAS_ITEMS,
            },
          ],
          [cartEvents.UPDATE_QUANTITY]: {
            actions: 'updateItemQuantity',
          },
          [cartEvents.UPDATE_DELIVERY_OPTION]: {
            actions: 'updateDeliveryOption',
          },
          [cartEvents.PROCEED_TO_CHECKOUT]: {
            target: cartStates.CHECKOUT,
          },
        },
      },

      [cartStates.CHECKOUT]: {
        entry: assign({
          currentState: () => cartStates.CHECKOUT,
        }),
        on: {
          [cartEvents.COMPLETE_PURCHASE]: {
            target: cartStates.EMPTY,
            actions: resetCartItems,
          },
          [cartEvents.CANCEL_ORDER]: {
            target: cartStates.HAS_ITEMS,
          },
        },
      },
    },
  },
  
  {
    actions: {
      assignCartItems: assign({
        cartItems: (context, event) => {
          const cartItems = event.data.cartItems || [];
          updateLocalCart(context.userId, cartItems, context.currentState);
          return cartItems;
        },
        userId: (context, event) => {
          const userId = event.data.userId || null;
          updateLocalCart(userId, context.cartItems, context.currentState);
          return userId;
        },
      }),

      assignError: assign({
        error: (context, event) => event.data,
      }),

      addOrUpdateItem: assign({
        cartItems: (context, event) => {
          
          const existingCart = new Cart({
            userId: context.userId,
            cartItems: context.cartItems
          });

          const updatedCart = existingCart.addToCart(
            event.cartItem.productId,
            event.cartItem.quantity
          );

          updateLocalCart(context.userId, updatedCart.cartItems, context.currentState);

          return updatedCart.cartItems;
        },
      }),

      removeItemFromCart: assign({
        cartItems: (context, event) => {

          const existingCart = new Cart({
            userId: context.userId,
            cartItems: context.cartItems
          });

          const updatedCart = existingCart.removeFromCart(event.cartItem.productId);
          
          updateLocalCart(context.userId, updatedCart.cartItems, context.currentState);

          return updatedCart.cartItems;
        },
      }),

      updateItemQuantity: assign({
        cartItems: (context, event) => {

          const existingCart = new Cart({
            userId: context.userId,
            cartItems: context.cartItems
          });

          const updatedCart = existingCart.updateQuantity(
            event.cartItem.productId,
            event.cartItem.quantity
          );

          updateLocalCart(context.userId, updatedCart.cartItems, context.currentState);

          return updatedCart.cartItems;
        },
      }),

      updateDeliveryOption: assign({
        cartItems: (context, event) => {
          
          const existingCart = new Cart({
            userId: context.userId,
            cartItems: context.cartItems
          });

          const updatedCart = existingCart.updateDeliveryOption(
            event.cartItem.productId,
            event.cartItem.deliveryOptionId
          );

          updateLocalCart(context.userId, updatedCart.cartItems, context.currentState);

          return updatedCart.cartItems;
        },
      }),

      resetCartItems: assign({
        cartItems: (context, event) => {

          const existingCart = new Cart({
            userId: context.userId,
            cartItems: context.cartItems
          });

          const updatedCart = existingCart.resetCartItems();

          updateLocalCart(context.userId, updatedCart.cartItems, context.currentState);

          return updatedCart.cartItems;
        }
      }),
    },

    guards: {
      cartHasItems: (context) => context.cartItems.length > 0,
      cartIsEmpty: (context) => context.cartItems.length === 0,
    },

    services: {
      loadCartItems: async (context) => {

        const savedCart = retrieveLocalCart();
        if(savedCart && savedCart.userId !== config.guestUser){
          return {
            cartItems: savedCart.cartItems,
            userId: savedCart.userId
          }
        }

        // First loading the cart data from the database
        await intializeCart();

        // Then retrieving the loaded cart into the cart state
        const cartItems = retrieveCartItems();
        const userId = retrieveCartUser() || context.userId;

        return {
          cartItems: cartItems,
          userId: userId
        };
      },
    },
  }
);

export const cartService = createActor(cartMachine);
cartService.start();
