import { formatPrice, formatProductCardImageUrl } from '@/lib/utils';
import { ProductType } from '@/services/products/types'
import Image from 'next/image';
import React from 'react'
import { string } from 'zod';

const JustForYouProductCard = ({product}:{product: any }) => {
  const price : string = String(product.price);

  const imageUrl = formatProductCardImageUrl(product.image, {
    width: '155',
    height: '171',
    c_fill: true,
    g_auto: true,
    q_auto: true,
    f_auto: true,
    e_sharpen: true
  })

  const formattedPrice = formatPrice(price);
  return (
        <button className='w-[165px] mt-3'>
            <div className="w-[165px] h-[181px] p-[5px] rounded-[9px] bg-white overflow-hidden shadow-[0_5px_10px_0_rgba(0,0,0,0.12)]">
                <Image
                 src={imageUrl}
                  width={155} 
                  height={171}
                  style={{ width: "155px", height: "171px" }}
                placeholder="blur"
                blurDataURL="/assets/images/product-fallback-image.png"
                alt="Product image" className="rounded-[5px] overflow-hidden"/>
            </div>
            <h5 className="text-black text-[17px] font-raleway font-bold mt-1.5 text-left">${formattedPrice}</h5>
            <h6 className="text-black text-[14px] font-raleway font-bold mt text-left">{product.title}</h6>
            <p className="text-black text-[12px] font-nunito-sans font-normal max-w-full text-left mt">Lorem ipsum dolor sit amet consectetur.</p>
            <p className="text-[9px] text-black/85 font-nunito-sans font-semibold  mt-0.5 text-left">{product.location}</p>
         </button>
  )
}

export default JustForYouProductCard