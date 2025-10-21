import { useAuth } from '@/lib/contexts/auth-context';
import { formatDescription, formatPrice, formatProductCardImageUrl, formatProductLink, formatTitle } from '@/lib/utils';
import { defaultProfileAvatar } from '@/public/assets/images/exports';
import { OrderDataType } from '@/services/payment/types';
import { removeProductFromWishlist } from '@/services/products/api';
import { ProductType } from '@/services/products/types';
import { QueryClient, useMutation } from '@tanstack/react-query';
import { Timestamp } from 'firebase/firestore';
import { LoaderCircle, Trash2 } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';
import React, { useState } from 'react'
import { toast } from 'react-toastify';

const OrderCard = ({order}:{order: OrderDataType}) => {
    const {user} = useAuth();
    const [loading, setLoading] = useState(false);
    const queryClient = new QueryClient();

    const price : string = String(order.productDetails.price);
    const imageUrl = formatProductCardImageUrl(order.productDetails.images[0], {
        width: '300',
        height: '300',
        c_fill: true,
        g_auto: true,
        q_auto: true,
        f_auto: true,
        e_sharpen: true,
        dpr_auto: true,
      })
    
      const formattedPrice = formatPrice(price, order.productDetails.currency);
    
      const title = formatTitle(order.productDetails.title);
      
      const desc = formatDescription(order.productDetails.description);
    
      const productLink = formatProductLink(order.productDetails.category, order.productDetails.subCategory, order.productDetails?.id || '');
      console.log(order.createdAt);

      const rawTs = order.createdAt ?? new Date();
    const resolvedDate = rawTs?.toDate ? rawTs.toDate() : (rawTs instanceof Date ? rawTs : new Date(rawTs));
    const orderDate = isNaN(resolvedDate?.getTime?.()) ? '' : resolvedDate.toLocaleString();

  return (
    <Link  href={productLink} className='w-full h-[110px] mt-3 flex items-start justify-between'>
           <div className="w-full h-full flex items-start gap-3">
            <div className="w-[130px] relative">
                    <div className="w-full relative h-full p-[5px] rounded-[9px] bg-white overflow-hidden shadow-[0_5px_10px_0_rgba(0,0,0,0.12)]">
                        <Image
                        src={imageUrl}
                        width={300}
                        height={300}
                        style={{ width: "120px", height: "100px" }}
                        placeholder="blur"
                        blurDataURL="/assets/images/product-fallback-image.png"
                        alt={order.productDetails.title}
                        sizes="(max-width: 768px) 100px, 150px"
                        className="rounded-[5px] object-cover"/>
                    </div>
                    <div className='absolute top-[0px] left-[0px] size-[50px] rounded-full overflow-hidden object-contain object-center border-[2px] border-white shadow-[0_5px_10px_0_rgba(0,0,0,0.12)]'>
                        <Image src={order.sellerInfo.profile.imageUrl ? order.sellerInfo.profile.imageUrl : defaultProfileAvatar} width={46} height={46}  className='' alt='Profile avatar' />
                    </div>
                </div>
                <div className="flex flex-col h-full">
                    <p className='text-[12px] text-black font-nunito-sans font-normal max-w-[150px]'>{desc}</p>
                    <div className=" h-full flex flex-col justify-end">
                        <h5 className='font-raleway font-bold text-[18px] tracking-[-0.18px] text-[#202020]'>{formattedPrice}</h5>
                        <div className='flex items-center gap-2'>
                            <span className={`text-[12px] font-raleway font-normal ${order.productDetails.status == 'sold' ? 'bg-green-500 text-white' : 'bg-amber-600 text-white'} py-0.5 px-3 rounded-2xl mt-1`}>{order.productDetails.status}</span>
                            <p className='text-[10px] font-nunito-sans font-normal'>{orderDate}</p>
                        </div>
                    </div>
                </div>
           </div>

    </Link>
)
}

export default OrderCard