import React, { useRef } from 'react'
import AnimationWrapper from '../common/page-animation'
import InputBox from '../components/input.component'
import toast, { Toaster } from 'react-hot-toast';
import ApiCaller, { endpoints, methods } from '../common/api-caller';

const ChangePassword = () => {

    let changePasswordForm = useRef();

    const handleSubmit = async (e) => {
        e.preventDefault();

        let form = new FormData(changePasswordForm.current);
        let formData = {};

        for(let [key,value] of form.entries()){
            formData[key] = value;
        }

        let { currentPassword, newPassword } = formData;

        if(!currentPassword.length || !newPassword.length){
            return toast.error("Please fill all the fields");
        }

        let loading = toast.loading("Changing password...");

        let promise = new ApiCaller(endpoints['change-password'],methods.post,formData);

        let data = await promise;
        toast.dismiss(loading);
        if(data.success){
            toast.success(data.message);
            changePasswordForm.current.reset();
        }else{
            toast.error(data.message);
        }
    }

    return (
        <AnimationWrapper>
            <Toaster/>
            <form ref={changePasswordForm}>
                <h1 className='max-md:hidden'>Change Password</h1>

                <div className='py-10 w-full md:max-w-[400px]'>
                    <InputBox
                        name={"currentPassword"}
                        type={"password"}
                        className="profile-edit-input"
                        placeholder={"Current Password"}
                        icon={"unlock"}
                    />

                    <InputBox
                        name={"newPassword"}
                        type={"password"}
                        className="profile-edit-input"
                        placeholder={"New Password"}
                        icon={"unlock"}
                    />

                    <button onClick={handleSubmit} className='btn-dark px-10' type='submit'>Change Password</button>
                </div>
            </form>
        </AnimationWrapper>
    )
}

export default ChangePassword