'use client';
import ProtectedRoute from '@/components/ProtectedRoute';
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { z } from "zod"
import { Form, FormField, FormItem, FormLabel, FormControl, FormMessage } from "@/components/ui/form"
import { CountryType } from '@/services/users/types';
import CountryCombobox from '../components/CountryCombobox';
import { Input } from '@/components/ui/input';
import PrimaryButton from '@/components/PrimaryButton';
import { LoaderCircle } from 'lucide-react';
import { useEffect, useState } from 'react';
import { useAuth } from '@/lib/contexts/auth-context';
import { useMutation } from '@tanstack/react-query';
import { updateUserShippingAddress } from '@/services/users/api';
import { toast } from 'react-toastify';
import RetryToast from '@/components/RetryToast';
import { toastStyles } from '@/lib/utils';
import { useRouter } from 'next/navigation';

export const countries : CountryType[] = [
    { value: "afghanistan", label: "Afghanistan" },
    { value: "albania", label: "Albania" },
    { value: "algeria", label: "Algeria" },
    { value: "andorra", label: "Andorra" },
    { value: "angola", label: "Angola" },
    { value: "antigua_and_barbuda", label: "Antigua and Barbuda" },
    { value: "argentina", label: "Argentina" },
    { value: "armenia", label: "Armenia" },
    { value: "australia", label: "Australia" },
    { value: "austria", label: "Austria" },
    { value: "azerbaijan", label: "Azerbaijan" },
    { value: "bahamas", label: "Bahamas" },
    { value: "bahrain", label: "Bahrain" },
    { value: "bangladesh", label: "Bangladesh" },
    { value: "barbados", label: "Barbados" },
    { value: "belarus", label: "Belarus" },
    { value: "belgium", label: "Belgium" },
    { value: "belize", label: "Belize" },
    { value: "benin", label: "Benin" },
    { value: "bhutan", label: "Bhutan" },
    { value: "bolivia", label: "Bolivia" },
    { value: "bosnia_and_herzegovina", label: "Bosnia and Herzegovina" },
    { value: "botswana", label: "Botswana" },
    { value: "brazil", label: "Brazil" },
    { value: "brunei", label: "Brunei" },
    { value: "bulgaria", label: "Bulgaria" },
    { value: "burkina_faso", label: "Burkina Faso" },
    { value: "burundi", label: "Burundi" },
    { value: "cabo_verde", label: "Cabo Verde" },
    { value: "cambodia", label: "Cambodia" },
    { value: "cameroon", label: "Cameroon" },
    { value: "canada", label: "Canada" },
    { value: "central_african_republic", label: "Central African Republic" },
    { value: "chad", label: "Chad" },
    { value: "chile", label: "Chile" },
    { value: "china", label: "China" },
    { value: "colombia", label: "Colombia" },
    { value: "comoros", label: "Comoros" },
    { value: "congo", label: "Congo" },
    { value: "costa_rica", label: "Costa Rica" },
    { value: "croatia", label: "Croatia" },
    { value: "cuba", label: "Cuba" },
    { value: "cyprus", label: "Cyprus" },
    { value: "czechia", label: "Czechia" },
    { value: "denmark", label: "Denmark" },
    { value: "djibouti", label: "Djibouti" },
    { value: "dominica", label: "Dominica" },
    { value: "dominican_republic", label: "Dominican Republic" },
    { value: "ecuador", label: "Ecuador" },
    { value: "egypt", label: "Egypt" },
    { value: "el_salvador", label: "El Salvador" },
    { value: "equatorial_guinea", label: "Equatorial Guinea" },
    { value: "eritrea", label: "Eritrea" },
    { value: "estonia", label: "Estonia" },
    { value: "eswatini", label: "Eswatini" },
    { value: "ethiopia", label: "Ethiopia" },
    { value: "fiji", label: "Fiji" },
    { value: "finland", label: "Finland" },
    { value: "france", label: "France" },
    { value: "gabon", label: "Gabon" },
    { value: "gambia", label: "Gambia" },
    { value: "georgia", label: "Georgia" },
    { value: "germany", label: "Germany" },
    { value: "ghana", label: "Ghana" },
    { value: "greece", label: "Greece" },
    { value: "grenada", label: "Grenada" },
    { value: "guatemala", label: "Guatemala" },
    { value: "guinea", label: "Guinea" },
    { value: "guinea_bissau", label: "Guinea-Bissau" },
    { value: "guyana", label: "Guyana" },
    { value: "haiti", label: "Haiti" },
    { value: "honduras", label: "Honduras" },
    { value: "hungary", label: "Hungary" },
    { value: "iceland", label: "Iceland" },
    { value: "india", label: "India" },
    { value: "indonesia", label: "Indonesia" },
    { value: "iran", label: "Iran" },
    { value: "iraq", label: "Iraq" },
    { value: "ireland", label: "Ireland" },
    { value: "israel", label: "Israel" },
    { value: "italy", label: "Italy" },
    { value: "jamaica", label: "Jamaica" },
    { value: "japan", label: "Japan" },
    { value: "jordan", label: "Jordan" },
    { value: "kazakhstan", label: "Kazakhstan" },
    { value: "kenya", label: "Kenya" },
    { value: "kiribati", label: "Kiribati" },
    { value: "kuwait", label: "Kuwait" },
    { value: "kyrgyzstan", label: "Kyrgyzstan" },
    { value: "laos", label: "Laos" },
    { value: "latvia", label: "Latvia" },
    { value: "lebanon", label: "Lebanon" },
    { value: "lesotho", label: "Lesotho" },
    { value: "liberia", label: "Liberia" },
    { value: "libya", label: "Libya" },
    { value: "liechtenstein", label: "Liechtenstein" },
    { value: "lithuania", label: "Lithuania" },
    { value: "luxembourg", label: "Luxembourg" },
    { value: "madagascar", label: "Madagascar" },
    { value: "malawi", label: "Malawi" },
    { value: "malaysia", label: "Malaysia" },
    { value: "maldives", label: "Maldives" },
    { value: "mali", label: "Mali" },
    { value: "malta", label: "Malta" },
    { value: "marshall_islands", label: "Marshall Islands" },
    { value: "mauritania", label: "Mauritania" },
    { value: "mauritius", label: "Mauritius" },
    { value: "mexico", label: "Mexico" },
    { value: "micronesia", label: "Micronesia" },
    { value: "moldova", label: "Moldova" },
    { value: "monaco", label: "Monaco" },
    { value: "mongolia", label: "Mongolia" },
    { value: "montenegro", label: "Montenegro" },
    { value: "morocco", label: "Morocco" },
    { value: "mozambique", label: "Mozambique" },
    { value: "myanmar", label: "Myanmar" },
    { value: "namibia", label: "Namibia" },
    { value: "nauru", label: "Nauru" },
    { value: "nepal", label: "Nepal" },
    { value: "netherlands", label: "Netherlands" },
    { value: "new_zealand", label: "New Zealand" },
    { value: "nicaragua", label: "Nicaragua" },
    { value: "niger", label: "Niger" },
    { value: "nigeria", label: "Nigeria" },
    { value: "north_korea", label: "North Korea" },
    { value: "north_macedonia", label: "North Macedonia" },
    { value: "norway", label: "Norway" },
    { value: "oman", label: "Oman" },
    { value: "pakistan", label: "Pakistan" },
    { value: "palau", label: "Palau" },
    { value: "panama", label: "Panama" },
    { value: "papua_new_guinea", label: "Papua New Guinea" },
    { value: "paraguay", label: "Paraguay" },
    { value: "peru", label: "Peru" },
    { value: "philippines", label: "Philippines" },
    { value: "poland", label: "Poland" },
    { value: "portugal", label: "Portugal" },
    { value: "qatar", label: "Qatar" },
    { value: "romania", label: "Romania" },
    { value: "russia", label: "Russia" },
    { value: "rwanda", label: "Rwanda" },
    { value: "saint_kitts_and_nevis", label: "Saint Kitts and Nevis" },
    { value: "saint_lucia", label: "Saint Lucia" },
    { value: "saint_vincent_and_the_grenadines", label: "Saint Vincent and the Grenadines" },
    { value: "samoa", label: "Samoa" },
    { value: "san_marino", label: "San Marino" },
    { value: "sao_tome_and_principe", label: "São Tomé and Príncipe" },
    { value: "saudi_arabia", label: "Saudi Arabia" },
    { value: "senegal", label: "Senegal" },
    { value: "serbia", label: "Serbia" },
    { value: "seychelles", label: "Seychelles" },
    { value: "sierra_leone", label: "Sierra Leone" },
    { value: "singapore", label: "Singapore" },
    { value: "slovakia", label: "Slovakia" },
    { value: "slovenia", label: "Slovenia" },
    { value: "solomon_islands", label: "Solomon Islands" },
    { value: "somalia", label: "Somalia" },
    { value: "south_africa", label: "South Africa" },
    { value: "south_korea", label: "South Korea" },
    { value: "south_sudan", label: "South Sudan" },
    { value: "spain", label: "Spain" },
    { value: "sri_lanka", label: "Sri Lanka" },
    { value: "sudan", label: "Sudan" },
    { value: "suriname", label: "Suriname" },
    { value: "sweden", label: "Sweden" },
    { value: "switzerland", label: "Switzerland" },
    { value: "syria", label: "Syria" },
    { value: "taiwan", label: "Taiwan" },
    { value: "tajikistan", label: "Tajikistan" },
    { value: "tanzania", label: "Tanzania" },
    { value: "thailand", label: "Thailand" },
    { value: "timor_leste", label: "Timor-Leste" },
    { value: "togo", label: "Togo" },
    { value: "tonga", label: "Tonga" },
    { value: "trinidad_and_tobago", label: "Trinidad and Tobago" },
    { value: "tunisia", label: "Tunisia" },
    { value: "turkey", label: "Turkey" },
    { value: "turkmenistan", label: "Turkmenistan" },
    { value: "tuvalu", label: "Tuvalu" },
    { value: "uganda", label: "Uganda" },
    { value: "ukraine", label: "Ukraine" },
    { value: "united_arab_emirates", label: "United Arab Emirates" },
    { value: "united_kingdom", label: "United Kingdom" },
    { value: "united_states", label: "United States" },
    { value: "uruguay", label: "Uruguay" },
    { value: "uzbekistan", label: "Uzbekistan" },
    { value: "vanuatu", label: "Vanuatu" },
    { value: "vatican_city", label: "Vatican City" },
    { value: "venezuela", label: "Venezuela" },
    { value: "vietnam", label: "Vietnam" },
    { value: "yemen", label: "Yemen" },
    { value: "zambia", label: "Zambia" },
    { value: "zimbabwe", label: "Zimbabwe" },
  ]
  
