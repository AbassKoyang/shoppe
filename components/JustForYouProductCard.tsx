import { ProductType } from '@/services/products/types'
import React from 'react'
import { string } from 'zod';

const JustForYouProductCard = ({product}:{product: any }) => {
  const price : string = String(product.price);
  const formatPrice = (price: string) => {
    if (price.length > 3 && price.length < 5){
      return price.substring(0, 1) + ',' + price.substring(1)
    }
    if (price.length > 4 && price.length < 6){
      return price.substring(0, 2) + ',' + price.substring(2)
    }
    if (price.length > 5 && price.length < 7){
      return price.substring(0, 3) + ',' + price.substring(3)
    }
    if (price.length > 6 && price.length < 8){
      return price.substring(0, 1) + ',' + price.substring(1,4) + ',' + price.substring(4)
    }
    return price;
  }
  const formattedPrice = formatPrice(price);
  return (
        <button className='col-span-1 row-span-1 mb-1'>
            <div className="w-full h-[171px] p-1.5 rounded-[9px] bg-white object-contain object-center overflow-hidden shadow-[0_5px_10px_0_rgba(0,0,0,0.12)]">
                <img src={product.image} alt="Product image" className="size-full rounded-[5px]"/>
            </div>
            <h5 className="text-black text-[17px] font-raleway font-bold mt-1.5 text-left">${formattedPrice}</h5>
            <h6 className="text-black text-[14px] font-raleway font-bold mt text-left">{product.title}</h6>
            <p className="text-black text-[12px] font-nunito-sans font-normal max-w-full text-left mt">Lorem ipsum dolor sit amet consectetur.</p>
            <p className="text-[9px] text-black/85 font-nunito-sans font-semibold  mt-0.5 text-left">{product.location}</p>
         </button>
  )
}

export default JustForYouProductCard