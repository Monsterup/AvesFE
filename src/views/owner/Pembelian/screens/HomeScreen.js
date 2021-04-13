import React from 'react';
import Product from '../components/Product';
import dataIot from '../dataIot';

export default function HomeScreen(){
    return(
        <div>
          <div className="rowA center">
          {dataIot.products.map(product => (
          <Product key={product._id} product={product}></Product>
          )) }    
          </div>
        </div>
    );
}