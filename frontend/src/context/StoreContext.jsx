import { createContext, useEffect, useState } from 'react';
// import { food_list } from '../assets/assets';
import axios from 'axios';


export const StoreContext = createContext(null);

const StoreContextProvider = (props) => { 
    const url = "http://localhost:4000"

    const [cartItem, setCartItem] = useState({});
    const [token, setToken] = useState(()=> localStorage.getItem('token') || "")
    const [food_list, setFoodList] = useState([]);

    const fetchFoodList = async ()=>{
        const response = await axios.get(url+"/api/food/list");
        setFoodList(response.data.data)
    }

    const addToCart = (itemId) => {
        if(!cartItem[itemId]){
            setCartItem((prev)=>({...prev, [itemId]:1}));
        }
        else{
            setCartItem((prev)=>({...prev, [itemId]:prev[itemId]+1}));
        }
    }

    const removeFromCart = (itemId) => {
        setCartItem((prev)=>{
            if(!prev[itemId]) return prev;
            const newCount = prev[itemId] - 1;
            if(newCount <= 0){
                const copy = {...prev};
                delete copy[itemId];
                return copy;
            }
            return {...prev, [itemId]: newCount};
        });
    }

    const getTotalCartAmount = ()=>{
        let cartTotalAmount = 0;
        for( const item in cartItem){
            if( cartItem[item]>0 ){
                let itemInfo = food_list.find((product)=> product._id===item);
                cartTotalAmount += itemInfo.price*cartItem[item];
            }
        }
        return cartTotalAmount;
    }

    useEffect(() => {
        console.log(cartItem);
    }, [cartItem]);

    // keep token in sync with localStorage so UI reflects logged-in state on reload
    useEffect(()=>{
        // if(token) localStorage.setItem('token', token);
        // else localStorage.removeItem('token');

        async function loadData(){
            await fetchFoodList();
            if(token) localStorage.setItem('token', token);
            else localStorage.removeItem('token');
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
    }
    return (    
        <StoreContext.Provider value={contextValue}>
            {props.children}
        </StoreContext.Provider>
    );
}

export default StoreContextProvider;