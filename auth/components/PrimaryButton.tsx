import React from 'react'
type PrimaryButtonType = {
  primaryButtonFunction: (data: any) => void | Promise<void>;
  text: string | React.ReactNode;
  additionalStyles?: string | null;
  disabled?: boolean;
}
const PrimaryButton = ({primaryButtonFunction, text, additionalStyles, disabled} : PrimaryButtonType) => {
  return (
  <button disabled={disabled} onClick={() => primaryButtonFunction({})} className={`${additionalStyles} w-full cursor-pointer bg-dark-blue hover:opacity-90 transition-all duration-200 ease-in-out text-[#F3F3F3] text-[22px] font-extralight flex items-center justify-center rounded-xl px-18 py-3`}>
        {text}
    </button>
  )
}

export default PrimaryButton