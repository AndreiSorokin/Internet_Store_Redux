import { CartItem } from "../misc/type";
import cartReducer, { addToCart, clearCart, getCartFromLocalStorage, removeFromCart, updateCartItemQuantity } from "../redux/slices/cartSlice";

const initialState = {
  items: getCartFromLocalStorage(),
};

describe('addToCart', () => {

  test('should add item to cart if it does not exist', () => {

    const action = {
      payload: {
        product: {
          id: 1,
          title: 'Product A',
          price: 10,
          description: 'Description of Product A',
          category: { id: 1, name: 'Category A', image: 'image-url' },
          images: ['image-url1', 'image-url2'],
        },
        quantity: 2,
      },
    };

   const nextState = cartReducer(initialState, addToCart(action.payload as unknown as CartItem));

    expect(nextState.items.length).toBe(1);
    expect(nextState.items[0].product.id).toBe(1);
    expect(nextState.items[0].quantity).toBe(2);
  });

  test('should remove item from cart if it exists', () => {

    const addToCartAction = {
      payload: {
        product: {
          id: 1,
          title: 'Product A',
          price: 10,
          description: 'Description of Product A',
          category: { id: 1, name: 'Category A', image: 'image-url' },
          images: ['image-url1', 'image-url2'],
        },
        quantity: 2,
      },
    };
    
    const stateAfterAddition = cartReducer(initialState, addToCart(addToCartAction.payload as unknown as CartItem));

    const removeFromCartAction = {
      payload: 1,
    };

    const stateAfterRemoval = cartReducer(stateAfterAddition, removeFromCart(removeFromCartAction.payload));
    
    expect(stateAfterRemoval.items.length).toBe(0);
  });

  test('should update quantity of existing item in the cart', () => {

    const addToCartAction = {
      payload: {
        product: {
          id: 1,
          title: 'Product A',
          price: 10,
          description: 'Description of Product A',
          category: { id: 1, name: 'Category A', image: 'image-url' },
          images: ['image-url1', 'image-url2'],
        },
        quantity: 2,
      },
    };

    const stateAfterAddition = cartReducer(initialState, addToCart(addToCartAction.payload as unknown as CartItem));

    const updateQuantityAction = {
      payload: {
        productId: 1,
        quantity: 5,
      },
    };

    const stateAfterUpdate = cartReducer(stateAfterAddition, updateCartItemQuantity(updateQuantityAction.payload));

    expect(stateAfterUpdate.items.length).toBe(1);
    expect(stateAfterUpdate.items[0].product.id).toBe(1);
    expect(stateAfterUpdate.items[0].quantity).toBe(5);
  });

  test('should clear all items from the cart', () => {

    const addToCartAction1 = {
      payload: {
        product: {
          id: 1,
          title: 'Product A',
          price: 10,
          description: 'Description of Product A',
          category: { id: 1, name: 'Category A', image: 'image-url' },
          images: ['image-url1', 'image-url2'],
        },
        quantity: 2,
      },
    };

    const stateAfterAddition = cartReducer(initialState, addToCart(addToCartAction1.payload as unknown as CartItem));

    const stateAfterClearing = cartReducer(stateAfterAddition, clearCart());

    expect(stateAfterClearing.items.length).toBe(0);
  });
});