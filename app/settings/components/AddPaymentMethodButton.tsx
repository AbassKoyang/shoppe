import React from 'react';
import {Plus} from 'lucide-react'

const AddPaymentMethodButton = ({openModal} : {openModal: () => void}) => {
  return (
    <button onClick={openModal} className='cursor-pointer w-[12%] h-[155px] bg-dark-blue rounded-xl flex justify-center items-center'>
        <Plus fill='white' className='text-white' />
    </button>
  )
}

export default AddPaymentMethodButton