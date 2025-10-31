import {motion} from 'framer-motion';
import { FaExclamation } from "react-icons/fa6";

const ConfirmDeleteModal = ({open, isDeleting, confirmDelete, closeModal} : {open: boolean; isDeleting: boolean; confirmDelete: () => void; closeModal: () => void;}) => {
  return (
    <motion.div className={`${open ? 'flex' : 'hidden'} w-[100vw] h-dvh fixed top-0 left-0 items-center justify-center bg-transparent z-200`}>
        <div onClick={() => closeModal()} className='z-10 absolute top-0 left-0 w-full h-full bg-white/35 backdrop-blur-sm'></div>
        <motion.div 
        initial={{scale: 0.5}}
        animate={{scale: open? 1 : 0.5}}
        transition={{duration: 0.2, ease: 'easeInOut'}}
        className="w-full max-w-xs bg-[#F8FAFF] rounded-xl p-6 z-20 relative shadow-md">
            <div className='bg-white size-[80px] rounded-full absolute top-0 translate-y-[-40px] left-[50%] translate-x-[-50%] flex items-center justify-center'>
                <div className="bg-[#F9F9F9] size-[60px] rounded-full flex items-center justify-center">
                    <div className="bg-dark-blue rounded-full border-2 border-white flex items-center justify-center p-1.5 shadow-md">
                    <FaExclamation className='text-white' />
                    </div>
                </div>
            </div>
            <div className="w-full flex flex-col items-center">
            <h3 className='text-black font-raleway font-semibold text-xl mt-5 text-center max-w-[250px]'>Are you sure you want to delete this product?</h3>
            <p className='text-black font-nunito-sans font-semibold text-[10px] mt-2 text-center max-w-[200px]'>This product will be deleted permanently.</p>
            </div>
            <div className="w-full flex items-center justify-center gap-3 mt-5">
                <button className='cursor-pointer px-6 py-1 rounded-lg bg-[#FF5790] disabled:opacity-70 text-white font-nunito-sans' onClick={() => confirmDelete()}>{isDeleting ? "Deleting..." : "Delete"}</button>
                <button className='cursor-pointer px-6 py-1 rounded-lg text-black disabled:opacity-70 bg-[#E7E8EB] font-nunito-sans' onClick={() => closeModal()}>Cancel</button>
            </div>
        </motion.div>
    </motion.div>
  )
}

export default ConfirmDeleteModal;