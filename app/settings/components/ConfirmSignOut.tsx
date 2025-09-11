import {motion} from 'framer-motion';
const ConfirmSignout = ({open, signOut, closeModal, isSigningOut} : {open: boolean; signOut: () => void; closeModal: () => void; isSigningOut: boolean;}) => {
  return (
    <motion.div className={`${open ? 'flex' : 'hidden'} w-[100vw] h-dvh fixed top-0 left-0 items-center justify-center bg-transparent z-30`}>
        <div onClick={() => closeModal()} className='z-10 absolute top-0 left-0 w-full h-full bg-[#E9E9E9] opacity-75'></div>
        <motion.div 
        initial={{scale: 0}}
        animate={{scale: open? 1 : 0}}
        transition={{duration: 0.2, ease: 'easeInOut'}}
        className="w-full max-w-xs bg-[#F8FAFF] rounded-xl p-6 z-20">
            <h3 className='text-black font-raleway font-semibold text-xl'>Are you sure you want to sign out?</h3>
            <div className="flex items-center gap-3 mt-3">
                <button disabled={isSigningOut} className='cursor-pointer px-3 py-1 rounded-sm bg-red-500 disabled:opacity-70 text-white' onClick={() => signOut()}>{isSigningOut ? 'Signing Out...' : 'Sign Out'}</button>
                <button disabled={isSigningOut} className='cursor-pointer px-3 py-1 rounded-sm text-black/70 disabled:opacity-70' onClick={() => closeModal()}>Cancel</button>
            </div>
        </motion.div>
    </motion.div>
  )
}

export default ConfirmSignout