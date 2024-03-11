import React, { useContext, useState, useEffect } from 'react';
import { Link, useParams } from 'react-router-dom';
import ApiCaller, { endpoints, methods } from '../common/api-caller';
import Loader from '../components/loader.component';
import { UserContext } from '../common/context';
import AboutPage from '../components/about.component';
import { filterPageData } from '../common/filter-pagination-data';
import InpageNavigation from '../components/inpage-navigation.component';
import AnimationWrapper from '../common/page-animation';
import BlogPostCard from '../components/blog-post.component';
import NoDataMessage from '../components/nodata.component';
import AboutUser from '../components/about.component';
import LoadMoreDataBtn from '../components/load-more.component';

export const profileDs = {
  personal_info: {
    fullname: "",
    username: "",
    profile_img: "",
    bio: ""
  },
  account_info: {
    total_posts: 0,
    total_blogs: 0,
    total_reads: 0,
  },
  social_links: {},
  joinedAt: ""
}

const ProfilePage = () => {
  const { id: profileId } = useParams();
  const [profile, setProfile] = useState(profileDs);
  const [loading, setLoading] = useState(true);
  const [blogs, setBlogs] = useState(null);
  const [profileLoaded, setProfileLoaded] = useState("");

  const { user: { username } } = useContext(UserContext);

  useEffect(() => {
    if (profileId !== profileLoaded) {
      setBlogs(null);
    }

    if (blogs === null) {
      resetStates();
      fetchUserProfile();
    }
  }, [profileId, blogs]);

  const fetchUserProfile = async () => {
    setLoading(true);
    const endpoint = endpoints['user-profile'];
    const promise = new ApiCaller(endpoint, methods.post, { userId: profileId });
    const user = (await promise).data;
    if(user){
      setProfile(user);
      setProfileLoaded(profileId);
      getBlogs({ user_id: user._id });
      setLoading(false);
    }else{
      setLoading(false);
    }
  }

  const getBlogs = async ({ page = 1, user_id }) => {
    user_id = user_id === undefined ? blogs?.user_id : user_id;
    const endpoint = endpoints['search-blogs'];
    const promise = new ApiCaller(endpoint, methods.post, { page, author: user_id });
    const data = (await promise).data;
    const formattedData = await filterPageData({
      state: blogs,
      data,
      page,
      countRoute: endpoints['all-search-blogs-count'],
      data_to_send: { author: user_id }
    });
    formattedData.user_id = user_id;
    setBlogs(formattedData);
  }

  const resetStates = () => {
    setProfile(profileDs);
    setBlogs(null);
    setLoading(true);
    setProfileLoaded("");
  }

  const { personal_info: { fullname, username: profile_username, profile_img, bio }, account_info: { total_posts, total_reads }, social_links, joinedAt } = profile;

  return (
    <>
      {!loading
        ?
          profile_username.length
          ?
          (
            <section className='h-cover md:flex flex-row-reverse items-start gap-5 min-[1100px]:gap-12'>
              <div className='flex flex-col max-md:items-center gap-5 min-w-[250px]'>
                <img src={profile_img} alt={fullname} className='w-48 h-48 bg-grey rounded-full md:w-32 md:h-32' />
                <h1 className='text-2xl font-medium'>@{profile_username}</h1>
                <p className="text-xl capitalize h-6">{fullname}</p>
                <p>{total_posts.toLocaleString()} Blogs - {total_reads.toLocaleString()} - Reads</p>
                {username === profile_username && (
                  <div className="flex gap-4 mt-2">
                    <Link to={`/settings/edit-profile`} className='btn-light rounded-md'>
                      Edit Profile
                    </Link>
                  </div>
                )}
                <AboutPage bio={bio} social_links={social_links} joinedAt={joinedAt} className={"max-md:hidden"} />
              </div>

              <div className="max-md:mt-12 w-full">
                <InpageNavigation routes={["Blogs Published", "About"]} defaultHidden={["About"]}>

                  {blogs ? (
                    blogs.results.length ? (
                      <>
                        {blogs.results.map((blog, i) => (
                          <AnimationWrapper
                            key={i}
                            transition={{
                              duration: 1,
                              delay: i * 0.1
                            }}
                          >
                            <BlogPostCard key={i} categorySearch={{ tag: blogs, search: false }} blog={blog} author={blog.author.personal_info} />
                          </AnimationWrapper>
                        ))}
                        <LoadMoreDataBtn state={blogs} fetchDatFun={getBlogs} />
                      </>
                    ) : (
                      <NoDataMessage message="No blog published" />
                    )
                  ) : (
                    <Loader />
                  )}

                  <AboutUser bio={bio} social_links={social_links} joinedAt={joinedAt} />

                </InpageNavigation>
              </div>
            </section>
          )
          :
          <NoDataMessage message={"User not found!!"} />
        :
        (
          <Loader />
        )}
    </>
  )
}

export default ProfilePage;