import React from 'react';

export function Reports() {
  return (
    <div className="flex items-center justify-center h-full">
       <div className="text-center p-8 bg-white rounded-lg shadow-sm">
         <h2 className="text-xl font-bold mb-2">Reports Module</h2>
         <p className="text-gray-500">Select parameters to generate daily/monthly exports or dump to Excel/PDF.</p>
         <button className="mt-4 px-4 py-2 bg-[#0a6ed1] text-white rounded hover:bg-[#085ab0]">
            Export Daily Dump (.xlsx)
         </button>
       </div>
    </div>
  )
}
