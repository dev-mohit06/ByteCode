import { useContext, useEffect, useState } from 'react'
import Logo from '../imgs/logo.png';
import darkLogo from '../imgs/logo-dark.png';
import lightLogo from '../imgs/logo-light.png';
import { Link, useNavigate } from 'react-router-dom';
import { UserContext } from '../common/context';
import UserNavigationPanel from './user-navigation.component';
import { searchParams } from '../pages/search.page';
import ApiCaller, { endpoints } from '../common/api-caller';
import { ThemeContext } from '../common/theme-context';
import { storeInSession } from '../common/session';
const Navbar = () => {

  const {theme,setTheme} = useContext(ThemeContext);

  const [searchBoxVisibliity, setSearchBoxVisibliity] = useState(false);
  const [userNavPanel, setUserNavPanel] = useState(false);
  const navigate = useNavigate();

  const { user, user: { access_token, profile_img, username, fullname, new_notifications_available }, setUser } = useContext(UserContext);

  useEffect(() => {
    (async () => {
      if (access_token) {
        let endpoint = endpoints['get-new-notifications'];
        let method = 'get';

        let promise = new ApiCaller(endpoint, method);
        let data = (await promise).data;
        setUser({ ...user, new_notifications_available: data.new_notifications_available });
      }
    })()
  }, [access_token])

  const handleSearchClick = () => {
    setSearchBoxVisibliity((prev) => !prev);
  }

  const handleProfileClick = () => {
    setUserNavPanel((prev) => !prev);
  }

  const handelBlur = () => {
    setTimeout(() => {
      setUserNavPanel(false);
    }, 200);
  }

  const handleSearch = (e) => {
    if (e.key === 'Enter') {
      let query = e.target.value;
      navigate(`/search/${query}`)
    }
  }

  const handleChange = (e) => {
    e.target.value == '' ? navigate('/') : null;
  }

  const changeTheme = (e) => {
    let newTheme = theme == 'light' ? 'dark' : 'light';
    setTheme(newTheme);
    storeInSession("theme", newTheme);

    document.body.setAttribute('data-theme', newTheme);
  }

  let searchBoxClass = searchBoxVisibliity ? 'show' : 'hide';
  return (
    <nav className='navbar z-50'>
      <Link to="/" className="flex-none w-10">
        <img className='flex-none w-10' src={theme == "light" ? darkLogo : lightLogo} alt={import.meta.env.VITE_APP_NAME} />
      </Link>

      <div className={`absolute bg-white w-full left-0 top-full mt-0 border-b border-grey py-4 px-[5vw] md:border-0 md:block md:relative md:show md:inset-0 md:p-0 md:w-auto ${searchBoxClass}`}>
        <input
          type="text"
          placeholder='Search'
          className='w-full md:w-auto bg-grey p-4 pl-6 pr-[12%] md:pr-6 rounded-full placeholder:text-dark-grey md:pl-12'
          onKeyDown={handleSearch} onChange={handleChange} defaultValue={searchParams ? searchParams : ""} />

        <i className="fi fi-rr-search absolute right-[10%] md:pointer-events-none md:left-5 top-1/2 -translate-y-1/2 text-xl text-dark-grey"></i>
      </div>

      <div className="flex items-center gap-3 md:gap-6 ml-auto">
        <button onClick={handleSearchClick} className='md:hidden bg-grey w-12 h-12 rounded-full flex items-center justify-center'>
          <i className="fi fi-rr-search text-xl"></i>
        </button>

        <Link to={"/editor"} className='hidden md:flex gap-2 link'>
          <i className="fi fi-rr-file-edit"></i>
          <p>Write</p>
        </Link>

        <button className='w-12 h-12 rounded-full bg-grey relative hover:bg-black/10' onClick={changeTheme}>
          <i className='fi fi-rr-moon-stars'></i>
        </button>

        {
          access_token
            ?
            <>
              <Link to={"/account/dashboard/notification"}>
                <button className='w-12 h-12 rounded-full bg-grey relative hover:bg-black/10'>
                  <i className='fi fi-rr-bell text-2xl block mt-1'></i>
                  {
                    new_notifications_available
                      ?
                      <span className='bg-red w-3 h-3 rounded-full absolute z-10 top-2 right-2'></span>
                      :
                      ""
                  }
                </button>
              </Link>

              <div className="relative mt-1" onClick={handleProfileClick} onBlur={handelBlur}>
                <button className="w-12 h-12">
                  <img src={profile_img} alt={username + "-" + fullname} className='w-full h-full object-cover rounded-full' />
                </button>


                {
                  userNavPanel ? <UserNavigationPanel /> : null
                }

              </div>

            </>
            :
            <>
              <Link className='btn-dark py-2' to={"/signin"}>
                Sign In
              </Link>
              <Link className='btn-light py-2' to={"/signup"}>
                Sign Up
              </Link>
            </>
        }
      </div>
    </nav>
  )
}

export default Navbar