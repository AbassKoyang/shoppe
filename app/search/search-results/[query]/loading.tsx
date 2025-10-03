import { LoaderCircle } from 'lucide-react'
import React from 'react'

const loading = () => {
  return (
    <div className="min-h-screen flex items-center justify-center bg-white">
        <div className="flex flex-col items-center gap-4">
          <p className="text-gray-600">Loading...</p>
          <LoaderCircle className="animate-spin h-8 w-8 text-blue-500" />
        </div>
      </div>
  )
}

export default loading