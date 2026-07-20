import React, { useContext, useState } from "react";
import "./PlaceOrder.css";
import { StoreContext } from "../../../Context/StoreContext";
import axios from "axios";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const PlaceOrder = () => {
  const { getTotalCartAmount } = useContext(StoreContext);

  const [formData, setFormData] = useState({
    firstname: "",
    lastname: "",
    email: "",
    street: "",
    city: "",
    state: "",
    zipcode: "",
    country: "",
    phone: "",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const isFormValid = Object.values(formData).every(
    (field) => field.trim() !== ""
  );

  const handleSubmit = async (e) => {
    e.preventDefault();

    const orderdata = {
      ...formData,
      zipcode: Number(formData.zipcode),
      phone: Number(formData.phone),
    };

    try {
      const response = await axios.post(
        "http://localhost:8080/saveDeliveryInfo",
        orderdata,
        {
          headers: { "Content-Type": "application/json" },
        }
      );

      console.log("Response:", response.data);

      if (response.data.statusCode === 201) {
        toast.success("Order placed successfully!");

        setFormData({
          firstname: "",
          lastname: "",
          email: "",
          street: "",
          city: "",
          state: "",
          zipcode: "",
          country: "",
          phone: "",
        });
      } else {
        toast.error("Error placing order. Please try again.");
      }
    } catch (error) {
      console.error("Order placement error:", error);
      toast.error("Order placement unsuccessful. Please try again.");
    }
  };

  return (
    <div>
      <form onSubmit={handleSubmit} className="place-order">
        <div className="place-order-left">
          <p className="title">Delivery Information</p>
          <div className="mutli-fileds">
            <input
              type="text"
              name="firstname"
              placeholder="First Name"
              value={formData.firstname}
              onChange={handleChange}
            />
            <input
              type="text"
              name="lastname"
              placeholder="Last Name"
              value={formData.lastname}
              onChange={handleChange}
            />
          </div>
          <input
            type="email"
            name="email"
            placeholder="Email Address"
            value={formData.email}
            onChange={handleChange}
          />
          <input
            type="text"
            name="street"
            placeholder="Street"
            value={formData.street}
            onChange={handleChange}
          />
          <div className="mutli-fileds">
            <input
              type="text"
              name="city"
              placeholder="City"
              value={formData.city}
              onChange={handleChange}
            />
            <input
              type="text"
              name="state"
              placeholder="State"
              value={formData.state}
              onChange={handleChange}
            />
          </div>
          <div className="mutli-fileds">
            <input
              type="text"
              name="zipcode"
              placeholder="Zip code"
              value={formData.zipcode}
              onChange={handleChange}
            />
            <input
              type="text"
              name="country"
              placeholder="Country"
              value={formData.country}
              onChange={handleChange}
            />
          </div>
          <input
            type="text"
            name="phone"
            placeholder="Phone"
            value={formData.phone}
            onChange={handleChange}
          />
        </div>

        <div className="place-order-right">
          <div className="cart-total">
            <h2>Cart Total</h2>
            <div className="cart-total-details">
              <p>Subtotal</p>
              <p>₹{getTotalCartAmount()}</p>
            </div>
            <hr />
            <div className="cart-total-details">
              <p>Delivery Fee</p>
              <p>₹{getTotalCartAmount() > 0 ? 10 : 0}</p>
            </div>
            <hr />
            <div className="cart-total-details">
              <b>Total</b>
              <b>
                ₹{getTotalCartAmount() === 0 ? 0 : getTotalCartAmount() + 10}
              </b>
            </div>
            <button type="submit" disabled={!isFormValid}>
              Place Order
            </button>
          </div>
        </div>
      </form>
      <ToastContainer />
    </div>
  );
};

export default PlaceOrder;
