import React from 'react';
import {motion} from 'framer-motion';

const MarkAsDeliveredInProgressModal = ({open} : {open: boolean;}) => {
  return (
    <motion.div className={`${open ? 'flex' : 'hidden'} w-[100vw] h-dvh fixed top-0 left-0 items-center justify-center bg-transparent z-200`}>
        <div  className='z-10 absolute top-0 left-0 w-full h-full bg-white/35 backdrop-blur-sm'></div>
        <motion.div 
        initial={{scale: 0}}
        animate={{scale: open? 1 : 0}}
        transition={{duration: 0.2, ease: 'easeInOut'}}
        className="w-full max-w-xs bg-[#F8FAFF] rounded-xl p-6 z-20 relative shadow-md">
            <div className='bg-white size-[80px] rounded-full absolute top-0 translate-y-[-40px] left-[50%] translate-x-[-50%] flex items-center justify-center'>
                <div className="bg-[#F9F9F9] size-[60px] rounded-full flex items-center justify-center">
                <svg className='animate-spin' width="50" height="50" viewBox="0 0 50 50" fill="none" xmlns="http://www.w3.org/2000/svg">
                <mask 
                id="mask0_0_5913" 
                style={{ maskType: 'alpha' }} // ← Object syntax
                maskUnits="userSpaceOnUse" 
                x="0" 
                y="0" 
                width="50" 
                height="50"
                >
                <rect width="50" height="50" fill="black"/>
                </mask>
                <g mask="url(#mask0_0_5913)">
                <path fillRule="evenodd" clipRule="evenodd" d="M49.9999 25C49.9999 38.8071 38.807 50 24.9999 50C11.1928 50 -0.00012207 38.8071 -0.00012207 25C-0.00012207 11.1929 11.1928 0 24.9999 0C38.807 0 49.9999 11.1929 49.9999 25ZM44.9999 25C44.9999 36.0457 36.0456 45 24.9999 45C13.9542 45 4.99988 36.0457 4.99988 25C4.99988 13.9543 13.9542 5 24.9999 5C36.0456 5 44.9999 13.9543 44.9999 25Z" fill="#E5EBFC"/>
                <path fillRule="evenodd" clipRule="evenodd" d="M24.9999 0.00294018V0.000976562C38.807 0.000976562 49.9999 11.1939 49.9999 25.001C49.9999 38.8081 38.807 50.001 24.9999 50.001V49.999C24.9667 50.0003 24.9334 50.001 24.8999 50.001C23.5192 50.001 22.3999 48.8817 22.3999 47.501C22.3999 46.1203 23.5192 45.001 24.8999 45.001C24.9334 45.001 24.9667 45.0016 24.9999 45.0029V45.001C36.0456 45.001 44.9999 36.0467 44.9999 25.001C44.9999 13.9553 36.0456 5.00098 24.9999 5.00098V4.99901C24.9667 5.00032 24.9334 5.00098 24.8999 5.00098C23.5192 5.00098 22.3999 3.88169 22.3999 2.50098C22.3999 1.12026 23.5192 0.000976562 24.8999 0.000976562C24.9334 0.000976562 24.9667 0.00163555 24.9999 0.00294018Z" fill="#004BFE"/>
                <path fillRule="evenodd" clipRule="evenodd" d="M46.4952 12.2302L46.4969 12.2292C53.608 24.0642 49.7786 39.4231 37.9436 46.5343C26.1086 53.6455 10.7497 49.8161 3.63849 37.9811L3.64018 37.9801C3.62197 37.9523 3.60424 37.9241 3.58699 37.8954C2.87587 36.7119 3.25881 35.176 4.44231 34.4649C5.62581 33.7537 7.16171 34.1367 7.87283 35.3202C7.89007 35.3489 7.90668 35.3778 7.92265 35.4069L7.92433 35.4059C13.6133 44.8739 25.9004 47.9374 35.3684 42.2485C44.8364 36.5595 47.9 24.2724 42.211 14.8044L42.2127 14.8034C42.1945 14.7756 42.1768 14.7474 42.1595 14.7187C41.4484 13.5352 41.8313 11.9993 43.0148 11.2881C44.1983 10.577 45.7342 10.96 46.4454 12.1435C46.4626 12.1722 46.4792 12.2011 46.4952 12.2302Z" fill="#004BFE"/>
                </g>
                </svg>

                </div>
            </div>
            <h3 className='text-black font-raleway font-semibold text-xl mt-5 text-center max-w-[250px]'>Marking order as delivered</h3>
            <p className='text-black font-nunitosans font-semibold text-xs mt-1 text-center'>Please, wait a few moments</p>
        </motion.div>
    </motion.div>
  )
}

export default MarkAsDeliveredInProgressModal