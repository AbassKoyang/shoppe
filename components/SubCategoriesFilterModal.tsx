'use client'
import { Check, LoaderCircle, X } from 'lucide-react'
import React, { useEffect, useState } from 'react'
import {motion} from'framer-motion';
import { Input } from './ui/input';
import z from 'zod';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import {Form,  FormControl, FormMessage, FormField, FormItem, FormLabel, FormDescription } from './ui/form';
import { Select, SelectContent, SelectGroup, SelectItem, SelectLabel, SelectTrigger, SelectValue } from './ui/select';
import { ALPHA_SIZES, CATEGORIES, NUMERIC_SIZES, SUB_CATEGORIES } from '@/lib/utils/index';
import PrimaryButton from './PrimaryButton';
import { BsCheck } from 'react-icons/bs';
import { useRouter, useSearchParams } from 'next/navigation';
import { searchFilterSChema } from '@/services/products/schema';
import CategoryAvatarButton from './CategoryAvatarButton';
import { CategoryType } from '@/services/products/types';


const SubCategoriesFilterModal = ({open, closeModal}:{open: boolean; closeModal: () => void}) => {
    const [loading, setLoading] = useState(false);
    const [selectedSizes, setSelectedSizes] = useState(['M']);
    const [selectedCategories, setSelectedCategories] = useState<CategoryType[]>(['Tops']);
    const [selectedSizeType, setSelectedSizeType] = useState<'Alpha' | 'Numeric' | 'One Size'>('Alpha');
    const [order, setOrder] = useState<'Popular' | 'Oldest' | 'Newest' | 'PriceHighToLow' | 'PriceLowToHigh'>('Popular');
    const searchParams = useSearchParams();
    const router = useRouter();

    const form = useForm<z.infer<typeof searchFilterSChema>>({
        resolver: zodResolver(searchFilterSChema),
        defaultValues: {
        },
    });

    useEffect(() => {
        form.setValue('size', selectedSizes, {shouldDirty: true});
    }, [selectedSizes]);

    useEffect(() => {
        form.setValue('order', order, {shouldDirty: true});
    }, [order]);
    

    const isDirty = form.formState.isDirty;

    
    const OnSubmit = (data: z.infer<typeof searchFilterSChema>) => {
        const params = new URLSearchParams(searchParams.toString());

  // Update all fields
        if (data.location) params.set("location", data.location);
        if (data.currency) params.set("currency", data.currency);
        if (data.minPrice) params.set("minPrice", data.minPrice);
        if (data.maxPrice) params.set("maxPrice", data.maxPrice);
        if (data.discountPercentage) params.set("discount", data.discountPercentage);
        if (data.gender) params.set("gender", data.gender);
        if (data.condition) params.set("condition", data.condition);
        if (data.order) params.set("order", data.order);

        // Sizes → store as comma-separated string
        if (data.size?.length) {
            params.set("size", data.size.join(","));
        } else {
            params.delete("size");
        }
        router.replace(`?${params.toString()}`);
        closeModal();
        form.reset();
        console.log(data, `?${params.toString()}`);
    }

    const handleSetSize = (size: string) => {
        if (selectedSizes.includes(size)) {
            const ss = [...selectedSizes];
            const sizeindex = ss.findIndex((s, index) => size === s);
            ss.splice(sizeindex, 1)
            setSelectedSizes(ss);
        } else { 
            setSelectedSizes((prev) => [...prev, size]) 
        }
    }

    return (
        <motion.section
        initial={{x: 0}}
        animate={{x:open ? '0%' : '100%'}}
        transition={{ duration: 0.3, ease: 'easeInOut' }}
        className='w-[100vw] h-dvh fixed top-0 left-0 z-40 flex items-start justify-end'>
            <div onClick={closeModal} className="size-full z-10 absolute top-0 left-0 bg-[#E9E9E9] opacity-75"></div>
            <div className="w-[95%] h-full bg-white z-20 pl-2 [@media(min-width:375px)]:pl-4 pr-2 [@media(min-width:375px)]:pr-4">
                <div className="w-full flex items-center justify-between mt-6 mb-5">
                    <h2 className='font-bold font-raleway text-[26px] text-[#202020] mt-0 leading-0'>Filter</h2>
                    <button onClick={closeModal} className='flex items-center justify-center cursor-pointer'><X strokeWidth={2} className='size-[23px] text-black' /></button>
                </div>
                <div className="w-full h-[90%] overflow-y-scroll scrollbar-hide">
                    <Form {...form}>
                    <form onSubmit={form.handleSubmit((data) => {
      console.log("✅ SUBMIT CALLED with data:", data);
      OnSubmit(data);
    },
    (errors) => {
      console.log("❌ FORM ERRORS:", errors);
      console.log(form.watch())
    })}>
                               
                         <FormField
                            control={form.control}
                            name='location'
                            render={({field}) => (
                                <FormItem className='mb-5'>
                                <FormLabel className='text-black text-lg font-extrabold mt-2 mb-1 leading-0 font-nunito-sans'>Location</FormLabel>
                                <FormControl>
                                    <Input className='w-full h-12 px-2 py-3 bg-[#F1F4FE] rounded-md placeholder:text-[#9EB4E8] text-black/80 focus:border-dark-blue transition-all duration-300 ease-in-out]' {...field} placeholder='e.g Ajah, Lekki, Lagos' />
                                </FormControl>
                                <FormMessage />
                                </FormItem>
                            )}
                        />

                         <FormField
                        control={form.control}
                        name='currency'
                        render={({field}) => (
                            <FormItem className='mb-5'>
                            <FormLabel className='text-black text-lg font-extrabold mb-1 leading-0 font-nunito-sans'>Currency</FormLabel>
                            <FormControl>
                            <Select onValueChange={field.onChange} value={field.value}>
                                <SelectTrigger className="w-full bg-[#F1F4FE] border focus:border-dark-blue stroke-0 transition-all duration-300 ease-in-out">
                                <SelectValue placeholder="Filter currency" />
                                </SelectTrigger>
                                <SelectContent className='w-full'>
                                <SelectGroup className='w-full'>
                                    <SelectLabel>Currencies</SelectLabel>
                                    <SelectItem value='₦ NGN'>₦ NGN</SelectItem>
                                    <SelectItem value='$ USD'>$ USD</SelectItem>
                                    <SelectItem value='€ EURO'>€ EURO</SelectItem>
                                </SelectGroup>
                                </SelectContent>
                            </Select>
                            </FormControl>
                            <FormMessage />
                            </FormItem>
                        )}
                        />
                         <FormField
                            control={form.control}
                            name='minPrice'
                            render={({field}) => (
                                <FormItem className='mb-5'>
                                <FormLabel className='text-black text-lg font-extrabold mb-1 leading-0 font-nunito-sans'>Min Price</FormLabel>
                                <FormControl>
                                    <Input type='number' className='w-full h-12 px-2 py-3 bg-[#F1F4FE] rounded-md placeholder:text-[#9EB4E8] text-black/80 focus:border-dark-blue transition-all duration-300 ease-in-out]' {...field} placeholder='E.g 7000' />
                                </FormControl>
                                <FormMessage />
                                </FormItem>
                            )}
                        />

                         <FormField
                            control={form.control}
                            name='maxPrice'
                            render={({field}) => (
                                <FormItem className='mb-5'>
                                <FormLabel className='text-black text-lg font-extrabold mb-1 leading-0 font-nunito-sans'>Max Price</FormLabel>
                                <FormControl>
                                    <Input type='number' className='w-full h-12 px-2 py-3 bg-[#F1F4FE] rounded-md placeholder:text-[#9EB4E8] text-black/80 focus:border-dark-blue transition-all duration-300 ease-in-out]' {...field} placeholder='E.g 7000' />
                                </FormControl>
                                <FormMessage />
                                </FormItem>
                            )}
                        />
                        
                        <FormField
                        control={form.control}
                        name='condition'
                        render={({field}) => (
                            <FormItem className='mb-6'>
                            <FormLabel className='text-black text-lg font-extrabold mb-1 leading-0 font-nunito-sans'>Product Condition</FormLabel>
                            <FormControl>
                            <Select onValueChange={field.onChange}>
                                <SelectTrigger className="w-full bg-[#F1F4FE] border focus:border-dark-blue stroke-0 transition-all duration-300 ease-in-out">
                                <SelectValue placeholder="Filter product condition" />
                                </SelectTrigger>
                                <SelectContent className='w-full'>
                                <SelectGroup className='w-full'>
                                    <SelectLabel>Conditions</SelectLabel> 
                                    <SelectItem value='used'>Used</SelectItem>
                                    <SelectItem value='new'>New</SelectItem>
                                </SelectGroup>
                                </SelectContent>
                            </Select>
                            </FormControl>
                            <FormMessage />
                            </FormItem>
                        )}
                        />

                    <FormField
                    control={form.control}
                    name='discountPercentage'
                    render={({field}) => (
                        <FormItem className='mb-5'>
                            <FormLabel className='text-black text-lg font-extrabold mb-1 leading-0 font-nunito-sans'>Discount Percentage</FormLabel>
                            <FormControl>
                            <Select onValueChange={field.onChange}>
                              <SelectTrigger className="w-full bg-[#F1F4FE] border focus:border-dark-blue stroke-0 transition-all duration-300 ease-in-out">
                                <SelectValue placeholder="Filter discount percentage" />
                              </SelectTrigger>
                              <SelectContent>
                              <SelectGroup>
                                <SelectLabel>Discounts</SelectLabel>
                                <SelectItem value='50'>50% or more</SelectItem>
                                <SelectItem value='40'>40% or more</SelectItem>
                                <SelectItem value='30'>30% or more</SelectItem>
                                <SelectItem value='20'>20% or more</SelectItem>
                                <SelectItem value='10'>10% or more</SelectItem>
                                <SelectItem value='0'>5% or more</SelectItem>
                              </SelectGroup>
                              </SelectContent>
                            </Select>
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )}
                    />

                    <FormField
                    control={form.control}
                    name='size'
                    render={({field}) => (
                        <FormItem className='w-full mb-6'>
                            <div className="w-full flex items-center justify-between mb-1">
                                <FormLabel className='text-black text-lg font-extrabold mb-1 leading-0 font-nunito-sans'>Size</FormLabel>
                                <div className="flex items-center gap-1">
                                    <button type='button' onClick={() => setSelectedSizeType('Alpha')} className={`${selectedSizeType === 'Alpha' ? 'bg-light-blue border border-dark-blue text-dark-blue' : 'bg-[#FFEBEB] border  text-black'} px-3 py-0.5 rounded-[4px] font-raleway font-medium text-[13px] transition-all duration-200 ease-in-out cursor-pointer`}>Clothes</button>
                                    <button type='button' onClick={() => setSelectedSizeType('Numeric')} className={`${selectedSizeType === 'Numeric' ? 'bg-light-blue border border-dark-blue text-dark-blue' : 'bg-[#FFEBEB] border  text-black'} px-3 py-0.5 rounded-[4px] font-raleway font-medium text-[13px] transition-all duration-200 ease-in-out cursor-pointer`}>Shoes</button>
                                </div>
                            </div>
                            <FormControl className='w-full'>
                                <div className="w-full h-[54px] flex items-center overflow-x-auto scrollbar-hide gap-6 px-4 justify-between relative">
                                    {/* <div className="h-[54px] flex items-center gap-6 px-4 w-max justify-between relative"> */}
                                        <div className={`${selectedSizeType === 'Numeric' ? 'w-[1700px]' : 'w-full'} z-10 h-[26px] rounded-[20px] bg-light-blue absolute top-[50%] left-0 translate-y-[-50%]`}></div>
                                        
                                        {selectedSizeType === 'Alpha' && ALPHA_SIZES.map((size) => (
                                            <button onClick={() => handleSetSize(size)} type='button' key={size} className={`${selectedSizes.includes(size) ? 'bg-white border-2 border-light-blue shadow-[0_5px_10px_0_rgba(0,0,0,0.16)] text-dark-blue text-[15px] size-[40px]' : 'size-[10px] text-[#AAC3FF] text-[13px]'} z-20 rounded-full flex items-center justify-center font-raleway font-extrabold cursor-pointer transition-all duration-300 ease-in-out`}>
                                            <p className=''>{size}</p>
                                            </button>
                                        ))}
                                        {selectedSizeType === 'Numeric' && NUMERIC_SIZES.map((size) => (
                                            <button onClick={() => handleSetSize(size)} type='button' key={size} className={`${selectedSizes.includes(size) ? 'bg-white border-2 border-light-blue shadow-[0_5px_10px_0_rgba(0,0,0,0.16)] text-dark-blue text-[15px] size-[40px]' : 'size-[10px] text-[#AAC3FF] text-[13px]'} z-20 rounded-full flex items-center justify-center font-raleway font-extrabold cursor-pointer transition-all duration-300 ease-in-out`}>
                                            <p className=''>{size}</p>
                                            </button>
                                        ))}
                                    {/* </div> */}
                                </div>
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )}
                    />  

                    <FormField
                    control={form.control}
                    name='order'
                    render={({field}) => (
                        <FormItem className='w-full mb-6'>
                                <FormLabel className='text-black text-lg font-extrabold mb-2 leading-0 font-nunito-sans'>Order</FormLabel>
                            <FormControl className='w-full'>
                                <div className="w-full flex items-center justify-start gap-3 flex-wrap">
                                <button type='button' onClick={() => setOrder('Popular')} className={`${order === 'Popular' ? 'justify-end gap-3' : 'justify-center'} cursor-pointer items-center min-w-[122px] p-1 flex  bg-[#E5EBFC] rounded-[18px]`}>
                                    <p className={`${order === 'Popular' ? 'font-bold text-dark-blue' : ' font-medium text-black'} font-raleway text-[15px]`}>Popular</p>
                                    <div className={`${order === 'Popular' ? 'size-[22px] border-2' : 'size-0 border-0'} flex  border-white items-center justify-center bg-dark-blue rounded-full transition-all duration-300 ease-in-out origin-center`}>
                                        <BsCheck className="text-white" />
                                    </div>
                                </button>
                                <button type='button' onClick={() => setOrder('Newest')} className={`${order === 'Newest' ? 'justify-end gap-3' : 'justify-center'} cursor-pointer items-center min-w-[122px] p-1 flex  bg-[#E5EBFC] rounded-[18px]`}>
                                    <p className={`${order === 'Newest' ? 'font-bold text-dark-blue' : ' font-medium text-black'} font-raleway text-[15px]`}>Newest</p>
                                    <div className={`${order === 'Newest' ? 'size-[22px] border-2' : 'size-0 border-0'} flex  border-white items-center justify-center bg-dark-blue rounded-full transition-all duration-300 ease-in-out origin-center`}>
                                        <BsCheck className="text-white" />
                                    </div>
                                </button>
                                <button type='button' onClick={() => setOrder('Oldest')} className={`${order === 'Oldest' ? 'justify-end gap-3' : 'justify-center'} cursor-pointer items-center min-w-[122px] p-1 flex  bg-[#E5EBFC] rounded-[18px]`}>
                                    <p className={`${order === 'Oldest' ? 'font-bold text-dark-blue' : ' font-medium text-black'} font-raleway text-[15px]`}>Oldest</p>
                                    <div className={`${order === 'Oldest' ? 'size-[22px] border-2' : 'size-0 border-0'} flex  border-white items-center justify-center bg-dark-blue rounded-full transition-all duration-300 ease-in-out origin-center`}>
                                        <BsCheck className="text-white" />
                                    </div>
                                </button>
                                <button type='button' onClick={() => setOrder('PriceHighToLow')} className={`${order === 'PriceHighToLow' ? 'justify-end gap-3' : 'justify-center'} cursor-pointer items-center min-w-[180px] p-1 flex  bg-[#E5EBFC] rounded-[18px]`}>
                                    <p className={`${order === 'PriceHighToLow' ? 'font-bold text-dark-blue' : ' font-medium text-black'} font-raleway text-[15px]`}>Price High To Low</p>
                                    <div className={`${order === 'PriceHighToLow' ? 'size-[22px] border-2' : 'size-0 border-0'} flex  border-white items-center justify-center bg-dark-blue rounded-full transition-all duration-300 ease-in-out origin-center`}>
                                        <BsCheck className="text-white" />
                                    </div>
                                </button>
                                <button type='button' onClick={() => setOrder('PriceLowToHigh')} className={`${order === 'PriceLowToHigh' ? 'justify-end gap-3' : 'justify-center'} cursor-pointer items-center min-w-[180px] p-1 flex  bg-[#E5EBFC] rounded-[18px]`}>
                                    <p className={`${order === 'PriceLowToHigh' ? 'font-bold text-dark-blue' : ' font-medium text-black'} font-raleway text-[15px]`}>Price Low To High</p>
                                    <div className={`${order === 'PriceLowToHigh' ? 'size-[22px] border-2' : 'size-0 border-0'} flex  border-white items-center justify-center bg-dark-blue rounded-full transition-all duration-300 ease-in-out origin-center`}>
                                        <BsCheck className="text-white" />
                                    </div>
                                </button>
                                
                                </div>
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )}
                    />

                    
                    <div className="w-full flex items-center justify-between gap-2 mt-6 mb-6">
                        <button type='button' disabled={loading || !isDirty} className="w-[150px] cursor-pointer bg-transparent hover:opacity-90 transition-all duration-200 ease-in-out text-[#F3F3F3] text-[22px] font-extralight flex items-center justify-center rounded-xl py-[3px] border-2 border-dark-blue disabled:opacity-70 disabled:cursor-not-allowed"  onClick={() => {
                            form.reset(); 
                            setOrder('Popular'); 
                            setSelectedSizes(['M']);
                            }}>
                                {loading ? <LoaderCircle className='animate-spin' /> : <p className='text-dark-blue'>Clear</p>}
                            </button>
                        <PrimaryButton disabled={loading || !isDirty} text={loading ? <LoaderCircle className='animate-spin' /> : 'Apply'} type="submit" additionalStyles="px-0 py-[5px] w-[70%]" />
                    </div>
                    </form>
                </Form>
                </div>
            </div>
        </motion.section>
      )
}

export default SubCategoriesFilterModal