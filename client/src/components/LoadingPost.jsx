import React from 'react'

export default function LoadingPost() {
const loadingPost = new Array(9).fill(null);
  return (
    <div className='w-full max-w-xl h-[calc(100vh-100px)] rounded-md shadow-lg flex flex-col gap-4 p-4'>
       <div className="flex gap-4 items-center">
              <div className="h-10 w-10 rounded-full bg-slate-100 animate-pulse"></div>
              <div className="h-10 w-32 rounded bg-slate-100 animate-pulse"></div>
            </div>
        <div className='w-full flex-1 bg-slate-100 animate-pulse'></div>
    </div>
  )
}
