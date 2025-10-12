import { formatDescription, formatPrice, formatProductCardImageUrl, formatProductLink, formatTitle } from '@/lib/utils';
import { ProductType } from '@/services/products/types'
import { MapPin, TicketPercent } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';
import React from 'react'
import { string } from 'zod';

const RecentlyViewedProductCard = ({product}:{product: any }) => {
  const price : string = String(product.price);

  const imageUrl = formatProductCardImageUrl(product.image || product.images[0], {
    width: '300',
    height: '342',
    c_fill: true,
    g_auto: true,
    q_auto: true,
    f_auto: true,
    e_sharpen: true,
    dpr_auto: true,
  })

  const formattedPrice = formatPrice(price, product.currency || '');

  const title = formatTitle(product.title);
  
  const desc = formatDescription(product.description);

  const productLink = formatProductLink(product.category, product.subCategory, product.objectID || product.id)

  return (
        <Link href={productLink} className='w-[160px] mt-3'>
            <div className="w-full relative h-[181px] p-[5px] rounded-[9px] bg-white overflow-hidden shadow-[0_5px_10px_0_rgba(0,0,0,0.12)] z-10">
                <Image
                  src={imageUrl}
                  width={300}
                  height={300}
                  style={{ width: "150px", height: "171px" }}
                placeholder="blur"
                blurDataURL="/assets/images/product-fallback-image.png"
                alt={product.title}
                 sizes="(max-width: 768px) 100px, 150px"
                  className="rounded-[5px] object-cover z-10"/>
            </div>
            <h5 className="text-black text-[17px] font-raleway font-bold mt-1.5 text-left">${formattedPrice}</h5>
            <h6 className="text-black text-[14px] font-raleway font-bold mt text-left">{title}</h6>
            <p className="text-black text-[12px] font-nunito-sans font-normal max-w-full text-left mt">{desc}</p>
         </Link>
  )
}

export default RecentlyViewedProductCard;