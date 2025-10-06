'use client';

import ProductImagesCarousel from "@/components/ProductImagesCarousel";
import ProductPageSkeleton from "@/components/ProductPageSkeleton";
import { formatPrice } from "@/lib/utils";
import { useFetchSingleProduct } from "@/services/products/queries";
import { Heart, MessageCircle, MessageSquareText } from "lucide-react";
import { useParams } from "next/navigation"
import { useState, useEffect } from "react";
import { IoIosShareAlt } from "react-icons/io";

const page = () => {
  const productId = useParams<{productId: string}>().productId;
  const {isError, isLoading, data: product} = useFetchSingleProduct(productId);
  const [viewportWidth, setViewportWidth] = useState(0);
  console.log(product);

  useEffect(() => {
    setViewportWidth(window.innerWidth);
  }, []);
  const price = formatPrice(product?.price.toString() || '');
  const formatCurrency = (currency: string) => {
    if(currency == '₦ NGN') return '₦';
    if(currency == '€ EURO') return '€';
    if(currency == '$ USD') return '$';
  }
  const currency = formatCurrency(product?.currency || '')


  return (
    <section className="w-full relative bg-white">
      {isLoading && (
        <ProductPageSkeleton />
      )}
      {product && (
        <>
          <ProductImagesCarousel viewportWidth={viewportWidth} images={product?.images || []} />
      <div className="px-4 [@media(min-width:375px)]:px-6 bg-white mb-[100px]">
        <div className="w-full flex items-center justify-between my-5">
          <h4 className="text-[26px] text-black font-raleway font-extrabold">{currency}{price}</h4>
          <button className="size-[30px] flex items-center justify-center bg-[#FFEBEB] rounded-full cursor-pointer">
          <IoIosShareAlt className="size-[18px] text-[#B5A2A2]" />
          </button>
        </div>
        <div className="w-full">
          <h5 className="text-[20px] text-black font-raleway font-bold leading-[1]">{product?.title}</h5>
          <p className="text-[15px] text-black font-nunito-sans font-normal mt-1">{product?.description}</p>
        </div>
        <div className="w-full my-5">
         <h5 className="text-[20px] text-black font-raleway font-extrabold ">Specifications</h5>
        <div className="w-full flex flex-wrap justify-between items-start">
    
          <div className="w-[50%] flex flex-col items-start">
            <h6 className="text-[17px] text-black font-raleway font-bold mt-5 mb-1">Category</h6>
            <span className="text-[14px] text-black font-raleway font-medium bg-[#FFEBEB] py-0.5 px-3 rounded-[4px] mt-1">{product?.category}</span>
          </div>

          <div className="w-[50%] flex flex-col items-start">
            <h6 className="text-[17px] text-black font-raleway font-bold mt-5 mb-1">Sub Category</h6>
            <span className="text-[14px] text-black font-raleway font-medium bg-[#E5EBFC] py-0.5 px-3 rounded-[4px] mt-1">{product?.subCategory}</span>
          </div>

          <div className="w-[50%] flex flex-col items-start">
            <h6 className="text-[17px] text-black font-raleway font-bold mt-5 mb-1">Size</h6>
            <span className="text-[14px] text-black font-raleway font-medium bg-[#E5EBFC] py-0.5 px-3 rounded-[4px] mt-1">{product?.size}</span>
          </div>

          <div className="w-[50%] flex flex-col items-start">
            <h6 className="text-[17px] text-black font-raleway font-bold mt-5 mb-1">Condition</h6>
            <span className="text-[14px] text-black font-raleway font-medium bg-[#FFEBEB] py-0.5 px-3 rounded-[4px] mt-1">{product?.condition == 'new' ? 'New' : 'Used'}</span>
          </div>

          <div className="w-[50%] flex flex-col items-start">
            <h6 className="text-[17px] text-black font-raleway font-bold mt-5 mb-1">Discount</h6>
            <span className="text-[14px] text-black font-raleway font-medium bg-[#FFEBEB] py-0.5 px-3 rounded-[4px] mt-1">{product?.discount}%</span>
          </div>

          {product?.gender && (
            <div className="w-[50%] flex flex-col items-start">
              <h6 className="text-[17px] text-black font-raleway font-bold mt-5 mb-1">Gender</h6>
              <span className="text-[14px] text-black font-raleway font-medium bg-[#E5EBFC] py-0.5 px-3 rounded-[4px] mt-1">{product?.gender}</span>
            </div>
          )}

          {product?.material && (
          <div className="w-[50%] flex flex-col items-start">
            <h6 className="text-[17px] text-black font-raleway font-bold mt-5 mb-1">Material</h6>
            <div className="w-full flex flex-wrap gap-2">
            {product?.material.split(',').map((mat) => (
              <span className="text-[14px] text-black font-raleway font-medium bg-[#E5EBFC] py-0.5 px-3 rounded-[4px] mt-1">
                {mat}
              </span>
            ))}
            </div>
          </div>
          )}

          {product?.brand && (
          <div className="w-[50%] flex flex-col items-start">
            <h6 className="text-[17px] text-black font-raleway font-bold mt-5 mb-1">Brand</h6>
            <span className="text-[14px] text-black font-raleway font-medium bg-[#FFEBEB] py-0.5 px-3 rounded-[4px] mt-1">{product?.brand}</span>
          </div>
          )}

          {product?.color && (
          <div className="w-[50%] flex flex-col items-start">
            <h6 className="text-[17px] text-black font-raleway font-bold mt-5 mb-1">Color</h6>
            <span className="text-[14px] text-black font-raleway font-medium bg-[#FFEBEB] py-0.5 px-3 rounded-[4px] mt-1">{product?.color}</span>
          </div>
          )}
          
          <div className="w-[50%] flex flex-col items-start">
            <h6 className="text-[17px] text-black font-raleway font-bold mt-5 mb-1">Location</h6>
            <span className="text-[14px] text-black font-raleway font-medium bg-[#E5EBFC] py-0.5 px-3 rounded-[4px] mt-1">{product?.location}</span>
          </div>
        </div>
        </div>
      </div>
      <div className="w-[97%] fixed bottom-3 left-[50%] translate-x-[-50%] px-3 [@media(min-width:375px)]:px-3 py-3 bg-white flex items-center justify-between rounded-[40px] shadow-[0_5px_10px_0_rgba(0,0,0,0.12)]">
        <button className="w-[47px] h-[47px] rounded-full bg-[#F9F9F9] flex items-center justify-center">
          <Heart strokeWidth={1} className="text-black size-[28px]" />
        </button>
        <button className="bg-[#202020] rounded-4xl px-4 py-2 flex items-center gap-2"><MessageCircle  strokeWidth={1} className="text-white h-lh" /><span className="text-[16px] font-normal font-nunito-sans text-[#F3F3F3]">Chat Seller</span></button>
        <button className="bg-dark-blue text-white rounded-4xl px-4 py-2 font-normal font-nunito-sans text-[16px]">Buy</button>
      </div>
        </>
      )}
      {isError && (
        <div className='w-full h-dvh flex items-center justify-center'>
        <p>Oops, failed to load product.</p>
       </div>
      )}
    </section>
  )
}

export default page