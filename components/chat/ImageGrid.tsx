import React from 'react'

const ImageGrid = ({images}: {images: string[]}) => {
    console.log(images);
    if(images.length === 0) return null;
    if(images.length === 1) return (
        <div className='size-[200px] object-center rounded-4xl overflow-hidden'>
            <img src={images[0]} className='object-cover object-center size-full' />
        </div>
    );
    if(images.length === 2) return (
        <div className='size-[300px] flex items-center rounded-4xl overflow-hidden'>
            <div className='w-[50%] h-[100%]'>
             <img src={images[0]} className='object-cover object-center size-full' />
            </div>
            <div className='w-[50%] h-[100%'>
             <img src={images[1]} className='object-cover object-center size-full' />
            </div>
        </div>
    );
    if(images.length === 3) return (
        <div className='size-[300px] flex items-center rounded-4xl overflow-hidden'>
            <div className='w-[50%] h-[100%] object-center object-cover'>
             <img src={images[0]} className='object-cover object-center size-full' />
            </div>
            <div className="w-[50%] h-[100%]">
                <div className='w-[100%] h-[50%] object-center object-cover'>
                 <img src={images[1]} className='object-cover object-center size-full' />
                </div>
                <div className='w-[100%] h-[50%] object-center object-cover'>
                 <img src={images[2]} className='object-cover object-center size-full' />
                </div>
            </div>
        </div>
    );
  return (
    <div className='size-[300px] flex items-center rounded-4xl overflow-hidden'>
        <div className="w-[50%] h-[100%]">
            <div className='h-[50%] w-[100%] object-center object-cover'>
            <img src={images[0]} className='object-cover' />
            </div>
            <div className='h-[50%] w-[100%] object-center object-cover'>
            <img src={images[2]} className='object-cover' />
            </div>
        </div>
        <div className="w-[50%] h-[100%]">
            <div className='h-[50%] w-[100%] object-center object-cover'>
            <img src={images[2]} className='object-cover' />
            </div>
            <div className='h-[50%] w-[100%] object-center object-cover'>
            <img src={images[3]} className='object-cover' />
            </div>
        </div>
    </div> 
  )
}

export default ImageGrid