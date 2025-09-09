'use client';
import React from 'react'
import { ArrowRight, ChevronsUpDown } from "lucide-react"
import { Button } from "@/components/ui/button"
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
} from "@/components/ui/command"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { CountryType } from '@/services/users/types'


export default function CountryCombobox({ countries, value, onChange, placeholder } : {countries: CountryType[], value: CountryType | null; onChange: (country: CountryType) => void; placeholder: string;}) {
  const [open, setOpen] = React.useState(false)

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger className='p-0 m-0' asChild>
        <Button
          variant='secondary'
          role="combobox"
          aria-expanded={open}
          className="cursor-pointer w-full justify-between bg-transparent hover:bg-transparent shadow-none py-1 px-0 h-0"
        >
          <p className={`${value ? 'text-dark-blue' : 'text-black'} text-[20px] font-bold font-raleway`}>{value ? value.label : placeholder}</p>
          <span className='size-[30px] rounded-full flex items-center justify-center text-white bg-dark-blue'>
            <ArrowRight className='text-white size-[18px]' />
          </span>
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-full p-0">
        <Command>
          <CommandInput placeholder="Search..." />
          <CommandEmpty>No option found.</CommandEmpty>
          <CommandGroup>
            {countries.map((country) => (
              <CommandItem
                key={country.value}
                onSelect={() => {
                  onChange(country)
                  setOpen(false)
                }}
              >
                {country.label}
              </CommandItem>
            ))}
          </CommandGroup>
        </Command>
      </PopoverContent>
    </Popover>
  )
}
