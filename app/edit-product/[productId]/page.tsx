'use client'
import { 
    Form,
    FormControl,
    FormField,
    FormItem,
    FormMessage,
    FormLabel,
    FormDescription
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { ProductSchema } from '@/services/products/schema';
import { useEffect, useState } from 'react';
import { SelectGroup, SelectLabel } from '@radix-ui/react-select';
import { Label } from '@/components/ui/label';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { ArrowLeft, ImagePlus, LoaderCircle, Plus, X } from 'lucide-react';
import PrimaryButton from '@/components/PrimaryButton';
import ProtectedRoute from '@/components/ProtectedRoute';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { addProduct, editProduct } from '@/services/products/api';
import { ProductType } from '@/services/products/types';
import { toast } from 'react-toastify';
import { useParams, useRouter } from 'next/navigation';
import { useAuth } from '@/lib/contexts/auth-context';
import { ALPHA_SIZES, CATEGORIES, NUMERIC_SIZES, SUB_CATEGORIES } from '@/lib/utils';
import { useFetchSingleProduct } from '@/services/products/queries';



const Page = () => {
  const {user} = useAuth();
  const productId = useParams<{productId: string}>().productId;
  const {isError, isLoading, data: product} = useFetchSingleProduct(productId);
  const [previewUrls, setPreviewUrls] = useState<string[]>([]);
  const [originalImages, setOriginalImages] = useState(product?.images || [])
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const queryClient = useQueryClient();
  
    const form = useForm<z.infer<typeof ProductSchema>>({
        resolver: zodResolver(ProductSchema),
        defaultValues: {
            title: product?.title,
            description: product?.description,
            price: product?.price,
            discount: product?.discount,
            images: [],
            category: product?.category || 'Tops',
            gender: product?.gender,
            brand: product?.brand,
            color: product?.color,
            material: product?.material,
            sku: product?.sku,
            views: product?.views,
            location: product?.location,
            currency: product?.currency,
            size: product?.size
        },
    });
    console.log(product);

    

    useEffect(() => {
        if(product){
            form.reset({
                title: product?.title,
                description: product?.description,
                price: product?.price.toString(),
                discount: product?.discount.toString(),
                images: product.images,
                category: product?.category || 'Tops',
                subCategory: product.subCategory,
                gender: product?.gender,
                brand: product?.brand,
                color: product?.color,
                material: product?.material,
                sku: product?.sku,
                views: product?.views,
                location: product?.location,
                currency: product?.currency,
                condition: product?.condition,
                size: product.size
            })
            console.log(product);
        }
    }, [product])

    useEffect(() => {
      setOriginalImages(product?.images || [])
    }, [product])
    
    const isDirty = form.formState.isDirty;

    const onSubmit = (data: z.infer<typeof ProductSchema>) => {
        console.log('clicked 2')
        handleEditProduct(data);
        console.log('clicked 2')
    }


    const handleImageUpload  = (
        e: React.ChangeEvent<HTMLInputElement>
      ) => {
        const files = e.target.files ? Array.from(e.target.files) : [];
        if (files.length === 0) return;
        const urls = files.map(file => URL.createObjectURL(file));
        form.setValue('images', files, { shouldValidate: true });
        setPreviewUrls(urls);
    };

    const editProductMutation = useMutation({
      mutationFn: (data: ProductType) => editProduct(data),
      onSuccess: (data) => {
        toast.success('Product edited succesfully');
        queryClient.invalidateQueries({ queryKey: ['products']});
        router.back();
      }
    });

    const handleEditProduct = async (data: ProductType) =>{
      console.log('Clickeddd', data)
      if(!user){
        toast.error("You must be logged in to edit a product.");
        return;
      }
      try {
        setLoading(true);
        const imagesFromForm = data.images;
        const imagesToBeUploaded = imagesFromForm.filter((image) => !originalImages.includes(image));
        console.log(imagesToBeUploaded);
        const uploadedUrls = await Promise.all(
          imagesToBeUploaded.map(async (file: File) => {
            const formData = new FormData();
            formData.append("file", file);
            formData.append("upload_preset", "product-preset");
    
            const res = await fetch(
              `https://api.cloudinary.com/v1_1/${process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME}/image/upload`,
              {
                method: "POST",
                body: formData,
              }
            );
    
            const data = await res.json();
            return data.secure_url as string;
          })
        );

        const newImages = [...originalImages, ...uploadedUrls];

        const productDetails = {
          ...data,
          images: newImages,
          sellerId: user.uid,
          id: product?.id
        }
        console.log(productDetails)

        const success = await editProductMutation.mutateAsync(productDetails);
        if(success){
          form.reset();
        }
      } catch (error: any) {
        console.error("❌ Error editing product:", error);
    
        if (error?.code === "permission-denied") {
          toast.error("You don’t have permission to edit product.");
        } else if (error?.message?.includes("network")) {
          toast.error("Network error — check your connection and try again.");
        } else {
          toast.error("Something went wrong while editing your product. Please try again.");
        }
      } finally {
        setLoading(false);
      }
    }

  return (
    <ProtectedRoute>
    <>
    {isLoading && ( 
        <div className="min-h-screen flex items-center justify-center bg-white">
            <div className="flex flex-col items-center gap-4">
            <p className="text-gray-600">Loading...</p>
            <LoaderCircle className="animate-spin h-8 w-8 text-blue-500" />
            </div>
        </div>
    )}
    {isError && ( 
        <div className="min-h-screen flex items-center justify-center bg-white">
            <p>Oops, Failed to load messages from this Chat.</p>
        </div>
    )}
    {product && (<section className='w-full px-6 '>
          <div className="w-full flex items-center gap-3">
              <button onClick={() => router.back()} className="flex items-center justify-center cursor-pointer">
                  <ArrowLeft className="size-[30px]" />
              </button>
              <h1 className='text-2xl my-4 font-bold font-raleway'>Edit Item</h1>
          </div>
              <Form {...form}>
                  <form onSubmit={form.handleSubmit(
          (data) => {
            console.log("SUBMIT CALLED with data:", data);
            onSubmit(data);
          },
          (errors) => {
            console.log("FORM ERRORS:", errors);
            console.log(form.watch())
          }
        )} className='mt-6 w-full'>
                <div className="w-full bg-[#F8FAFF] rounded-md p-4">
                  <h4 className='text-lg font-nunito-sans font-bold mb-4'>Upload Image</h4>
                      <FormField
                      control={form.control}
                      name="images"
                      render={({ field }) => (
                        <FormItem>
                          <FormControl>
                            <div>
                              <div className="w-full h-[250px] bg-[#F1F4FE] rounded-md overflow-hidden relative border border-[#9297e7] border-dashed">
                                <Input
                                  type="file"
                                  multiple
                                  accept="image/*"
                                  onChange={handleImageUpload}
                                  className='w-full h-full opacity-0 z-30 absolute left-0 top-0'
                                />
                                  <div className="size-full flex flex-col items-center justify-center absolute top-0 left-0 z-10 object-contain object-center">
                                    {previewUrls.length > 0 ? (
                                      <img className='size-full' src={previewUrls[0]}/>
                                    ) : (
                                      <>
                                        <ImagePlus strokeWidth={1} className='text-[#9EB4E8] size-[130px]' />
                                        <p className='text-[#9EB4E8] mt-3'>Click to add image</p>
                                      </>
                                    )}
                                  </div>
                                </div>
                                <div className="flex gap-2 flex-wrap mt-3">
                                  {originalImages.map((url, i) => (
                                    <div className='h-20 w-20 relative'>
                                      <img
                                      key={i}
                                      src={url}
                                      alt={`Product ${i}`}
                                      className="size-full object-cover rounded-md border border-[#9297e7]"
                                       />
                                       <span onClick={() => {
                                          const updated = originalImages.filter((_, index) => index !== i);
                                          setOriginalImages(updated);
                                        }} className='absolute top-[-5%] right-[-5%] rounded-full bg-red-600 flex items-center justify-center p-0.5'>
                                        <X className='size-[14px] text-white' />
                                       </span>
                                    </div>
                                  ))}
                                  {previewUrls.map((url, i) => (
                                    <div className='h-20 w-20 relative'>
                                      <img
                                      key={i}
                                      src={url}
                                      alt={`Product ${i}`}
                                      className="size-full object-cover rounded-md border border-[#9297e7]"
                                       />
                                       <span onClick={() => {
                                          const updated = field.value.filter((_, index) => index !== i);
                                          form.setValue("images", updated, { shouldValidate: true });
                                          setPreviewUrls(updated);
                                        }} className='absolute top-[-5%] right-[-5%] rounded-full bg-red-600 flex items-center justify-center p-0.5'>
                                        <X className='size-[14px] text-white' />
                                       </span>
                                    </div>
                                  ))}
                                  <button className='size-20 rounded-md bg-transparent border border-[#9297e7] border-dashed flex items-center justify-center relative'>
                                    <Input
                                      type="file"
                                      multiple
                                      accept="image/*"
                                      onChange={(e) => {
                                        const files = e.target.files ? Array.from(e.target.files) : [];
                                        if (files.length === 0) return;
                                        const urls = files.map(file => URL.createObjectURL(file));
                                        const updatedUrls = [...previewUrls, ...urls];
                                        const updatedFiles = [...files, ...field.value];
                                        form.setValue('images', updatedFiles, { shouldValidate: true });
                                        setPreviewUrls(updatedUrls);
                                        }
                                      }
                                      className='w-full h-full opacity-0 z-30 absolute left-0 top-0'
                                    />
                                    <span className='rounded-full bg-dark-blue flex items-center justify-center p-0.5'>
                                    <Plus className='text-[14px] text-white' />
                                    </span>
                                  </button>
                                </div>
                              </div>
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                </div>

                <div className="w-full bg-[#F8FAFF] rounded-md p-4 mt-4">
                  <h4 className='text-lg font-nunito-sans font-bold mb-5'>General Information</h4>
                  <FormField
                  control={form.control}
                  name='title'
                  render={({field}) => (
                    <FormItem className='mb-5'>
                      <FormLabel className='text-sm text-black/90 font-semibold mb-1 leading-0 font-nunito-sans'>Product Title</FormLabel>
                      <FormControl>
                        <Input className='w-full h-12 px-2 py-3 bg-[#F1F4FE] rounded-md placeholder:text-[#9EB4E8] text-black/80 focus:border-dark-blue transition-all duration-300 ease-in-out]' {...field} placeholder='Puffer Jacket Made With Pocket Detail' />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                  />

                  <FormField
                    control={form.control}
                    name='description'
                    render={({field}) => (
                        <FormItem className=''>
                        <FormLabel className='text-sm text-black/90 font-semibold mb-1 leading-0 font-nunito-sans'>Product Description</FormLabel>
                            <FormControl>
                                <Textarea className='w-full min-h-[120px] px-2 py-1 bg-[#F1F4FE] rounded-md placeholder:text-[#9EB4E8] text-black/80 border focus:border-dark-blue transition-all duration-300 ease-in-out' {...field} placeholder='Cropped puffer jacket made of technical fabric...' />
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )}
                    />
                </div>

                <div className="w-full bg-[#F8FAFF] rounded-md p-4 mt-4">
                  <h4 className='text-lg font-nunito-sans font-bold mb-5'>Category</h4>
                   <FormField
                    control={form.control}
                    name='category'
                    render={({field}) => (
                        <FormItem className='mb-5'>
                          <FormLabel className='text-sm text-black/90 font-semibold mb-1 leading-0 font-nunito-sans'>Product Category</FormLabel>
                          <FormControl>
                          <Select onValueChange={field.onChange}>
                            <SelectTrigger className="w-full bg-[#F1F4FE] border focus:border-dark-blue stroke-0 transition-all duration-300 ease-in-out">
                              <SelectValue placeholder="Select a category" />
                            </SelectTrigger>
                            <SelectContent className='w-full'>
                              <SelectGroup className='w-full'>
                                <SelectLabel>Categories</SelectLabel>
                                {CATEGORIES.map((cat) => (
                                  <SelectItem key={cat.label} value={cat.label}>{cat.label}</SelectItem>
                                ))}
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
                    name='subCategory'
                    render={({field}) => (
                        <FormItem className='mb-5'>
                          <FormLabel className='text-sm text-black/90 font-semibold mb-1 leading-0 font-nunito-sans'>Sub Category</FormLabel>
                          <FormControl>
                          <Select onValueChange={field.onChange}>
                            <SelectTrigger className="w-full bg-[#F1F4FE] border focus:border-dark-blue stroke-0 transition-all duration-300 ease-in-out">
                              <SelectValue placeholder="Select a sub-category" />
                            </SelectTrigger>
                            <SelectContent className='w-full'>
                              <SelectGroup className='w-full'>
                                <SelectLabel>Categories</SelectLabel>
                                {SUB_CATEGORIES[form.watch('category')].map((sub) => (
                                  <SelectItem key={sub} value={sub}>{sub}</SelectItem>
                                ))}
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
                    name='condition'
                    render={({field}) => (
                        <FormItem className='mb-5'>
                          <FormLabel className='text-sm text-black/90 font-semibold mb-1 leading-0 font-nunito-sans'>Product Condition</FormLabel>
                          <FormControl>
                          <Select onValueChange={field.onChange}>
                            <SelectTrigger className="w-full bg-[#F1F4FE] border focus:border-dark-blue stroke-0 transition-all duration-300 ease-in-out">
                              <SelectValue placeholder="Select product condition" />
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
                        <FormItem className='mb-5'>
                            <FormLabel className='text-sm text-black/90 font-semibold mb-1 leading-0 font-nunito-sans'>Size</FormLabel>
                            <FormDescription className='text-xs text-black/85'>Pick available size</FormDescription>
                            <FormControl>
                            <Select onValueChange={field.onChange}>
                              <SelectTrigger className="w-full bg-[#F1F4FE] border focus:border-dark-blue stroke-0 transition-all duration-300 ease-in-out">
                                <SelectValue placeholder="Select a size" />
                              </SelectTrigger>
                              <SelectContent>
                              <SelectGroup>
                                <SelectLabel>Alpha</SelectLabel>
                                {ALPHA_SIZES.map((size) => (
                                <SelectItem value={size}>{size}</SelectItem>
                                ))}
                              </SelectGroup>
                              <SelectGroup>
                                <SelectLabel>Numeric</SelectLabel>
                                {NUMERIC_SIZES.map((size) => (
                                <SelectItem value={size}>{size}</SelectItem>
                                ))}
                              </SelectGroup>
                              <SelectGroup>
                                <SelectLabel>One Size</SelectLabel>
                                <SelectItem value="One Size">One Size</SelectItem>
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
                    name='gender'
                    render={({field}) => (
                        <FormItem className=''>
                          <FormLabel className='text-sm text-black/90 font-semibold mb-1 leading-0 font-nunito-sans'>Gender</FormLabel>
                          <FormDescription className='text-xs text-black/85'>Pick available gender</FormDescription>
                            <FormControl>
                            <RadioGroup className='flex items-center justify-between' defaultValue="Men" onValueChange={field.onChange}>
                            <div className="flex items-center gap-3">
                              <RadioGroupItem value="Men" id="r1" />
                              <Label htmlFor="r1">Men</Label>
                            </div>
                            <div className="flex items-center gap-3">
                              <RadioGroupItem value="Women" id="r2" />
                              <Label htmlFor="r2">Women</Label>
                            </div>
                            <div className="flex items-center gap-3">
                              <RadioGroupItem value="Unisex" id="r3" />
                              <Label htmlFor="r3">Unisex</Label>
                            </div>
                          </RadioGroup>
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )}
                    />
              </div>

              <div className="w-full bg-[#F8FAFF] rounded-md p-4 mt-4">
                <h4 className='text-lg font-nunito-sans font-bold mb-5'>Pricing</h4>
                <FormField
                  control={form.control}
                  name='price'
                  render={({field}) => (
                      <FormItem className=''>
                        <FormLabel className='text-sm text-black/90 font-semibold mb-1 leading-0 font-nunito-sans'>Base Price</FormLabel>
                          <FormControl>
                          <Input className='w-full h-12 px-2 py-3 bg-[#F1F4FE] rounded-md placeholder:text-[#9EB4E8] text-black/80 focus:border-dark-blue transition-all duration-300 ease-in-out]' {...field} placeholder='Price' />
                          </FormControl>
                          <FormMessage />
                      </FormItem>
                  )}
                  />

                <FormField
                  control={form.control}
                  name='discount'
                  render={({field}) => (
                    <FormItem className='mt-6'>
                    <FormLabel className='text-sm text-black/90 font-semibold mb-1 leading-0 font-nunito-sans'>Discount</FormLabel>
                      <FormControl>
                      <Input className='w-full h-12 px-2 py-3 bg-[#F1F4FE] rounded-md placeholder:text-[#9EB4E8] text-black/80 focus:border-dark-blue transition-all duration-300 ease-in-out]' {...field} placeholder='Discount' />
                      </FormControl>
                      <FormMessage />
                  </FormItem>
                  )}
                  />

                <FormField
                  control={form.control}
                  name='currency'
                  render={({field}) => (
                    <FormItem className='mt-6'>
                      <FormLabel className='text-sm text-black/90 font-semibold mb-1 leading-0 font-nunito-sans'>Currency</FormLabel>
                      <FormControl>
                        <Select onValueChange={field.onChange}>
                          <SelectTrigger className="w-full bg-[#F1F4FE] border focus:border-dark-blue stroke-0 transition-all duration-300 ease-in-out">
                            <SelectValue placeholder="Select a currency" />
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
                  )}/>
              </div>
              <div className="w-full bg-[#F8FAFF] rounded-md p-4 mt-4">
                <h4 className='text-lg font-nunito-sans font-bold mb-5'>Others</h4>
                <FormField
                  control={form.control}
                  name='brand'
                  render={({field}) => (
                      <FormItem className=''>
                        <FormLabel className='text-sm text-black/90 font-semibold mb-1 leading-0 font-nunito-sans'>Brand</FormLabel>
                          <FormControl>
                          <Input className='w-full h-12 px-2 py-3 bg-[#F1F4FE] rounded-md placeholder:text-[#9EB4E8] text-black/80 focus:border-dark-blue transition-all duration-300 ease-in-out]' {...field} placeholder='Louiv Vuitton (Optional)' />
                          </FormControl>
                          <FormMessage />
                      </FormItem>
                  )}
                  />

                <FormField
                  control={form.control}
                  name='color'
                  render={({field}) => (
                    <FormItem className='mt-6'>
                    <FormLabel className='text-sm text-black/90 font-semibold mb-1 leading-0 font-nunito-sans'>Color</FormLabel>
                      <FormControl>
                      <Input className='w-full h-12 px-2 py-3 bg-[#F1F4FE] rounded-md placeholder:text-[#9EB4E8] text-black/80 focus:border-dark-blue transition-all duration-300 ease-in-out]' {...field} placeholder='Blue (Optional)' />
                      </FormControl>
                      <FormMessage />
                  </FormItem>
                  )}
                  />

                <FormField
                  control={form.control}
                  name='material'
                  render={({field}) => (
                    <FormItem className='mt-6'>
                      <FormLabel className='text-sm text-black/90 font-semibold mb-1 leading-0 font-nunito-sans'>Material</FormLabel>
                      <FormControl>
                      <Input  className='w-full h-12 px-2 py-3 bg-[#F1F4FE] rounded-md placeholder:text-[#9EB4E8] text-black/80 focus:border-dark-blue transition-all duration-300 ease-in-out]' {...field} placeholder='Wool (Optional)' />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                  )}/>
                <FormField
                  control={form.control}
                  name='sku'
                  render={({field}) => (
                    <FormItem className='mt-6'>
                      <FormLabel className='text-sm text-black/90 font-semibold mb-1 leading-0 font-nunito-sans'>SKU</FormLabel>
                      <FormControl>
                      <Input className='w-full h-12 px-2 py-3 bg-[#F1F4FE] rounded-md placeholder:text-[#9EB4E8] text-black/80 focus:border-dark-blue transition-all duration-300 ease-in-out]' {...field} placeholder='NIKE-AMX-BLU-40 (Optional)' />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                  )}/>
                <FormField
                  control={form.control}
                  name='location'
                  render={({field}) => (
                    <FormItem className='mt-6'>
                      <FormLabel className='text-sm text-black/90 font-semibold mb-1 leading-0 font-nunito-sans'>Location</FormLabel>
                      <FormControl>
                      <Input  className='w-full h-12 px-2 py-3 bg-[#F1F4FE] rounded-md placeholder:text-[#9EB4E8] text-black/80 focus:border-dark-blue transition-all duration-300 ease-in-out]' {...field} placeholder='Lagos, Nigeria (Optional)' />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                  )}/>
              </div>
              <PrimaryButton disabled={loading || !isDirty} text={loading ? <LoaderCircle className='animate-spin' /> : 'Add Product'} type="submit" additionalStyles="w-full my-6" />
              </form>
        </Form>
    </section>)}
    </>
    </ProtectedRoute>
  )
}

export default Page;