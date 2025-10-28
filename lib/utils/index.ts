import { CategoryType } from "@/services/products/types";
import { CountryType } from "@/services/users/types";
import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export const toastStyles = {
  error: {
      position: "top-center" as const,
      autoClose: 5000,
      hideProgressBar: false,
      closeOnClick: true,
      pauseOnHover: true,
      draggable: true,
      theme: "light" as const,
      style: {
          background: '#ffffff',
          color: '#dc2626',
          border: '2px solid #dc2626',
          borderRadius: '12px',
          fontSize: '16px',
          fontWeight: '500',
          minWidth: '300px'
      }
  },
  errorSimple: {
      position: "top-center" as const,
      autoClose: 5000,
      hideProgressBar: false,
      closeOnClick: true,
      pauseOnHover: true,
      draggable: true,
      theme: "light" as const,
      style: {
          background: '#ffffff',
          color: '#dc2626',
          border: '2px solid #dc2626',
          borderRadius: '12px',
          fontSize: '16px',
          fontWeight: '500'
      }
  }
};

export const states: CountryType[] = [
  { value: "abia", label: "Abia" },
  { value: "adamawa", label: "Adamawa" },
  { value: "akwa_ibom", label: "Akwa Ibom" },
  { value: "anambra", label: "Anambra" },
  { value: "bauchi", label: "Bauchi" },
  { value: "bayelsa", label: "Bayelsa" },
  { value: "benue", label: "Benue" },
  { value: "borno", label: "Borno" },
  { value: "cross_river", label: "Cross River" },
  { value: "delta", label: "Delta" },
  { value: "ebonyi", label: "Ebonyi" },
  { value: "edo", label: "Edo" },
  { value: "ekiti", label: "Ekiti" },
  { value: "enugu", label: "Enugu" },
  { value: "gombe", label: "Gombe" },
  { value: "imo", label: "Imo" },
  { value: "jigawa", label: "Jigawa" },
  { value: "kaduna", label: "Kaduna" },
  { value: "kano", label: "Kano" },
  { value: "katsina", label: "Katsina" },
  { value: "kebbi", label: "Kebbi" },
  { value: "kogi", label: "Kogi" },
  { value: "kwara", label: "Kwara" },
  { value: "lagos", label: "Lagos" },
  { value: "nasarawa", label: "Nasarawa" },
  { value: "niger", label: "Niger" },
  { value: "ogun", label: "Ogun" },
  { value: "ondo", label: "Ondo" },
  { value: "osun", label: "Osun" },
  { value: "oyo", label: "Oyo" },
  { value: "plateau", label: "Plateau" },
  { value: "rivers", label: "Rivers" },
  { value: "sokoto", label: "Sokoto" },
  { value: "taraba", label: "Taraba" },
  { value: "yobe", label: "Yobe" },
  { value: "zamfara", label: "Zamfara" },
  { value: "fct", label: "Federal Capital Territory (Abuja)" },
];


