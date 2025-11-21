import { createContext, useEffect, useState } from "react";
// import { food_list } from '../assets/assets';
import axios from "axios";

export const StoreContext = createContext(null);

const StoreContextProvider = (props) => {
  const url = "https://food-delivery-backend-vspi.onrender.com/";
  // read initial token first so we can load the correct cart storage key
  const initialToken = localStorage.getItem("token") || "";

  const getUserIdFromToken = (t) => {
    try {
      if (!t) return null;
      const payload = t.split(".")[1];
      const decoded = JSON.parse(atob(payload));
      return decoded?.id || decoded?.userId || null;
    } catch {
      return null;
    }
  };

  const [token, setToken] = useState(() => initialToken);

  const [cartItem, setCartItem] = useState(() => {
    try {
      const uid = getUserIdFromToken(initialToken);
      const key = uid ? `cartItem_user_${uid}` : `cartItem_guest`;
      const raw = localStorage.getItem(key);
      return raw ? JSON.parse(raw) : {};
    } catch {
      return {};
    }
  });

  const [food_list, setFoodList] = useState([]);

  const fetchFoodList = async () => {
    const response = await axios.get(url + "/api/food/list");
    setFoodList(response.data.data);
  };

  const addToCart = async (itemId) => {
    if (!cartItem[itemId]) {
      setCartItem((prev) => ({ ...prev, [itemId]: 1 }));
    } else {
      setCartItem((prev) => ({ ...prev, [itemId]: prev[itemId] + 1 }));
    }
    if (token) {
      await axios.post(
        url + "/api/cart/add",
        { itemId },
        { headers: { token } }
      );
    }
  };

  const removeFromCart = async (itemId) => {
    // update local state immediately
    setCartItem((prev) => {
      if (!prev[itemId]) return prev;
      const newCount = prev[itemId] - 1;
      if (newCount <= 0) {
        const copy = { ...prev };
        delete copy[itemId];
        return copy;
      }
      return { ...prev, [itemId]: newCount };
    });

    // sync with backend if user is authenticated
    if (token) {
      try {
        await axios.post(
          url + "/api/cart/remove",
          { itemId },
          { headers: { token } }
        );
      } catch (err) {
        console.error("removeFromCart failed", err);
      }
    }
  };

  const getTotalCartAmount = () => {
    let cartTotalAmount = 0;
    for (const item in cartItem) {
      if (cartItem[item] > 0) {
        let itemInfo = food_list.find((product) => product._id === item);
        if (!itemInfo) continue; // item list may not be loaded yet
        cartTotalAmount += itemInfo.price * cartItem[item];
      }
    }
    return cartTotalAmount;
  };

  const loadCartData = async (token) => {
    try {
      const response = await axios.post(
        url + "/api/cart/get",
        {},
        { headers: { token } }
      );
      if (response?.data?.success) {
        setCartItem(response.data.cartData || {});
      }
    } catch (err) {
      console.error("loadCartData failed", err);
    }
  };

  // persist cart to a per-user or guest key so different users have separate carts
  useEffect(() => {
    try {
      const uid = getUserIdFromToken(token);
      const key = uid ? `cartItem_user_${uid}` : `cartItem_guest`;
      localStorage.setItem(key, JSON.stringify(cartItem));
    } catch (e) {
      console.error("failed to persist cartItem", e);
    }
  }, [cartItem, token]);

  // keep token in sync with localStorage so UI reflects logged-in state on reload
  useEffect(() => {
    // if(token) localStorage.setItem('token', token);
    // else localStorage.removeItem('token');

    async function loadData() {
      await fetchFoodList();
      if (token) {
        localStorage.setItem("token", token);
        // fetch server cart and replace local cart with server cart for this user
        await loadCartData(token);
      } else {
        // on logout: remove token and show guest cart (or empty)
        localStorage.removeItem("token");
        try {
        //   const raw = localStorage.getItem("cartItem_guest");
        //   setCartItem(raw ? JSON.parse(raw) : {});
          setCartItem( {});
        } catch {
          setCartItem({});
        }
      }
    }
    loadData();
  }, [token]);

  const contextValue = {
    food_list,
    cartItem,
    setCartItem,
    addToCart,
    removeFromCart,
    getTotalCartAmount,
    url,
    token,
    setToken,
  };
  return (
    <StoreContext.Provider value={contextValue}>
      {props.children}
    </StoreContext.Provider>
  );
};

export default StoreContextProvider;
