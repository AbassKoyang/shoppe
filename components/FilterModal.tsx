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
import { ALPHA_SIZES, NUMERIC_SIZES } from '@/lib/utils';
import PrimaryButton from './PrimaryButton';
import { BsCheck } from 'react-icons/bs';

const filterSChema = z.object({
    location: z.string(),
    currency: z.union([z.literal("$ USD"), z.literal("€ EURO"), z.literal("₦ NGN")]),
    minPrice: z.string(),
    maxPrice: z.string(),
    discountPercentage: z.string(),
    size: z.union([
        z.literal(["One Size", "XS", "S", "M", "L", "XL", "XXL"]), // alpha + one size
        z.string().regex(/^\d+$/, "Numeric size must be digits only"), // numeric like 28, 30, 42...
      ]).array(),
    gender: z.literal(["Men", "Women", "Unisex"]),
    condition: z.literal(["new", "used"]),
    order: z.literal(["Popular", "Newest", "Oldest"]),
})

const FilterModal = ({open, closeModal}:{open: boolean; closeModal: () => void}) => {
    const [loading, setLoading] = useState(false);
    const [selectedSizes, setSelectedSizes] = useState(['M']);
    const [selectedSizeType, setSelectedSizeType] = useState<'Alpha' | 'Numeric' | 'One Size'>('Alpha');
    const [order, setOrder] = useState<'Popular' | 'Oldest' | 'Newest'>('Popular');
    const form = useForm<z.infer<typeof filterSChema>>({
        resolver: zodResolver(filterSChema),
        defaultValues: {
            location: '',
            currency: '₦ NGN',
            minPrice: '',
            maxPrice: '',
            discountPercentage: '',
            gender: 'Men',
            condition: 'new',
            size: selectedSizes,
            order: order,
        },
    });

    useEffect(() => {
        form.setValue('size', selectedSizes, {shouldDirty: true});
    }, [selectedSizes]);

    useEffect(() => {
        form.setValue('order', order, {shouldDirty: true});
    }, [order]);
    

    const isDirty = form.formState.isDirty;
    const OnSubmit = (data: z.infer<typeof filterSChema>) => {
        console.log(data);
    }
    return (
        <motion.section
        initial={{x: 0}}
        animate={{x:open ? '0%' : '100%'}}
        transition={{ duration: 0.3, ease: 'easeInOut' }}
        className='w-[100vw] h-dvh fixed top-0 left-0 z-40 flex items-start justify-end'>
            <div className="size-full z-10 absolute top-0 left-0 bg-[#E9E9E9] opacity-75"></div>
            <div className="w-[90%] h-full bg-white z-20 pl-4 [@media(min-width:375px)]:pl-6 pr-2 [@media(min-width:375px)]:pr-4">
                <div className="w-full flex items-center justify-between mt-6 mb-5">
                    <h2 className='font-bold font-raleway text-[26px] text-[#202020] mt-0 leading-0'>Filter</h2>
                    <button onClick={closeModal} className='flex items-center justify-center cursor-pointer'><X strokeWidth={2} className='size-[23px] text-black' /></button>
                </div>
                <div className="w-full h-[90%] overflow-y-scroll scrollbar-hide">
                    <Form {...form}>
                    <form onSubmit={form.handleSubmit(OnSubmit)}>
                         <FormField
                            control={form.control}
                            name='location'
                            render={({field}) => (
                                <FormItem className='mb-5'>
                                <FormLabel className='text-lg text-black/90 font-semibold mt-2 mb-1 leading-0 font-nunito-sans'>Location</FormLabel>
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
                            <FormLabel className='text-lg text-black/90 font-semibold mb-1 leading-0 font-nunito-sans'>Currency</FormLabel>
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
                                <FormLabel className='text-lg text-black/90 font-semibold mb-1 leading-0 font-nunito-sans'>Min Price</FormLabel>
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
                                <FormLabel className='text-lg text-black/90 font-semibold mb-1 leading-0 font-nunito-sans'>Max Price</FormLabel>
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
                            <FormLabel className='text-lg text-black/90 font-semibold mb-1 leading-0 font-nunito-sans'>Product Condition</FormLabel>
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
                    name='size'
                    render={({field}) => (
                        <FormItem className='w-full mb-6'>
                            <div className="w-full flex items-center justify-between mb-1">
                                <FormLabel className='text-lg text-black/90 font-semibold mb-1 leading-0 font-nunito-sans'>Size</FormLabel>
                                <div className="flex items-center gap-1">
                                    <button type='button' onClick={() => setSelectedSizeType('Alpha')} className={`${selectedSizeType === 'Alpha' ? 'bg-light-blue border border-dark-blue text-dark-blue' : 'bg-[#FFEBEB] border  text-black'} px-3 py-0.5 rounded-[4px] font-raleway font-medium text-[13px] transition-all duration-200 ease-in-out cursor-pointer`}>Clothes</button>
                                    <button type='button' onClick={() => setSelectedSizeType('Numeric')} className={`${selectedSizeType === 'Numeric' ? 'bg-light-blue border border-dark-blue text-dark-blue' : 'bg-[#FFEBEB] border  text-black'} px-3 py-0.5 rounded-[4px] font-raleway font-medium text-[13px] transition-all duration-200 ease-in-out cursor-pointer`}>Shoes</button>
                                </div>
                            </div>
                            <FormControl className='w-full'>
                                <div className="w-full h-[54px] flex items-center justify-center overflow-x-auto scrollbar-hide">
                                    <div className="h-[54px] flex items-center gap-8 px-4 w-max justify-between relative">
                                        <div className="z-10 w-full h-[26px] rounded-[20px] bg-light-blue absolute top-[50%] left-0 translate-y-[-50%]"></div>
                                        
                                        {selectedSizeType === 'Alpha' && ALPHA_SIZES.map((size) => (
                                            <button onClick={() => {
                                                if (selectedSizes.includes(size)) {
                                                    const ss = [...selectedSizes];
                                                    const sizeindex = ss.findIndex((s, index) => size === s);
                                                    ss.splice(sizeindex, 1)
                                                    setSelectedSizes(ss);
                                                } else { 
                                                    setSelectedSizes((prev) => [...prev, size]) 
                                                }
                                            }} type='button' key={size} className={`${selectedSizes.includes(size) ? 'bg-white border-2 border-light-blue shadow-[0_5px_10px_0_rgba(0,0,0,0.16)] text-dark-blue text-[15px] size-[40px]' : 'size-[10px] text-[#AAC3FF] text-[13px]'} z-20 rounded-full flex items-center justify-center font-raleway font-extrabold cursor-pointer transition-all duration-300 ease-in-out`}>
                                            <p className=''>{size}</p>
                                            </button>
                                        ))}
                                        {selectedSizeType === 'Numeric' && NUMERIC_SIZES.map((size) => (
                                            <button onClick={() => {
                                                if (selectedSizes.includes(size)) {
                                                    const ss = [...selectedSizes];
                                                    const sizeindex = ss.findIndex((s, index) => size === s);
                                                    ss.splice(sizeindex, 1)
                                                    setSelectedSizes(ss);
                                                } else { 
                                                    setSelectedSizes((prev) => [...prev, size]) 
                                                }
                                            }} type='button' key={size} className={`${selectedSizes.includes(size) ? 'bg-white border-2 border-light-blue shadow-[0_5px_10px_0_rgba(0,0,0,0.16)] text-dark-blue text-[15px] size-[40px]' : 'size-[10px] text-[#AAC3FF] text-[13px]'} z-20 rounded-full flex items-center justify-center font-raleway font-extrabold cursor-pointer transition-all duration-300 ease-in-out`}>
                                            <p className=''>{size}</p>
                                            </button>
                                        ))}
                                    </div>
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
                                <FormLabel className='text-lg text-black/90 font-semibold mb-2 leading-0 font-nunito-sans'>Order</FormLabel>
                            <FormControl className='w-full'>
                                <div className="w-full flex items-center justify-between gap-2">
                                <button type='button' onClick={() => setOrder('Popular')} className={`${order === 'Popular' ? 'justify-end gap-3' : 'justify-center'} cursor-pointer items-center w-[33%] p-1 flex  bg-[#E5EBFC] rounded-[18px]`}>
                                    <p className={`${order === 'Popular' ? 'font-bold text-dark-blue' : ' font-medium text-black'} font-raleway text-[15px]`}>Popular</p>
                                    <div className={`${order === 'Popular' ? 'size-[22px]' : 'size-0'} flex border-2 border-white items-center justify-center bg-dark-blue rounded-full transition-all duration-300 ease-in-out`}>
                                        <BsCheck className="text-white" />
                                    </div>
                                </button>
                                <button type='button' onClick={() => setOrder('Newest')} className={`${order === 'Newest' ? 'justify-end gap-3' : 'justify-center'} cursor-pointer items-center w-[33%] p-1 flex  bg-[#E5EBFC] rounded-[18px]`}>
                                    <p className={`${order === 'Newest' ? 'font-bold text-dark-blue' : ' font-medium text-black'} font-raleway text-[15px]`}>Newest</p>
                                    <div className={`${order === 'Newest' ? 'size-[22px]' : 'size-0'} flex border-2 border-white items-center justify-center bg-dark-blue rounded-full transition-all duration-300 ease-in-out`}>
                                        <BsCheck className="text-white" />
                                    </div>
                                </button>
                                <button type='button' onClick={() => setOrder('Oldest')} className={`${order === 'Oldest' ? 'justify-end gap-3' : 'justify-center'} cursor-pointer items-center w-[33%] p-1 flex  bg-[#E5EBFC] rounded-[18px]`}>
                                    <p className={`${order === 'Oldest' ? 'font-bold text-dark-blue' : ' font-medium text-black'} font-raleway text-[15px]`}>Oldest</p>
                                    <div className={`${order === 'Oldest' ? 'size-[22px]' : 'size-0'} flex border-2 border-white items-center justify-center bg-dark-blue rounded-full transition-all duration-300 ease-in-out`}>
                                        <BsCheck className="text-white" />
                                    </div>
                                </button>
                                
                                </div>
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )}
                    />

                    <FormField
                    control={form.control}
                    name='size'
                    render={({field}) => (
                        <FormItem className='mb-5'>
                            <FormLabel className='text-lg text-black/90 font-semibold mb-1 leading-0 font-nunito-sans'>Discount Percentage</FormLabel>
                            <FormDescription className='text-xs text-black/85'>Filter discount percentage</FormDescription>
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
                    <div className="w-full flex items-center justify-between gap-2 mt-6">
                        <PrimaryButton type='button' disabled={loading || !isDirty} text={loading ? <LoaderCircle className='animate-spin' /> : 'Reset'} additionalStyles="bg-transparent border-2 border-dark-blue text-dark-blue px-0 py-[5px] w-[30%]"  primaryButtonFunction={() => {
                            form.reset(); 
                            setOrder('Popular'); 
                            setSelectedSizes(['M']);
                            }}/>
                        <PrimaryButton disabled={loading || !isDirty} text={loading ? <LoaderCircle className='animate-spin' /> : 'Apply'} type="submit" additionalStyles="px-0 py-[5px] w-[70%]" />
                    </div>
                    </form>
                </Form>
                </div>
            </div>
        </motion.section>
      )
}

export default FilterModal