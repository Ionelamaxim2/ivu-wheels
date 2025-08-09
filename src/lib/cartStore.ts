// Simple cart store for testing
let cartItems: any[] = [];

export const cartStore = {
  getItems: () => cartItems,

  addItem: (item: any) => {
    const existingIndex = cartItems.findIndex(
      (cartItem) => cartItem.id === item.id
    );
    if (existingIndex !== -1) {
      cartItems[existingIndex].quantity += item.quantity;
    } else {
      cartItems.push(item);
    }
    console.log("Cart updated:", cartItems);
  },

  clearItems: () => {
    cartItems = [];
    console.log("Cart cleared");
  },

  getItemCount: () => cartItems.length,
};
