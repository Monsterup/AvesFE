import React from 'react';
import { Link } from 'react-router-dom';

const showProduct = (id) => {
    // localStorage.setItem('productId', id);
    // this.props.history.push('/transaction/order/product');
}

export default function Product(props){
    // console.log(this.props);
    // console.log(props);
    const {product}=props;
    return(
        <div key={product._id} className="cardA">
                 <Link to={'/transaction/order/product/'+product._id}>
                 <img className="medium" src={product.image} alt={product.name} />
                 </Link>
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
