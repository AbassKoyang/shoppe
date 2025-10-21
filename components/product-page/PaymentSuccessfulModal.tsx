import {motion} from 'framer-motion';
import { BsCheck } from 'react-icons/bs';
import { FaExclamation } from "react-icons/fa6";

const PaymentSuccesfulModal = ({open, redirect, closeModal} : {open: boolean; redirect: () => void; closeModal: () => void;}) => {
  return (
    <motion.div className={`${open ? 'flex' : 'hidden'} w-[100vw] h-dvh fixed top-0 left-0 items-center justify-center bg-transparent z-200`}>
        <div onClick={closeModal} className='z-10 absolute top-0 left-0 w-full h-full bg-white/35 backdrop-blur-sm'></div>
        <motion.div 
        initial={{scale: 0}}
        animate={{scale: open? 1 : 0}}
        transition={{duration: 0.2, ease: 'easeInOut'}}
        className="w-full max-w-xs bg-[#F8FAFF] rounded-xl p-6 z-20 relative shadow-md">
            <div className='bg-white size-[80px] rounded-full absolute top-0 translate-y-[-40px] left-[50%] translate-x-[-50%] flex items-center justify-center'>
                <div className="bg-dark-blue size-[60px] rounded-full flex items-center justify-center">
                    <div className="bg-dark-blue rounded-full flex items-center justify-center p-1.5 shadow-md">
                    <BsCheck size={18} className='text-white size-[18px]' />
                    </div>
                </div>
            </div>
            <h3 className='text-black font-raleway font-semibold text-xl mt-5 text-center max-w-[250px]'>Done!</h3>
            <p className='text-black font-nunito-sans font-semibold text-xs mt-1 text-center'>You card has been successfully charged</p>
            <div className="w-full flex items-center justify-center mt-5">
                <button className='cursor-pointer px-12 py-3 rounded-lg bg-[#202020] disabled:opacity-70 text-white font-nunito-sans' onClick={() => redirect()}>View Order</button>
            </div>
        </motion.div>
    </motion.div>
  )
}

export default PaymentSuccesfulModal;