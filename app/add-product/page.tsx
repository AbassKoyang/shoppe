'use client'
import { 
    Form,
    FormControl,
    FormField,
    FormItem,
    FormMessage,
    FormLabel
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Button } from '@/components/ui/button';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { ProductSchema } from '@/services/products/schema';
import { useState } from 'react';
import { SelectGroup, SelectLabel } from '@radix-ui/react-select';
import { Label } from '@/components/ui/label';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
const ALL_SIZES = [
  // One Size
  "One Size",

  // Alpha Sizes
  "XS",
  "S",
  "M",
  "L",
  "XL",
  "XXL",

  // Numeric Sizes (extend if needed)
  "28",
  "30",
  "32",
  "34",
  "36",
  "38",
  "40",
] as const;
const CATEGORIES = [
  { value: "tops", label: "Tops" },
  { value: "bottoms", label: "Bottoms" },
  { value: "dresses", label: "Dresses" },
  { value: "outerwear", label: "Outerwear" },
  { value: "shoes", label: "Shoes" },
  { value: "bags", label: "Bags" },
  { value: "accessories", label: "Accessories" },
  { value: "underwear", label: "Underwear" },
  { value: "swimwear", label: "Swimwear" },
  { value: "activewear", label: "Activewear" },
  { value: "other", label: "Other" },
] as const


const page = () => {
  const [previewUrls, setPreviewUrls] = useState<string[]>([]);
    const form = useForm<z.infer<typeof ProductSchema>>({
        resolver: zodResolver(ProductSchema),
        defaultValues: {
            title: '',
            description: '',
            price: 0,
            currency: '$ USD',
            images: [],
            category: 'Tops',
            condition: 'new',
            size: 'One Size',
            gender: 'Men',
            brand: '',
            color: '',
            material: '',
            sku: '',
            tags: [],
            location: {
                country: '',
                city: '',
            },
            sellerId: '',
            id: '',
        },
    });

    const onSubmit = (values: z.infer<typeof ProductSchema>) => {
        console.log(values);
    }

    const handleImageUpload = (
        e: React.ChangeEvent<HTMLInputElement>
      ) => {
        const files = e.target.files ? Array.from(e.target.files) : [];
        if (files.length === 0) return;
        const urls = files.map(file => URL.createObjectURL(file));
        form.setValue('images', urls, { shouldValidate: true });
        setPreviewUrls(urls);
      };

  return (
    <section>
        <h1>Add New Product</h1>
        <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className='mt-6 w-full'>
                <FormField
                control={form.control}
                name="images"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Product Images</FormLabel>
                    <FormControl>
                      <div className="space-y-2">
                        <Input
                          type="file"
                          multiple
                          accept="image/*"
                          onChange={handleImageUpload}
                        />
                        <div className="flex gap-2 flex-wrap">
                          {field.value?.map((url, i) => (
                            <img
                              key={i}
                              src={url}
                              alt={`Product ${i}`}
                              className="h-20 w-20 object-cover rounded-md border"
                            />
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
              name='title'
              render={({field}) => (
                <FormItem>
                  <FormLabel>Title</FormLabel>
                  <FormControl>
                    <Input {...field} placeholder='Title' />
                  </FormControl>
                </FormItem>
              )}
              />

              <FormField
                control={form.control}
                name='description'
                render={({field}) => (
                    <FormItem>
                        <FormControl>
                            <Textarea {...field} placeholder='description' />
                        </FormControl>
                        <FormMessage />
                    </FormItem>
                )}
                />
              <FormField
                control={form.control}
                name='category'
                render={({field}) => (
                    <FormItem>
                        <FormControl>
                        <Select onValueChange={field.onChange}>
                          <SelectTrigger className="w-[180px]">
                            <SelectValue placeholder="Select a fruit" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectGroup>
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
                name='size'
                render={({field}) => (
                    <FormItem>
                        <FormControl>
                        <Select onValueChange={field.onChange}>
                          <SelectTrigger className="w-[180px]">
                            <SelectValue placeholder="Select a size" />
                          </SelectTrigger>
                          <SelectContent>
                          <SelectGroup>
                            <SelectLabel>Alpha</SelectLabel>
                            <SelectItem value="9">9</SelectItem>
                            <SelectItem value="cst">Central Standard Time (CST)</SelectItem>
                            <SelectItem value="mst">Mountain Standard Time (MST)</SelectItem>
                            <SelectItem value="pst">Pacific Standard Time (PST)</SelectItem>
                            <SelectItem value="akst">Alaska Standard Time (AKST)</SelectItem>
                            <SelectItem value="hst">Hawaii Standard Time (HST)</SelectItem>
                          </SelectGroup>
                          <SelectGroup>
                            <SelectLabel>Numeric</SelectLabel>
                            <SelectItem value="gmt">Greenwich Mean Time (GMT)</SelectItem>
                            <SelectItem value="cet">Central European Time (CET)</SelectItem>
                            <SelectItem value="eet">Eastern European Time (EET)</SelectItem>
                            <SelectItem value="west">
                              Western European Summer Time (WEST)
                            </SelectItem>
                            <SelectItem value="cat">Central Africa Time (CAT)</SelectItem>
                            <SelectItem value="eat">East Africa Time (EAT)</SelectItem>
                          </SelectGroup>
                          <SelectGroup>
                            <SelectLabel>One Size</SelectLabel>
                            <SelectItem value="n">Greenwich Mean Time (GMT)</SelectItem>
                            <SelectItem value="cmjet">Central European Time (CET)</SelectItem>
                            <SelectItem value="ejet">Eastern European Time (EET)</SelectItem>
                            <SelectItem value="wejst">
                              Western European Summer Time (WEST)
                            </SelectItem>
                            <SelectItem value="nbhm">Central Africa Time (CAT)</SelectItem>
                            <SelectItem value="ejnhat">East Africa Time (EAT)</SelectItem>
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
                    <FormItem>
                        <FormControl>
                        <RadioGroup defaultValue="men" onValueChange={field.onChange}>
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
              <FormField
                control={form.control}
                name='brand'
                render={({field}) => (
                    <FormItem>
                        <FormControl>
                            <Input {...field} placeholder='Brand' />
                        </FormControl>
                        <FormMessage />
                    </FormItem>
                )}
                />

              <FormField
                control={form.control}
                name='color'
                render={({field}) => (
                    <FormItem>
                        <FormControl>
                            <Input {...field} placeholder='Color' />
                        </FormControl>
                        <FormMessage />
                    </FormItem>
                )}
                />

              <FormField
                control={form.control}
                name='material'
                render={({field}) => (
                    <FormItem>
                        <FormControl>
                            <Input {...field} placeholder='Material' />
                        </FormControl>
                        <FormMessage />
                    </FormItem>
                )}
                />
                <button type='submit'>Submit</button>

            </form>
        </Form>
    </section>
  )
}

export default page