import React from "react";

const ImageHelper = ({product}) =>  {
    const imageurl = product ? product.image : `https://media.kohlsimg.com/is/image/kohls/3935552_Charcoal_Marvel?wid=1200&hei=1200&op_sharpen=1`
    return (  
        <div className="rounded border border-success p-2">
            <img src={imageurl}
            style = {{maxHeight: "100%", maxWidth: "100%"}}
            className = "mb-3 rounded"
            alt=""
            />
        </div>
    );
};

export default ImageHelper;