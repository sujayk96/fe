import React, {useState, useEffect} from 'react';

import {getProducts} from "./helper/coreapicalls";
import Base from './Base';
import "../styles.css";
import Card from './Card';


export default function Home() {

    const [products, setProducts] = useState([]);
    const [error, setError] = useState(false);

    const loadAllProducts = () =>{


        getProducts()
        .then((data) => {
            
            if (data.error){
                setError(data.error);
                console.log(error);
                
            }
            else{
                console.log(data);
                setProducts(data);
            }
        });
        
    };

    useEffect(()=> {
        loadAllProducts();
    }, []);
    return ( 
        <Base title="HomePage" description="Welcome dear friends to the mighty tshirt store">
            <h1>Home component</h1>
            <div className='"row'>
                {products.map((product, index) => {
                    return(
                        
                        <div key={index} className="col-4 mb-4">
                            <Card product={product}/>
                            
                        </div>
                    );
                })}
            </div>

        </Base>

     );
}
