import React, { useContext } from "react";
import "./Cart.css";
import { StoreContext } from "../../context/StoreContext";
import { useNavigate } from "react-router-dom";
// import { assets } from '../../assets/assets'

const Cart = () => {
  const { cartItem, food_list, removeFromCart, getTotalCartAmount, url } = useContext(StoreContext);

  const navigate = useNavigate();
  return (
    <div className="cart">
      <div className="cart-items">
        <div className="cart-items-tital">
          <p>Items</p>
          <p>Tital</p>
          <p>Price</p>
          <p>Quantity</p>
          <p>Total</p>
          <p>Remove</p>
        </div>
        <br />
        <hr />
        {food_list.map((item) => {
          if (cartItem[item._id] > 0) {
            return (
              <div>
                <div className="cart-items-tital cart-items-item">
                  <img src={url+"/images/"+item.image} alt="" />
                  <p> {item.name} </p>
                  <p> ${item.price} </p>
                  <p> {cartItem[item._id]} </p>
                  <p> ${item.price * cartItem[item._id]} </p>
                  <p onClick={()=>{removeFromCart(item._id)}}className="cross" > x </p>
                </div>
                <hr />
              </div>
            );
          }
        })}
      </div>
      <div className= {getTotalCartAmount()===0?"cart-is-empty":"none"} >
        <h1>Cart is empty</h1>
      </div>
      <div className= {getTotalCartAmount()===0?"no-item": "cart-bottom"}  >
        <div className="cart-total">
          <h2>Cart Totals</h2>
          <div>
            <div className="card-total-detail">
              <p>Sub Total</p>
              <p>${getTotalCartAmount()}</p>
            </div>
              <hr />
            <div className="card-total-detail">
              <p>Delivery Fee</p>
              <p>${getTotalCartAmount()===0?0:2} </p>
            </div>
              <hr />
            <div className="card-total-detail">
              <b>Total</b>
              <b>${getTotalCartAmount()===0?0:getTotalCartAmount()+2} </b>
            </div>
          </div>
          <button onClick={()=>navigate('/orders')}>Proceed to checkout</button>
        </div>
        <div className="cart-promocode">
          <div>
            <p>If you have PromoCode Enter here</p>
            <div className="cart-promocode-input">
              <input type="text" placeholder="Promo-code" />
              <button>Apply</button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Cart;
