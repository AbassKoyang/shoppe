import LoginPageContent from '@/components/LoginPageContent'
import { LoaderCircle } from 'lucide-react'
import React, { Suspense } from 'react'

const page = () => {
  return (
    <Suspense fallback={<LoaderCircle className="animate-spin h-8 w-8 text-blue-500" />
    }>
      <LoginPageContent />
    </Suspense>
  )
}

export default page