export const CATEGORIES : Array<{value: string; label: CategoryType}> = [
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
];
export const SUB_CATEGORIES = {
  "Tops": [
    "T-Shirts",
    "Polo Shirts",
    "Tank Tops",
    "Blouses",
    "Dress Shirts",
    "Henleys",
    "Sweatshirts",
    "Hoodies",
    "Crop Tops",
    "Tunics"
  ],
  "Bottoms": [
    "Jeans",
    "Chinos",
    "Dress Pants",
    "Joggers",
    "Leggings",
    "Shorts",
    "Cargo Pants",
    "Skirts",
    "Capris",
    "Overalls"
  ],
  "Dresses": [
    "Casual Dresses",
    "Evening Gowns",
    "Cocktail Dresses",
    "Maxi Dresses",
    "Mini Dresses",
    "Bodycon Dresses",
    "Wrap Dresses",
    "Shirt Dresses",
    "Sundresses",
    "Work Dresses"
  ],
  "Outerwear": [
    "Jackets",
    "Blazers",
    "Coats",
    "Trench Coats",
    "Parkas",
    "Bomber Jackets",
    "Leather Jackets",
    "Denim Jackets",
    "Cardigans",
    "Vests"
  ],
  "Shoes": [
    "Sneakers",
    "Boots",
    "Sandals",
    "Loafers",
    "Heels",
    "Flats",
    "Wedges",
    "Espadrilles",
    "Oxfords",
    "Slippers"
  ],
  "Bags": [
    "Backpacks",
    "Tote Bags",
    "Crossbody Bags",
    "Clutches",
    "Shoulder Bags",
    "Messenger Bags",
    "Satchels",
    "Duffle Bags",
    "Belt Bags",
    "Laptop Bags"
  ],
  "Accessories": [
    "Hats & Caps",
    "Scarves",
    "Gloves",
    "Belts",
    "Ties & Bowties",
    "Watches",
    "Jewelry",
    "Sunglasses",
    "Wallets",
    "Hair Accessories"
  ],
  "Underwear": [
    "Boxers",
    "Briefs",
    "Trunks",
    "Bras",
    "Panties",
    "Camisoles",
    "Thermal Underwear",
    "Shapewear",
    "Bralettes",
    "Lingerie"
  ],
  "Swimwear": [
    "Bikinis",
    "One-Piece Swimsuits",
    "Tankinis",
    "Swim Trunks",
    "Boardshorts",
    "Rash Guards",
    "Swim Dresses",
    "Monokinis",
    "Swim Skirts",
    "Cover-Ups"
  ],
  "Activewear": [
    "Gym Shorts",
    "Sports Bras",
    "Leggings",
    "Tracksuits",
    "Compression Wear",
    "Athletic T-Shirts",
    "Tank Tops",
    "Joggers",
    "Hoodies",
    "Yoga Pants"
  ],
  "Other": [
    "Custom Wear",
    "Uniforms",
    "Costumes",
    "Maternity Wear",
    "Workwear",
    "Ethnic Wear",
    "Festival Outfits",
    "Seasonal Clothing",
    "Vintage",
    "Miscellaneous"
  ]
}

export const ALPHA_SIZES = [
  "XS",
  "S",
  "M",
  "L",
  "XL",
  "XXL",
];
export const NUMERIC_SIZES = Array.from({ length: 50 }, (_, i) => `${i + 1}`);

export const formatPrice = (price: string, currency: string) => {
  let newPrice = ''
  if (price.length <= 3){
    newPrice = price
  }
  if (price.length > 3 && price.length < 5){
    newPrice = price.substring(0, 1) + ',' + price.substring(1)
  }
  if (price.length > 4 && price.length < 6){
    newPrice = price.substring(0, 2) + ',' + price.substring(2)
  }
  if (price.length > 5 && price.length < 7){
    newPrice = price.substring(0, 3) + ',' + price.substring(3)
  }
  if (price.length > 6 && price.length < 8){
    newPrice = price.substring(0, 1) + ',' + price.substring(1,4) + ',' + price.substring(4)
  }
  if(currency == '₦ NGN') return `₦${newPrice}`;
  if(currency == "$ USD") return `$${newPrice}`;
  if(currency == "€ EURO") return `€${newPrice}`;
}

export const formatProductCardImageUrl = (url: string, preset: {
  width: string; height?: string; c_fill: boolean; g_auto: boolean; q_auto: boolean; f_auto: boolean; e_sharpen: boolean; ar_?: string; dpr_auto?: boolean;
}) => {
  return url.substring(0,50) + `w_${preset.width}${preset.height? `,h_${preset.height}` : ''}${preset.ar_? `,ar_${preset.ar_}` : ''},${preset.c_fill ? 'c_fill' : ''},${preset.g_auto ? 'g_auto' : ''},${preset.q_auto ? 'q_auto' : ''},${preset.f_auto ? 'f_auto' : ''},${preset.e_sharpen ? 'e_sharpen' : ''}${preset.dpr_auto ? ',dpr_auto' : ''}/` + url.substring(50);
}
export const formatDescription = (desc: string, count: number = 50) => {
  const newDesc = desc.substring(0, count);
  if (desc.length > count ) return newDesc + '...'
  return desc;
}
export const formatProductLink = (category: string, subCategory: string, id: string) => {
    const formattedCategory = category.toLowerCase().split(' ').join('-');
    const formattedsubCategory = subCategory.toLowerCase().split(' ').join('-');
    return `/${formattedCategory}/${formattedsubCategory}/${id}`
  }
export const formatTitle = (title: string, count: number = 15) => {
    const newTitle = title.substring(0, count);
    if (title.length > count ) return newTitle + '...'
    return title;
 }

export const getStartOfDay = (date: Date) => {
  const dateRef = new Date(date.setHours(0, 0, 0, 0));
  return dateRef.getTime();
}

export const getEndOfDay = (date: Date) => {
  const dateRef = new Date(date.setHours(23, 59, 59, 999))
  return dateRef.getTime();
}