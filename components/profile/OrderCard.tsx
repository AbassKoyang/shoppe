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
import ArrowRightButton from '../ArrowRightButton';

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
      
      const desc = formatDescription(order.productDetails.description, 40);
    
      const productLink = formatProductLink(order.productDetails.category, order.productDetails.subCategory, order.productDetails?.id || '');
      console.log(order.createdAt);

      const rawTs = order.createdAt ?? new Date();
    const resolvedDate = rawTs?.toDate ? rawTs.toDate() : (rawTs instanceof Date ? rawTs : new Date(rawTs));
    const orderDate = isNaN(resolvedDate?.getTime?.()) ? '' : resolvedDate.toLocaleString();
    const orderStatus = order.status ? order.status.substring(0,1).toUpperCase() +  order.status.substring(1) : '';

  return (
    <div  className='w-full h-[110px] mt-2'>
        <div className="w-full h-full flex justify-between items-center">
        <div className="h-full flex items-start gap-3 w-full">
                <Link href={productLink} className="w-[130px] relative">
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
                    <div className='absolute top-[10px] left-[10px] size-[35px] rounded-full overflow-hidden object-contain object-center border-[2px] border-white shadow-[0_5px_10px_0_rgba(0,0,0,0.12)]'>
                        <Image src={order.sellerInfo.profile.imageUrl ? order.sellerInfo.profile.imageUrl : defaultProfileAvatar} width={31} height={31}  className='' alt='Profile avatar' />
                    </div>
                </Link>
                <div className="flex flex-col justify-between h-full w-[calc(100%-130px)]">
                    <div className="w-full flex items-center justify-between">
                        <div className="">
                            <h5 className='font-raleway font-bold text-[20px] tracking-[-0.18px] text-[#202020]'>{formattedPrice}</h5>
                            <h5 className='font-raleway font-bold text-[18px] tracking-[-0.18px] text-[#202020]'>{title}</h5>
                            <p className='text-[12px] text-black font-nunito-sans font-normal max-w-[120px]'>{desc}</p>
                        </div>
                        <ArrowRightButton url={`/orders/${order.id}`} />
                    </div>
                    <div className='w-full flex items-center justify-between mb-0.5'>
                        <span className={`text-[10px] font-raleway font-normal ${order.status == 'completed' ? 'bg-green-500 text-white' : 'bg-amber-500 text-white'} py-0 px-3 rounded-2xl`}>{orderStatus}</span>
                        <p className='text-[10px] font-nunito-sans font-normal'>{orderDate.substring(0,10)}</p>
                     </div>
                </div>
           </div>
        </div>
    </div>
)
}

export default OrderCard