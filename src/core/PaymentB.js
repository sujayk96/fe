import React, {useEffect, useState} from "react";
import {Redirect} from "react-router-dom";
import { cartEmpty } from "./helper/carthelper";
import { getmeToken, processPayment } from "./helper/paymentHelper";
import { createOrder } from "./helper/orderHelper";
import { isAuthenticated, signout } from "../auth/helper";
import DropIn from "braintree-web-drop-in-react";
import { getProducts } from "./helper/coreapicalls";

const PaymentB = ({

    products,
    reload = undefined,
    setReload = (f) => f,
}) => {

    const [info, setInfo] = useState({
        loading: false,
        success: false,
        clientToken: null,
        error: "",
        instance: {}
    })

    const userId = isAuthenticated && isAuthenticated().user.id;
    const token = isAuthenticated && isAuthenticated().token;

    const getToken = (userId, token) =>{
        getmeToken(userId, token)
        .then((info) => {
            if (info.error) {
                setInfo({
                    ...info,
                    error: info.error,
                });
                signout(() => {
                    return <Redirect to="/" />;
                });
            }
            else{
                console.log(info);
                const clientToken = info.clientToken;
                setInfo({clientToken});
            }
        })
    }

        useEffect(() => {
            getToken(userId, token);
        }, []);


        const onPurchase = () => {
            setInfo({loading: true});
            let nonce;
            let getNonce = info.instance.requestPaymentMethod()
            .then((data) => {
                console.log("data", data);
                nonce = data.nonce;
                const paymentData = {
                    paymentMethodNonce: nonce,
                    amount: getAmount(),
                };
            processPayment(userId, token, paymentData)
            .then((response) => {
                console.log("process payment ", response);
                if (response.error){
                    if (response.code == "1"){
                        console.log("payment failed!");
                        signout(() => {
                            return <Redirect to ="/" />
                        });
                    }
                }
                else{
                    setInfo({...info, success: response.success, loading: false});
                    console.log("payment success");

                    let product_names = "";
                    products.forEach(function (item){
                        product_names+= item.name + ",";
                    });

                    const orderData = {
                        product_names: product_names,
                        transaction_id: response.transaction.id,
                        amount: response.transaction.amount,
                    };
                    console.log("order data", orderData);
                    createOrder(userId, token, orderData)
                    .then((response) => {
                        
                        if (response.error){
                            console.log("order failed");
                            if (response.code == "1"){
                                console.log("payment failed!");
                                signout(() => {
                                    return <Redirect to ="/" />
                                });
                            }
                        } 
                        else{
                            if (response.success == true){
                                console.log("order placed");
                            }
                        }
                    })
                    .catch((error) => {
                        setInfo({loading: false, success:false});
                        console.log("order failed", error);
                    });
                    cartEmpty(() => {
                        console.log("Crashed?");
                    });
                    setReload(!reload);
                }
            })
            .catch((error) => {
                setInfo({loading: false, success:false});
                console.log("order failed", error);

            });
            });
          
        };


        const getAmount = () => {
            let amount = 0;
            products.map((p) => {
                amount = amount + parseInt(p.price);
            });
            return amount;
        }

    const showbtnDropIn = () =>{
        return(
            <div>
                {
                info.clientToken !== null && products.length > 0 ? 
                (
                    <div>
                        <DropIn
                options={{ authorization: info.clientToken }}
                onInstance={(instance) => (info.instance = instance)}
              >
              </DropIn>

                        <button onClick={onPurchase} className="btn btn-block btn-success"> Buy now</button>
                        
                    </div>
                ) :
                 (
                    <h3> Please login first or add in cart</h3>
                )
                 }
            </div>
        )
    }
    return (
        <div>
            <h1>Your bill is {getAmount()}</h1>
            {showbtnDropIn()}
        </div>
    );
};

export default PaymentB;