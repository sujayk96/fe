import React, {useState} from "react";
import ImageHelper from "./helper/ImageHelper";
import {Redirect} from "react-router-dom";
import { addItemToCart , removeItemFromCart} from "./helper/carthelper";
import {isAuthenticated} from "../auth/helper/"

const Card = (
    {product,
    showaddtoCart = true,
    removeFromCart = true,
    reload = undefined,
    setReload = f =>f,
    }
) => {
  const [redirect, setRedirect] = useState(false);
    const cartTitle = product ? product.name : "asdfasdfasdf"
    const cartDescription = product ? product.description : "Default description"
    const cartPrice = product ? product.price : "Default price"

    const addtoCart = () => {
        if (isAuthenticated){
          addItemToCart(product, ()=> setRedirect(true));

            console.log("addedtocart", redirect, setRedirect);

        }
        else{
            console.log("login Please");
        }
    };

    const getAredirect = (redirect) => {
        if (redirect){
            return <Redirect to="/cart"/>;
        }
    };

    const showAddToCart = addtoCart => {
        return(
            showaddtoCart && (
                <button
                onClick={addtoCart}
                className="btn btn-block btn-outline-success mt-2 mb-2"
              >
                Add to Cart
              </button>
            )
        )
    };

    const showRemoveFromCart = removeFromCart => {
        return (
            removeFromCart && (
                <button
                onClick={() => {
                  removeItemFromCart(product._id)
                  setReload(!reload)
                    console.log("product removed from cart")
                }}
                className="btn btn-block btn-outline-danger mt-2 mb-2">
                Remove from cart
              </button>
            )
        )
    }
    return (
      <div className="card text-white bg-dark border border-info ">
        <div className="card-header lead">{cartTitle}</div>
        <div className="card-body">
          {getAredirect(redirect)}
          <ImageHelper product={product}/>
          <p className="lead bg-success font-weight-normal text-wrap">
            {cartDescription}
          </p>
          <p className="btn btn-success rounded  btn-sm px-4">${cartPrice}</p>
          <div className="row">
            <div className="col-12">
              {showAddToCart(addtoCart)}
            </div>
            <div className="col-12">
              {showRemoveFromCart(removeFromCart)}
            </div>
          </div>
        </div>
      </div>
    );
  };

  export default Card;