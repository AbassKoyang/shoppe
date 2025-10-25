import Link from 'next/link'
import React from 'react'

const EmptySales = ({title, desc}:{title: string; desc: string}) => {
  return (
    <div className="w-full mt-6 flex flex-col items-center justify-center h-[60vh]">
                <svg width="150" height="150" viewBox="0 0 150 150" fill="none" xmlns="http://www.w3.org/2000/svg">
                <g filter="url(#filter0_d_2_7103)">
                <path d="M75 139C112.003 139 142 109.003 142 72C142 34.9969 112.003 5 75 5C37.9969 5 8 34.9969 8 72C8 109.003 37.9969 139 75 139Z" fill="white"/>
                </g>
                <path d="M53 55.0005H97C99.7614 55.0005 102 57.2391 102 60.0005L104 98.0005C104 100.762 101.761 103 99 103H51C48.2386 103 46 100.762 46 98.0005L48 60.0005C48 57.2391 50.2386 55.0005 53 55.0005Z" fill="#004CFF"/>
                <path d="M59.919 65.691V51.8111C59.919 46.3602 64.466 41.9414 70.0751 41.9414H79.3169C84.9259 41.9414 89.473 46.3602 89.473 51.8111V65.691" stroke="white" stroke-width="5" stroke-linecap="round"/>
                <path d="M59.919 53.691V51.8111C59.919 46.3602 64.466 41.9414 70.0751 41.9414H79.3169C84.9259 41.9414 89.473 46.3602 89.473 51.8111V53.691" stroke="#004CFF" stroke-width="5" stroke-linecap="round"/>
                <path d="M79.4305 72.1568C78.4739 71.8982 77.1296 71.6914 75.9404 71.6914C71.1318 71.6914 69.167 74.1474 69.167 76.7327C69.167 78.9301 70.2528 80.4813 73.6395 82.808C75.9921 84.4109 77.0262 85.3157 77.0262 86.3757C77.0262 87.4873 76.0438 88.4956 74.0531 88.4956C72.3727 88.4956 70.3045 88.0302 69.4255 87.6941L69.3738 91.0808C70.3045 91.3652 72.5278 91.6754 73.8205 91.6754C78.0344 91.6754 80.8265 89.4004 80.8265 86.2205C80.8265 83.868 79.0944 82.1875 76.2764 80.2228C73.9239 78.594 72.9156 77.7409 72.9156 76.7068C72.9156 75.5951 73.7946 74.8713 75.9404 74.8713C77.0779 74.8713 78.4739 75.1298 79.3787 75.4917L79.4305 72.1568Z" fill="white"/>
                <defs>
                <filter id="filter0_d_2_7103" x="0" y="0" width="150" height="150" filterUnits="userSpaceOnUse" color-interpolation-filters="sRGB">
                <feFlood flood-opacity="0" result="BackgroundImageFix"/>
                <feColorMatrix in="SourceAlpha" type="matrix" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0" result="hardAlpha"/>
                <feOffset dy="3"/>
                <feGaussianBlur stdDeviation="4"/>
                <feColorMatrix type="matrix" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0.160784 0"/>
                <feBlend mode="normal" in2="BackgroundImageFix" result="effect1_dropShadow_2_7103"/>
                <feBlend mode="normal" in="SourceGraphic" in2="effect1_dropShadow_2_7103" result="shape"/>
                </filter>
                </defs>
                </svg>

              <h5 className='max-w-[300px] text-center text-[17px] font-semibold font-raleway mt-4'>{title}</h5>
              <p className='max-w-[280px] text-center text-[12px] font-normal font-nunito-sans text-black/80 mt-2'>{desc}</p>
              <Link href='/' className='bg-dark-blue rounded-4xl px-4 py-2 text-white mt-4 cursor-pointer font-raleway'>Start Selling</Link>
              </div>
  )
}

export default EmptySales;