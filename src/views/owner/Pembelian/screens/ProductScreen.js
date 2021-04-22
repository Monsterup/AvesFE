import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Link } from 'react-router-dom';
import dataIot from '../dataIot';
import { detailsProduct } from '../actions/productActions';
import LoadingBox from '../components/LoadingBox';
import MessageBox from '../components/MessageBox';

export default function ProductScreen(props) {
  const product = dataIot.products.find((x) => x._id === props.match.params.id);
  const dispatch = useDispatch();
  const productId = props.match.params.id;
  const productDetails = useSelector((state) => state.productDetails);
  //const {product} = productDetails
  useEffect(() => {
    dispatch(detailsProduct(productId));
  }, [dispatch, productId]);

const [qty, setQty] = useState(1);
const addToCartHandler = () => {
  props.history.push(`/cart/${productId}?qty=${qty}`);
}; 

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
              {product.countInStock > 0 && (
                    <>
                      <li>
                        <div className="rowA">
                          <div>Qty</div>
                          <div>
                            <select
                              value={qty}
                              onChange={(e) => setQty(e.target.value)}
                            >
                              {[...Array(product.countInStock).keys()].map(
                                (x) => (
                                  <option key={x + 1} value={x + 1}>
                                    {x + 1}
                                  </option>
                                )
                              )}
                            </select>
                          </div>
                        </div>
                      </li>
                      <li>
                        <Link to="/transaction/order/cart">
                         <button onClick={addToCartHandler}
                          className="primary block">
                          Add to Cart
                          </button>
                        </Link>
                      </li>
                    </>
                  )}
            </ul>
          </div>
        </div>
        </div>
       </div>
       )}
  

