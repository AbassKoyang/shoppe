import { CategoryType } from "@/services/products/types";
import { CountryType } from "@/services/users/types";
import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export const toastStyles = {
  error: {
      position: "top-right" as const,
      autoClose: false as const,
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
      position: "top-right" as const,
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
  if (price.length < 3){
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
export const formatDescription = (desc: string) => {
  const newDesc = desc.substring(0, 45);
  if (desc.length > 45 ) return newDesc + '...'
  return desc;
}
export const formatProductLink = (category: string, subCategory: string, id: string) => {
    const formattedCategory = category.toLowerCase().split(' ').join('-');
    const formattedsubCategory = subCategory.toLowerCase().split(' ').join('-');
    return `/${formattedCategory}/${formattedsubCategory}/${id}`
  }
export const formatTitle = (title: string) => {
    const newTitle = title.substring(0, 18);
    if (title.length > 18 ) return newTitle + '...'
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