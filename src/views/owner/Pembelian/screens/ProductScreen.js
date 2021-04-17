import React from 'react';
import { Link } from 'react-router-dom';
import dataIot from '../dataIot';

export default function ProductScreen(props) {
  const product = dataIot.products.find((x) => x._id === props.match.params.id);
  if (!product) {
    return <div> Product Not Found</div>;
  }

  
  return (
    <div>
      <Link to="/transaction/order">Back to result</Link>
      <div class="containerA">
        <div class="sectionA">
        <img className="large" src={product.image} alt={product.name}></img>
        </div>
        <div class="sectionA-middle">
        <ul>
            <li>
              <h1>{product.name}</h1>
            </li>
            <li>Price : ${product.price}</li>
            <li>
              Description:
              <p>{product.description}</p>
            </li>
          </ul>
        </div>
        <div class="sectionA">
        <div className="cardA cardA-body">
            <ul>
              <li>
                <div className="rowA">
                  <div>Price</div>
                  <div className="price">${product.price}</div>
                </div>
              </li>
              <li>
                <div className="rowA">
                  <div>Status</div>
                  <div>
                    {product.countInStock > 0 ? (
                      <span className="success">In Stock</span>
                    ) : (
                      <span className="error">Unavailable</span>
                    )}
                  </div>
                </div>
              </li>
              <li>
                <button className="primary block">Add to Cart</button>
              </li>
            </ul>
          </div>
        </div>
        </div>
       </div>
   
    )
}