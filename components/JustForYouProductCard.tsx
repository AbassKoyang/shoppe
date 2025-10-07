import { formatPrice, formatProductCardImageUrl } from '@/lib/utils';
import { ProductType } from '@/services/products/types'
import { MapPin, TicketPercent } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';
import React from 'react'
import { string } from 'zod';

const JustForYouProductCard = ({product}:{product: any }) => {
  const price : string = String(product.price);

  const imageUrl = formatProductCardImageUrl(product.image, {
    width: '300',
    height: '300',
    c_fill: true,
    g_auto: true,
    q_auto: true,
    f_auto: true,
    e_sharpen: true,
    dpr_auto: true,
  })

  const formattedPrice = formatPrice(price);
  const formatTitle = (title: string) => {
     const newTitle = title.substring(0, 18);
     if (title.length > 18 ) return newTitle + '...'
     return title;
  }
  const title = formatTitle(product.title);
  const formatDescription = (desc: string) => {
     const newDesc = desc.substring(0, 38);
     if (desc.length > 38 ) return newDesc + '...'
     return desc;
  }
  const desc = formatDescription(product.description);
  const formatProductLink = (category: string, subCategory: string, id: string) => {
    const formattedCategory = category.toLowerCase().split(' ').join('-');
    const formattedsubCategory = subCategory.toLowerCase().split(' ').join('-');
    return `/${formattedCategory}/${formattedsubCategory}/${id}`
  }
  const productLink = formatProductLink(product.category, product.subCategory, product.objectID)
  return (
        <Link href={productLink} className='w-[160px] mt-3'>
            <div className="w-full relative h-[160px] aspect-square p-[5px] rounded-[9px] bg-white overflow-hidden shadow-[0_5px_10px_0_rgba(0,0,0,0.12)]">
                <Image
                  src={imageUrl}
                  width={300}
                  height={300}
                  style={{ width: "150px", height: "150px" }}
                placeholder="blur"
                blurDataURL="/assets/images/product-fallback-image.png"
                alt={product.title}
                 sizes="(max-width: 768px) 100px, 150px"
                  className="rounded-[5px] object-cover"/>
            </div>
            <h5 className="text-black text-[17px] font-raleway font-bold mt-1.5 text-left">${formattedPrice}</h5>
            <h6 className="text-black text-[14px] font-raleway font-bold mt text-left">{title}</h6>
            <p className="text-black text-[12px] font-nunito-sans font-normal max-w-full text-left mt">{desc}</p>
            <div className="w-full max-w-full flex items-center justify-between mt-1">
              <div className="flex items-center gap-1">
              <MapPin className='text-black/85 size-[10px]' />
              <p className="text-[9px] text-black/85 font-nunito-sans font-semibold text-left max-w-fit">{product.location}</p>
              </div>
              <span className='text-black/85 text-[12px]'>-{product.discount}%</span>
            </div>
         </Link>
  )
}

export default JustForYouProductCard