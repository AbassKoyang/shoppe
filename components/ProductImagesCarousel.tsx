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
                height: '439',
                c_fill: true,
                g_auto: true,
                q_auto: true,
                f_auto: true,
                e_sharpen: true
              }))
        })
        console.log(newImages);
        return newImages;
    }
    const newImages: string[] = getImages(images);
  return (
        <div className='w-full h-[439px]'>
        <Carousel setApi={setApi} className={`w-full`}> 
            <CarouselContent className={``}>
                {newImages.map((image) => (
                    <CarouselItem className='w-full h-[439px] bg-gray-300'>
                    <Image
                      src={image}
                       width={viewportWidth} 
                       height={439}
                       style={{ width: `${viewportWidth}px`, height: "439px" }}
                     placeholder="blur"
                     blurDataURL="/assets/images/product-fallback-image.png"
                     alt="Product image" className="rounded-[5px] overflow-hidden"/>
                    </CarouselItem>
                ))}
            </CarouselContent>
            <div className="absolute bottom-5 left-[50%] translate-x-[-50%] w-full flex items-center justify-center gap-2 mt-3 z-50">
                {newImages.map((_, idx) => (
                    <Button
                        key={idx}
                        size="icon"
                        className={`transition-all duration-100 ease-in-out hover:bg-dark-blue ${
                        current === idx ? "bg-dark-blue h-2.5 w-10 rounded-xl" : "bg-light-blue size-2.5 rounded-full"
                        }`}
                        onClick={() => scrollTo(idx)}
                    />
                 ))}
           </div>
           <button onClick={() => router.back()} className="cursor-pointer absolute top-5 left-5 flex items-center justify-center bg-[#FFEBEB] rounded-full size-[30px]">
                        <ArrowLeft className="size-[18px] text-[#B5A2A2]" />
            </button>
        </Carousel>
        </div>
  )
}

export default ProductImagesCarousel