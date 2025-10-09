'use client';
import { useEffect, useRef, useState } from 'react';
import {
    Carousel,
    CarouselApi,
    CarouselContent,
    CarouselItem,
  } from "@/components/ui/carousel";
import Autoplay from 'embla-carousel-autoplay';
import { Button } from './ui/button';
import { formatProductCardImageUrl } from '@/lib/utils';
import Image from 'next/image';
import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';
import { useRouter } from 'next/navigation';

const ProductImagesCarousel = ({viewportWidth, images}: {viewportWidth: number; images: string[]}) => {
    const [api, setApi] = useState<CarouselApi>();
    const [current, setCurrent] = useState(0);
    const [count, setCount] = useState(0);
    const router = useRouter();

    const plugin = useRef(
        Autoplay({ delay: 5000, stopOnInteraction: true })
    );
    
  
    useEffect(() => {
      if (!api) return;
      const snaps = api.scrollSnapList().length;
      setCount(snaps);
      setCurrent(api.selectedScrollSnap());
  
      api.on("select", () => {
        setCurrent(api.selectedScrollSnap());
      });
    }, [api]);
  
    const scrollTo = (index: number) => {
      api?.scrollTo(index);
    };


    const getImages = (images: string[]) : string[] => {
        const newImages: string[] = []
        images.map((image) => {
            newImages.push(formatProductCardImageUrl(image, {
                width: `${viewportWidth}`,
                ar_: '3:4',
                c_fill: true,
                g_auto: true,
                q_auto: true,
                f_auto: true,
                e_sharpen: true,
                dpr_auto: true,
              }))
        })
        console.log(newImages);
        return newImages;
    }
    const newImages: string[] = getImages(images);
  return (
        <div className='w-full h-[439px] aspect-[3/4] rounded-b-2xl overflow-hidden'>
        <Carousel setApi={setApi} className={`w-full h-full rounded-b-2xl`}> 
            <CarouselContent className={`rounded-b-2xl h-full`}>
                {newImages.map((image) => (
                    <CarouselItem key={image} className='w-full h-[439px] aspect-[3/4] rounded-b-2xl relative'>
                    <Image
                      src={image}
                      fill
                      sizes='100vw'
                     placeholder="blur"
                     blurDataURL="/assets/images/product-fallback-image.png"
                     alt="Product image" className="rounded-[5px] object-cover"/>
                    </CarouselItem>
                ))}
            </CarouselContent>
           {newImages.length > 1  && (
             <div className="absolute bottom-5 left-[50%] translate-x-[-50%] w-full flex items-center justify-center gap-2 mt-3 z-50">
             {newImages.map((_, idx) => (
                 <Button
                     key={idx}
                     size="icon"
                     className={`transition-all duration-100 ease-in-out hover:bg-dark-blue ${
                     current === idx ? "bg-dark-blue h-2.5 w-10 rounded-xl" : "bg-dark-blue opacity-20 size-2.5 rounded-full"
                     }`}
                     onClick={() => scrollTo(idx)}
                 />
              ))}
        </div>
           )}
           <button onClick={() => router.back()} className="cursor-pointer absolute top-3 left-3 flex items-center justify-center bg-[#FFEBEB] rounded-full size-[43px]">
                        <ArrowLeft className="size-[22px] text-[#202020]" />
            </button>
        </Carousel>
        </div>
  )
}

export default ProductImagesCarousel