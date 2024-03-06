import React, { useContext } from 'react'
import AnimationWrapper from '../common/page-animation'
import { Link } from 'react-router-dom'
import { UserContext } from '../common/context';
import { removeFromSession } from '../common/session';

const UserNavigationPanel = () => {

    const { user: { username }, setUser } = useContext(UserContext);

    const handelSignout = (e) => {
        e.preventDefault();
        removeFromSession("user");
        setUser({
            access_token: null,
        });
    }
    return (
        <AnimationWrapper
            className={`absolute right-0 z-50`}
            transition={{
                duration: .2
            }}
        >
            <div className="bg-white absolute right-0 border border-grey w-60 overflow-hidden duration-200">

                <Link to={"/editor"} className='flex gap-2 link md:hidden pl-8 py-4'>
                    <i className="fi fi-rr-file-edit"></i>
                    <p>Write</p>
                </Link>

                <Link to={`/user/${username}`} className='link pl-8 py-4'>
                    <p>Profile</p>
                </Link>

                <Link to={`/dashboard/blogs`} className='link pl-8 py-4'>
                    <p>Dashboard</p>
                </Link>

                <Link to={`/settigns/edit-profile`} className='link pl-8 py-4'>
                    <p>Settings</p>
                </Link>

                <span className='absolute border-t border-grey w-[100%]'></span>

                <button className='text-left p-4 hover:bg-grey w-full pl-8 py-4' onClick={handelSignout}>
                    <h1 className='font-bold text-xl mg-1'>Sign Out</h1>
                    <p className='text-dark-grey'>@{username}</p>
                </button>

            </div>
        </AnimationWrapper>
    )
}

export default UserNavigationPanel