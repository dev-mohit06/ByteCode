import React, { useContext } from 'react'
import InputBox from '../components/input.component'
import googleIcon from '../imgs/google.png'
import { Link, useNavigate } from 'react-router-dom'
import AnimationWrapper from '../common/page-animation'
import ApiCaller, { endpoints, methods } from '../common/api-caller'
import toast, { Toaster } from 'react-hot-toast'
import { storeInSession } from '../common/session'
import { UserContext } from '../common/context'
import { authWithGoogle } from '../common/firebase'

const UserAuthForm = ({ type }) => {

  const { user: { access_token }, setUser } = useContext(UserContext);

  const navigate = useNavigate();

  {
    access_token ? window.location.href = '/' : null;
  }

  const handleSubmit = async (e) => {
    e.preventDefault();

    let formData = new FormData(authForm);
    let endpoint = endpoints[type];
    let method = methods.post;

    let loadingMessage = type == 'sign-in' ? 'Signing in...' : 'Account is being created...';
    let loading = toast.loading(loadingMessage);

    let promise = new ApiCaller(endpoint, method, formData);
    let data = await promise;

    if (data.success) {
      storeInSession("user", JSON.stringify(data.data));
      toast.dismiss(loading);
      toast.success(data.message);
      setTimeout(() => {
        setUser(data.data);
        navigate('/');
      }, 500);
    } else {
      toast.dismiss(loading);
      toast.error(data.message);
    }
  }

  const handleGoogleSubmit = async (e) => {
    e.preventDefault();
    try {
      let user = await authWithGoogle();

      let endpoint = endpoints['google-auth'];
      let method = methods.post;

      let formData = {
        access_token: user.accessToken,
      }

      let loadingMessage = type == 'sign-in' ? 'Signing in...' : 'Account is being created...';
      let loading = toast.loading(loadingMessage);

      let promise = new ApiCaller(endpoint, method, formData);
      let data = await promise;

      if (data.success) {
        toast.dismiss(loading);
        toast.success(data.message);

        storeInSession("user", JSON.stringify(data.data));
        
        setTimeout(() => {
          setUser(data.data);
          navigate('/');
        }, 500);
      } else {
        toast.dismiss(loading);
        toast.error(data.message);
      }

    } catch (error) {
      toast.error("Internal error occured");
      console.log(error);
    }
  }

  return (
    <AnimationWrapper keyValue={type}>
      <Toaster />
      <section className='h-cover flex items-center justify-center'>
        <form id='authForm' className='w-[80%] max-w-[400px]'>
          <h1 className='text-4xl font-gelasio capitalize text-center mb-24'>
            {type == "sign-in" ? "Welcome Back" : "Join Us Today"}
          </h1>

          {
            type != "sign-in"
              ?
              <InputBox
                type="text"
                name="fullname"
                placeholder="Full name"
                icon="user"
              />
              :
              null
          }

          <InputBox
            type="email"
            name="email"
            placeholder="Email"
            icon="envelope"
          />

          <InputBox
            type="password"
            name="password"
            placeholder="Password"
            icon="key"
          />

          <button className='btn-dark center mt-14' type='submit' onClick={handleSubmit}>
            {type.replace('-', ' ')}
          </button>

          <div className='relative w-full flex items-center gap-2 my-10 opacity-10 uppercase text-black font-bold'>
            <hr className="w-1/2 border-black" />
            <p>or</p>
            <hr className="w-1/2 border-black" />
          </div>

          <button onClick={handleGoogleSubmit} className='btn-dark flex items-center justify-center gap-4 w-[90%] center'>
            <img src={googleIcon} className='w-5' />
            continue with google
          </button>
          {
            type == 'sign-in'
              ?
              <p className='mt-6 text-dark-grey text-xl text-center '>
                Don't have an account? <Link to="/signup" className='underline text-black text-xl ml-1'>Sign up</Link>
              </p>
              :
              <p className='mt-6 text-dark-grey text-xl text-center '>
                Already have an account? <Link to="/signin" className='underline text-black text-xl ml-1'>Sign in</Link>
              </p>
          }
        </form>
      </section>
    </AnimationWrapper>
  )
}

export default UserAuthForm