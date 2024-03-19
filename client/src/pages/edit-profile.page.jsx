import { useEffect, useContext, useState, useRef } from 'react'
import { UserContext } from '../common/context'
import ApiCaller, { endpoints, methods } from '../common/api-caller'
import AnimationWrapper from '../common/page-animation';
import Loader from '../components/loader.component';
import toast, { Toaster } from 'react-hot-toast';
import InputBox from '../components/input.component';
import { uploadImage } from '../common/aws';
import { storeInSession } from '../common/session';

const profile_ds = {
    personal_info: {
        fullname: "",
        username: "",
        profile_img: "",
        mail: "",
        bio: ""
    },
    social_links: {}
}

const bioLimit = 150;

const EditProfile = () => {

    let { user, user: { access_token, username }, setUser } = useContext(UserContext);
    const [profile, setProfile] = useState(profile_ds);
    const [updateProfileImg, setUpdateProfileImg] = useState(null);
    const [charactersLeft, setCharactersLeft] = useState(bioLimit);

    let profileImgRef = useRef();
    let editProfileFormRef = useRef();

    let { personal_info: { fullname, profile_img, username: profile_username, email, bio } } = profile;

    useEffect(() => {
        (async () => {
            if (access_token) {
                let promise = new ApiCaller(endpoints['user-profile'], methods.post, {
                    userId: username
                });

                let data = (await promise).data;
                setProfile(data);
            }
        })()
    }, [access_token]);

    const handleImagePreview = (e) => {
        let img = e.target.files[0];
        if (img) {
            profileImgRef.current.src = URL.createObjectURL(img);
            setUpdateProfileImg(img);
        }
    }

    const handleImageUpload = async (e) => {
        e.preventDefault();

        if (updateProfileImg) {
            let loadingToast = toast.loading('Uploading Image...');
            e.target.setAttribute("disabled", true);

            let url = await uploadImage(updateProfileImg,"profile_images");

            let promise = new ApiCaller(endpoints['update-profile-img'], methods.post, {
                profile_img: url
            });

            let data = await promise;
            toast.dismiss(loadingToast);
            if (data.success) {
                toast.success(data.message);
                let newUser = { ...user, profile_img: url };
                storeInSession("user", JSON.stringify(newUser));
                setUser(newUser);
                setUpdateProfileImg(null);
                e.target.removeAttribute("disabled");
            } else {
                toast.error(data.message);
            }
        }
    }

    const handleSubmit = async (e) => {
        e.preventDefault();

        let loading = toast.loading('Updating Profile...');
        let form = new FormData(editProfileFormRef.current);

        let formData = {};
        for (let [key, value] of form.entries()) {
            formData[key] = value;
        }

        let promise = new ApiCaller(endpoints['update-profile'], methods.post, formData);
        
        let data = await promise;
        toast.dismiss(loading);

        if (data.success) {
            toast.success(data.message);
            let newUser = { ...user, username: formData.username };
            storeInSession("user", JSON.stringify(newUser));
            setUser(newUser);
        } else {
            toast.error(data.message);
        }
    }

    return (
        <AnimationWrapper>
            {
                profile
                    ?
                    <form ref={editProfileFormRef}>
                        <Toaster />

                        <h1 className='max-md:hidden'>Edit Profile</h1>

                        <div className='flex flex-col lg:flex-row items-start py-10 gap-8 lg:gap-10'>
                            <div className="max-lg:center mb-5">
                                <label htmlFor="uploadImg" id='profileImgLable' className='relative block w-48 h-48 bg-grey rounded-full overflow-hidden'>
                                    <div className='w-full h-full absolute top-0 left-0 flex items-center justify-center text-white bg-black/80 opacity-0 hover:opacity-100 cursor-pointer'>
                                        Upload Image
                                    </div>
                                    <img src={profile_img} ref={profileImgRef} alt={fullname} />
                                </label>
                                <input type="file" name="" id="uploadImg" accept='.jpeg,.png,.jpg' hidden onChange={handleImagePreview} />

                                <button className='btn-light mt-5 max-lg:center w-full px-10' onClick={handleImageUpload}>Upload</button>
                            </div>

                            <div className='w-full'>
                                <div className="grid grid-cols-1 md:grid-cols-2 md:gap-5">
                                    <div>
                                        <InputBox
                                            name={"fullname"}
                                            type={"text"}
                                            value={fullname}
                                            placeholder={"Full Name"}
                                            disabled={true}
                                            icon={"user"}
                                        />
                                    </div>

                                    <div>
                                        <InputBox
                                            name={"email"}
                                            type={"email"}
                                            value={email}
                                            placeholder={"Email"}
                                            disabled={true}
                                            icon={"envelope"}
                                        />
                                    </div>
                                </div>
                                <InputBox
                                    name={"username"}
                                    type={"text"}
                                    value={profile_username}
                                    placeholder={"Username"}
                                    icon={"at"}
                                />
                                <p className='text-dark-grey -mt-3'>Username will use to search user and will be visible to all users</p>

                                <textarea
                                    name='bio'
                                    maxLength={bioLimit}
                                    defaultValue={bio}
                                    className='input-box h-64 lg:h-40 resize-none leading-7 mt-5 pl-5'
                                    placeholder='Bio'
                                    onChange={(e) => setCharactersLeft(bioLimit - e.target.value.length)}
                                >
                                </textarea>
                                <p className='mt-1 text-dark-grey'>{charactersLeft} characters left</p>

                                <p className='my-6 text-dark-grey'>Add your social handles</p>

                                <div className='md:grid md:grid-cols-2 gap-x-6'>
                                    {
                                        Object.keys(profile.social_links).map((key, index) => {
                                            let link = profile.social_links[key];

                                            let icon = key != "website" ? key : "globe";

                                            return (
                                                <InputBox
                                                    key={index}
                                                    name={key}
                                                    type={"text"}
                                                    value={link}
                                                    placeholder={"https://"}
                                                    icon={icon != "globe" ? icon : "globe"}
                                                    is_brand={icon != "globe" ? true : false}
                                                />
                                            )
                                        })
                                    }
                                </div>

                                <button onClick={handleSubmit} className='btn-dark w-auto px-10' type='submit'>Update</button>
                            </div>
                        </div>
                    </form>
                    :
                    <Loader />
            }
        </AnimationWrapper>
    )
}

export default EditProfile