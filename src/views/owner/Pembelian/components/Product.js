import React from 'react';
import { Link } from 'react-router-dom';

export default function Product(props){
    const {product}=props;
    return(
        <div key={product._id} className="cardA">
                 <a href={'/transaction/order/product/${product._id}'}>
                 <img className="medium" src={product.image} alt={product.name} />
                 </a>
              <div className="cardA-body">
                 <Link to={'/transaction/order/product/'+product._id}>
                 <h2>{product.name}</h2>
                 </Link>
                <div className="description">{product.description}</div>
                <div className="price">Rp. {product.price}</div>
              </div>
        </div>
    )
}
