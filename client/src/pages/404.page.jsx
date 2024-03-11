import React from 'react'
import $404 from '../imgs/404.png'
import $404Ultra from '../imgs/404-ultra.png'
import { Link } from 'react-router-dom'

const PageNotFound = () => {
  return (
    <section className='h-screen w-screen relative p-10 flex flex-col justify-between text-center' style={{
      backgroundImage : `url(${$404Ultra})`,
      backgroundPosition: 'center',
      backgroundSize: 'cover',
    }}>

      <h1 className='text-4xl mt-10 font-inter font-bold md:text-5xl'>Page not found!!</h1>

      <Link to={`/`} className='btn-dark flex items-center justify-center gap-4 w-auto center'>
            <i className='fi fi-rr-arrow-left w-5' />
            Go back
      </Link>

    </section>    
  )
}

export default PageNotFound