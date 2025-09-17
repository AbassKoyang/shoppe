import { Search } from "lucide-react"

const HomeHeader = () => {
  return (
    <header className="w-full flex items-center justify-between py-4">
        <h3 className="font-bold font-raleway text-[30px]">Shop</h3>
        <div className="w-[235px] h-[36px] rounded-2xl bg-[#F8F8F8] flex items-center justify-between overflow-hidden">
          <input type="text" placeholder="Search" className="h-full w-[80%] pl-4 bg-transparent placeholder:text-[#C7C7C7]" />
          <button className="flex items-center justify-center mr-2">
            <Search strokeWidth={1} className="size-[19px] text-dark-blue" />
          </button>
        </div>
    </header>
  )
}

export default HomeHeader