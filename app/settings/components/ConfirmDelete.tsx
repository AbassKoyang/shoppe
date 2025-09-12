import {motion} from 'framer-motion';
import { FaExclamation } from "react-icons/fa6";

const ConfirmDelete = ({open, deletePaymentMethod, closeModal, isDeleting} : {open: boolean; deletePaymentMethod: () => void; closeModal: () => void; isDeleting: boolean;}) => {
  return (
    <motion.div className={`${open ? 'flex' : 'hidden'} w-[100vw] h-dvh fixed top-0 left-0 items-center justify-center bg-transparent z-30`}>
        <div onClick={() => closeModal()} className='z-10 absolute top-0 left-0 w-full h-full bg-[#E9E9E9] opacity-75'></div>
        <motion.div 
        initial={{scale: 0}}
        animate={{scale: open? 1 : 0}}
        transition={{duration: 0.2, ease: 'easeInOut'}}
        className="w-full max-w-xs bg-[#F8FAFF] rounded-xl p-6 z-20 relative shadow-md">
            <div className='bg-white size-[80px] rounded-full absolute top-0 translate-y-[-40px] left-[50%] translate-x-[-50%] flex items-center justify-center'>
                <div className="bg-[#F9F9F9] size-[60px] rounded-full flex items-center justify-center">
                    <div className="bg-[#F1AEAE]  rounded-full border-2 border-white flex items-center justify-center p-1.5 shadow-md">
                    <FaExclamation className='text-white' />
                    </div>
                </div>
            </div>
            <h3 className='text-black font-raleway font-semibold text-xl mt-5 text-center max-w-[250px]'>Are you sure you want to delete this card?</h3>
            <p className='text-black font-nunitosans font-semibold text-xs mt-1 text-center'>You won't be able to restore your data</p>
            <div className="w-full flex items-center justify-center gap-3 mt-5">
                <button disabled={isDeleting} className='cursor-pointer px-6 py-1 rounded-lg bg-red-500 disabled:opacity-70 text-white' onClick={() => deletePaymentMethod()}>{isDeleting ? 'Deleting...' : 'Delete'}</button>
                <button disabled={isDeleting} className='cursor-pointer px-6 py-1 rounded-lg text-white disabled:opacity-70 bg-black' onClick={() => closeModal()}>Cancel</button>
            </div>
        </motion.div>
    </motion.div>
  )
}

export default ConfirmDelete