const schema = z.object({
  country: z.string().min(1, "Please select a country"),
  address: z.string().min(1, "Address is required"),
  city: z.string().min(1, "City is required"),
  postalCode: z.string().min(1, "Postal code is required"),
  phoneNumber: z.string('Invalid phoneNumber').optional(),
})

type FormValues = z.infer<typeof schema>

const ShippingAddressPage = () => {
    const {user} = useAuth();
    const [loading, setLoading] = useState(false);

    const router = useRouter();

    const form = useForm<FormValues>({
        resolver: zodResolver(schema),
        defaultValues: {
          country: user?.shippingAddress.country || "",
          address: user?.shippingAddress.address || "",
          city: user?.shippingAddress.city || "",
          postalCode: user?.shippingAddress.postalCode || "",
          phoneNumber: user?.shippingAddress.phoneNumber || ""
        },
    });

    const watchedValues = form.watch();
    
      const originalValues = {
        country: user?.shippingAddress.country || "",
        address: user?.shippingAddress.address || "",
        city: user?.shippingAddress.city || "",
        postalCode: user?.shippingAddress.postalCode || "",
        phoneNumber: user?.shippingAddress.phoneNumber || ""
      };
  
      const hasChanges = watchedValues.country !== originalValues.country || 
                        watchedValues.address !== originalValues.address || 
                        watchedValues.city !== originalValues.city || 
                        watchedValues.postalCode !== originalValues.postalCode || 
                        watchedValues.phoneNumber !== originalValues.phoneNumber;
      
      useEffect(() => {
        if (user?.shippingAddress) {
            form.reset({
                country: user?.shippingAddress.country || "",
                address: user?.shippingAddress.address || "",
                city: user?.shippingAddress.city || "",
                postalCode: user?.shippingAddress.postalCode || "",
                phoneNumber: user?.shippingAddress.phoneNumber || ""
            });
        }
    }, [user, form]);

    const updateUserProfileMutation = useMutation({
        mutationKey: ['updateUserShippingAddress'],
        mutationFn: ({uid, country, address, city, postalCode, phoneNumber} : {uid: string; country: string; address: string; city: string; postalCode: string; phoneNumber?: string;}) =>  updateUserShippingAddress({
            uid,
            country,
            address,
            city,
            postalCode,
            phoneNumber}),
        onSuccess: () => {
            toast.success('User shipping address updated successfully');
        }
    })

    const handleUserShippingAddressUpdate = async (data: z.infer<typeof schema>) => {
        const {
            country,
            address,
            city,
            postalCode,
            phoneNumber
        } = data;
        const uid = user?.uid;
        if (hasChanges && uid) {
            setLoading(true);
            try {
                await updateUserProfileMutation.mutateAsync({uid,
                    country,
                    address,
                    city,
                    postalCode,
                    phoneNumber});
                router.push('/settings')
            } catch (error: any) {
                console.error('Shipping address update error:', error);
                
                if (error.code === 'permission-denied') {
                    toast.error('You do not have permission to update your shipping address');
                } else if (error.code === 'unavailable' || error.message?.includes('network')) {
                    toast.error(
                        <RetryToast label='Try again' message="Network error: Shipping couldn't be updated" retry={() => handleUserShippingAddressUpdate(data)} />,
                        toastStyles.error
                    );
                } else if (error.message?.includes('country')) {
                    toast.error('Country update failed. Please try again.');
                } else if (error.message?.includes('city')) {
                    toast.error('City update failed. Please try again.');
                } else if (error.message?.includes('address')) {
                    toast.error('Adsress update failed. Please try again.');
                } else if (error.message?.includes('postalCode')) {
                    toast.error('Postal code update failed. Please try again.');
                } else if (error.message?.includes('phoneNumber')) {
                    toast.error('Phone number update failed. Please try again.');
                } else {
                    toast.error('Failed to update Shipping Address. Please try again.');
                }
            } finally{
                setLoading(false);
            }
        }
    };

    const onSubmit = (data: z.infer<typeof schema>) => {
        console.log('submitted')
        handleUserShippingAddressUpdate(data);
    }

  return (
    <ProtectedRoute>
        <section className="w-full">
        <h4 className='text-[16px] font-medium font-raleway'>Shipping Address</h4>
        <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)}>
            <FormField
            control={form.control}
            name="country"
            render={({ field }) => (
                <FormItem className='mt-8'>
                <FormLabel className='text-[14px] font-nunito-sans font-semibold leading-0 mb-2.5'>Country</FormLabel>
                <FormControl>
                    <CountryCombobox
                    countries={countries}
                    value={countries.find((b) => b.value === field.value) || null}
                    onChange={(selected) => field.onChange(selected?.value)}
                    placeholder="Choose your Country"
                />
                </FormControl>
                <FormMessage />
                </FormItem>
            )}
            />

            <FormField
                control={form.control}
                name="address"
                render={({ field }) => (
                <FormItem className='mt-12'>
                    <FormLabel className='text-[14px] font-nunito-sans font-semibold leading-0 mb-1'>Address</FormLabel>
                    <FormControl>
                    <Input className='bg-[#F1F4FE] rounded-md placeholder:text-[#9EB4E8] focus:border-dark-blue transition-all duration-300 ease-in-out'  placeholder="Required" {...field} />
                    </FormControl>
                    <FormMessage />
                </FormItem>
                )}
            />
            <FormField
                control={form.control}
                name="city"
                render={({ field }) => (
                <FormItem className='mt-6'>
                    <FormLabel className='text-[14px] font-nunito-sans font-semibold leading-0 mb-1'>City</FormLabel>
                    <FormControl>
                    <Input className='bg-[#F1F4FE] rounded-md placeholder:text-[#9EB4E8] focus:border-dark-blue transition-all duration-300 ease-in-out'  placeholder="Required" {...field} />
                    </FormControl>
                    <FormMessage />
                </FormItem>
                )}
            />

            <FormField
                control={form.control}
                name="postalCode"
                render={({ field }) => (
                <FormItem className='mt-6'>
                    <FormLabel className='text-[14px] font-nunito-sans font-semibold leading-0 mb-1'>Postal Code</FormLabel>
                    <FormControl>
                    <Input className='bg-[#F1F4FE] rounded-md placeholder:text-[#9EB4E8] focus:border-dark-blue transition-all duration-300 ease-in-out'  placeholder="Required" {...field} />
                    </FormControl>
                    <FormMessage />
                </FormItem>
                )}
            />

            <FormField
                control={form.control}
                name="phoneNumber"
                render={({ field }) => (
                <FormItem className='mt-6'>
                    <FormLabel className='text-[14px] font-nunito-sans font-semibold leading-0 mb-1'>Phone Number</FormLabel>
                    <FormControl>
                    <Input className='bg-[#F1F4FE] rounded-md placeholder:text-[#9EB4E8] focus:border-dark-blue transition-all duration-300 ease-in-out'  placeholder="Optional" {...field} />
                    </FormControl>
                    <FormMessage />
                </FormItem>
                )}
            />
            <div className='fixed bottom-5 left-0 z-20 w-full px-6'>
                <PrimaryButton disabled={!hasChanges || loading} text={loading ? <LoaderCircle className='animate-spin' /> : 'Save Changes'} type="submit" additionalStyles="" />
            </div>
        </form>
        </Form>
        </section>
    </ProtectedRoute>
  )
}

export default ShippingAddressPage;