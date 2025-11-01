import { formatPrice, formatProductLink, formatTitle } from '@/lib/utils';
import { ProductType } from '@/services/products/types'
import React from 'react'
import ArrowRightButton from '../ArrowRightButton';

const ChatProductCard = ({product}: {product: ProductType}) => {
const price : string = String(product.price);

const formattedPrice = formatPrice(price, product.currency || '');

const title = formatTitle(product.title);
    
const productLink = formatProductLink(product.category, product.subCategory, product.id || '');

  return (
    <div className='w-[70%] p-1.5 rounded-[6px] bg-white absolute bottom-[-98%] left-[50%] translate-x-[-50%] shadow-[0_5px_10px_0_rgba(0,0,0,0.12)] flex items-center justify-between'>
        <div className='flex items-center gap-3'>
            <div className="size-[50px] rounded-[3px] overflow-hidden">
                <img className='size-full object-center object-cover' src={product.images[0]} alt="Product Image" />
            </div>
            <div className="">
                <p className='font-nunito-sans text-[14px] font-medium text-[#202020] m-0'>{title}</p>
                <p className='font-raleway text-[20px] font-semibold text-dark-blue m-0'>{formattedPrice}</p>
            </div>
        </div>
        <ArrowRightButton url={productLink} />
    </div>
  )
}

export default ChatProductCard