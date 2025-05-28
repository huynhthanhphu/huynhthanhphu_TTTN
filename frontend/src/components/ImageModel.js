import React from 'react';

const ImageWithText = ({ imageUrl, text, altText }) => (
  <div className="relative h-[700px] w-full  overflow-hidden flex items-center justify-center">
    <img 
      src={imageUrl} 
      alt={altText}
      className="h-[700px]  w-full overflow-hiddenobject-contain object-center transition-all duration-300 ease-in-out hover:brightness-75"/>
    <p className="absolute bottom-0 left-0 right-0 bg-opacity-75 py-2 text-center text-white text-2sm font-bold">
      {text}
    </p>
  </div>
);

const ImageModel = () => {
  return (
    <div className="container mx-auto px-4 my-1">
      <div className="flex flex-wrap -mx-4">
        {/* CHUPAPI MUSE Column */}
        <div className="h-[700px] w-full md:w-1/2 px-4 md:mb-0 my-4">
          <ImageWithText 
            imageUrl="/images/bijimuse.jpg" 
            text="CHUPAPI MUSE" 
            altText="bijimuse"/>
        </div>

        {/* CHUPAPI X MODEL Column */}
        <div className=" h-[700px] w-full md:w-1/2 px-4 my-4">
          <ImageWithText 
            imageUrl="/images/bijimodel.jpg" 
            text="CHUPAPI X MODEL" 
            altText="bijimodel"/>
        </div>
      </div>
    </div>
  );
};

export default ImageModel;