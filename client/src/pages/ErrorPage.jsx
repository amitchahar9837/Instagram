import React from 'react'
import { Link } from 'react-router-dom'

export default function ErrorPage() {
  return (
    <div className='h-[calc(100vh-70px)] w-full flex justify-center items-center'>
      <div className="flex flex-col items-center gap-4">
            <h1 className='font-bold p-1 text-3xl md:text-4xl h-fit bg-gradient-to-r from-[#f9ce34] via-[#ee2a7b] to-[#6228d7] bg-clip-text text-transparent' >404 Page Not Found</h1>
            <Link to={'/'} className='px-3 py-2 bg-gray-100 text-red-600 rounded-sm '>Back to Home</Link>
      </div>
    </div>
  )
}
