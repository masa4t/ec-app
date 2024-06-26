import { PayloadAction, createSlice } from "@reduxjs/toolkit";

interface CartItem {
  id: string;
  name: string;
  description: string;
  price: number;
  imageUrls: string[];
  stock: number;
  createdAt: Date;
  updatedAt: Date;
  count: number;
}

interface CartState {
  cartItems: CartItem[];
  amount: number;
  total: number;
}
const initialState: CartState = {
  cartItems: [],
  amount: 0,
  total: 0,
};

export const cartSlice = createSlice({
  name: "cart",
  initialState,
  reducers: {
    initializeCart: (state) => {
      // ローカルストレージからカートの内容を読み込む
      const savedCart = localStorage.getItem("cart");
      if (savedCart) {
        state.cartItems = JSON.parse(savedCart);
        state.amount = state.cartItems.reduce(
          (sum, item) => sum + item.count,
          0
        );
        state.total = state.cartItems.reduce(
          (sum, item) => sum + item.price,
          0
        );
      }
    },
    addToCart: (
      state,
      action: PayloadAction<{ product: CartItem; count: number }>
    ) => {
      const { product, count } = action.payload;
      const newItem = {
        ...product,
        price: product.price * count,
        count: count,
      };
      state.cartItems.push(newItem);
      state.amount += count;
      state.total += product.price * count;
      localStorage.setItem("cart", JSON.stringify(state.cartItems));
    },
    removeCart: (
      state,
      action: PayloadAction<{ productId: string; count: number; price: number }>
    ) => {
      const { productId, count, price } = action.payload;
      state.cartItems = state.cartItems.filter((item) => item.id !== productId);
      state.amount -= count;
      state.total -= price;
      localStorage.setItem("cart", JSON.stringify(state.cartItems));
    },

    increaseItem: (state, action: PayloadAction<CartItem>) => {
      const product = action.payload;
      const existingItem = state.cartItems.find(
        (item) => item.id === product.id
      );
      if (existingItem) {
        existingItem.count += 1;
        existingItem.price += product.price / product.count;

        state.amount += 1;
        state.total += product.price / product.count; // アイテムの単価を合計金額に追加
        localStorage.setItem("cart", JSON.stringify(state.cartItems));
      }
    },
    decreaseItem: (state, action: PayloadAction<CartItem>) => {
      const product = action.payload;
      const existingItem = state.cartItems.find(
        (item) => item.id === product.id
      );
      if (existingItem) {
        existingItem.count -= 1;
        existingItem.price -= product.price / product.count;

        state.amount -= 1;
        state.total -= product.price / product.count; // アイテムの単価を合計金額に追加
        localStorage.setItem("cart", JSON.stringify(state.cartItems));
      }
    },
    resetCart: (state) => {
      state.cartItems = [];
      state.amount = 0;
      state.total = 0;

      localStorage.removeItem("cart");
    },
  },
});

export const {
  addToCart,
  initializeCart,
  removeCart,
  increaseItem,
  decreaseItem,
  resetCart,
} = cartSlice.actions;
export default cartSlice.reducer;
