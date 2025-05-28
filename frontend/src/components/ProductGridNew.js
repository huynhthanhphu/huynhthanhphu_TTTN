import React from 'react';

const ProductGridNew = () => {
    return (   
        <div className="flex flex-wrap -mx-2 overflow-hidden">
          <div className="w-full md:w-1/2 p-2 mt-2 mb-[-8px]">
            <img src="./images/sale01.webp" alt="Sale 1" 
            className="w-full h-auto object-cover transition-transform duration-300 ease-in-out hover:scale-105"/>
          </div>
          <div className="w-full md:w-1/2 p-2 ">
            <div className="flex flex-wrap -mx-2 ">
            <div className="w-1/2 p-2 ">
              <img src="./images/sale02.jpg" alt="Sale 2" 
                  className="w-full h-[355px] object-cover transition-transform duration-300 ease-in-out hover:scale-105"/>
            </div>
            <div className="w-1/2 p-2 ">
              <img src="./images/sale03.jpg" alt="Sale 3" 
                  className="w-full h-[355px] object-cover transition-transform duration-300 ease-in-out hover:scale-105 "/>
            </div>
              <div className="w-full p-2 mt-1/2">
                <img src="./images/sale04.jpeg" alt="Sale 4"
                className="w-full h-auto object-cover transition-transform duration-300 ease-in-out hover:scale-105 "/>
              </div>
            </div>
          </div>
        </div>
    );
  };
  
  export default ProductGridNew;