import React, { useEffect, useRef, useState } from 'react'

const InpageNavigation = ({ children,routes,defaultHidden,defaultActiveIndex = 0 }) => {

    let [inPageNavIndex, setInPageNavIndex] = useState(defaultActiveIndex);
    let activeTabRef = useRef(null);
    let activeTabLineRef = useRef(null);

    const changePageState = (e,i) => {
        let offsetLeft, offsetWidth;
        if(e.target){
            offsetLeft = e.target.offsetLeft;
            offsetWidth = e.target.offsetWidth;
        }else{
            offsetLeft = e.offsetLeft;
            offsetWidth = e.offsetWidth;
        }
        setInPageNavIndex(i);
        activeTabLineRef.current.style.left = `${offsetLeft}px`;
        activeTabLineRef.current.style.width = `${offsetWidth}px`;
    }

    useEffect(() => {
        changePageState(activeTabRef.current, inPageNavIndex);
    },[]);

    return (
        <>
            <div className='relative mb-8 bg-white border-b border-grey flex flex-nowrap overflow-x-auto'>
                {
                    routes.map((route, i) => {
                        return (
                            <button ref={ i == defaultActiveIndex ? activeTabRef : null} onClick={(e) => changePageState(e,i)} key={i} className={`p-4 px-5 capitalize ${inPageNavIndex == i ? "text-black" : "text-dark-grey"} ${defaultHidden.includes(route) ? "md:hidden" : ""}`}>
                                {route}
                            </button>
                        );
                    })
                }

                <hr ref={activeTabLineRef} className='absolute bottom-0 duration-300' />
            </div>

            {
                Array.isArray(children) ? children[inPageNavIndex] : children
            }
        </>
    )
}

export default InpageNavigation