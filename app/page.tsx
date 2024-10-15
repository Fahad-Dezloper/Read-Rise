import React from 'react'
import ImagePasteComponent from './components/ImagePasteComponent'
// import AddBookForm from './components/AddBookForm'

const page = async () => {
  return ( 
    <div className="flex w-full h-screen items-center justify-center">
      <h1 className='text-3xl font-semibold font-mono pb-11'>R2 Library Management System</h1>
      {/* <AddBookForm /> */}
      <ImagePasteComponent />
    </div>
  )
}

export default page