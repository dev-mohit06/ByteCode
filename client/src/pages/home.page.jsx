import { useEffect, useState } from 'react'
import InpageNavigation from '../components/inpage-navigation.component'
import ApiCaller, { endpoints, methods } from '../common/api-caller'
import Loader from '../components/loader.component'
import toast, { Toaster } from 'react-hot-toast'
import AnimationWrapper from '../common/page-animation'
import BlogPostCard from '../components/blog-post.component'
import MinimalBlogPost from '../components/nobanner-blog-post.component'

const HomePage = () => {

    const [blogs, setBlogs] = useState(null);
    const [trendingBlogs, setTrendingBlogs] = useState(null);

    const categories = ["Technology", "Science", "Health", "Business", "Entertainment", "Sports", "Travel", "Food", "Lifestyle", "Fashion", "Education"];

    const fetchLatestBlogs = async () => {
        let endpoint = endpoints['latest-blogs'];
        let promise = new ApiCaller(endpoint, methods.get);
        try {
            let blogs = (await promise).data;
            setBlogs(blogs);
        } catch (e) {
            toast.error("Internal server error. Please refresh the page.");
        }
    }

    const fetchTrendingBlogs = async () => {
        let endpoint = endpoints['trending-blogs'];
        let promise = new ApiCaller(endpoint, methods.get);
        try {
            let blogs = (await promise).data;
            setTrendingBlogs(blogs);
        } catch (e) {
            toast.error("Internal server error. Please refresh the page.");
        }
    }

    useEffect(() => {
        fetchLatestBlogs();
        fetchTrendingBlogs();
    }, []);

    const loadBlogByCategory = async (e) => {
        let category = e.target.innerText;
        //TODO: Load blogs by category
    }


    return (
        <>
            <Toaster />
            <section className='h-cover flex justify-center gap-10'>
                {/* Latest blogs */}
                <div className='w-full'>
                    <InpageNavigation routes={["home", "trending blogs"]} defaultHidden={["trending blogs"]}>

                        {
                            blogs ? blogs.map((blog, i) => (
                                <AnimationWrapper
                                    key={i}
                                    transition={{
                                        duration: 1,
                                        delay: i * 0.1
                                    }}
                                >
                                    <BlogPostCard blog={blog} author={blog.author.personal_info} />
                                </AnimationWrapper>
                            )) : <Loader />
                        }

                        {
                            trendingBlogs ? trendingBlogs.map((blog, i) => (
                                <AnimationWrapper
                                    key={i}
                                    transition={{
                                        duration: 1,
                                        delay: i * 0.1
                                    }}
                                >
                                    <MinimalBlogPost blog={blog} index={i} author={blog.author.personal_info} />
                                </AnimationWrapper>
                            )) : <Loader />
                        }
                    </InpageNavigation>
                </div>

                {/* Filter and trending blogs */}
                <div className='min-w-[40%] lg:min-w-[400px] max-w-min border-l border-grey pl-8 pt-3 max-md:hidden'>
                    <div className='flex flex-col gap-10'>
                        <div>
                            <h1 className='font-medium text-xl mb-8'>Stories form all interests</h1>

                            <div className='flex gap-3 flex-wrap'>
                                {
                                    categories.map((category, i) => (
                                        <button onClick={loadBlogByCategory} key={i} className='tag capitalize'>{category}</button>
                                    ))
                                }
                            </div>
                        </div>

                        <div>
                            <h1 className='font-medium text-xl mb-8'>Trending <i className="fi fi-rr-arrow-trend-up"></i></h1>

                            {
                                trendingBlogs ? trendingBlogs.map((blog, i) => (
                                    <AnimationWrapper
                                        key={i}
                                        transition={{
                                            duration: 1,
                                            delay: i * 0.1
                                        }}
                                    >
                                        <MinimalBlogPost blog={blog} index={i} author={blog.author.personal_info} />
                                    </AnimationWrapper>
                                )) : <Loader />
                            }
                        </div>

                    </div>
                </div>
                <div></div>
            </section>
        </>
    )
}

export default HomePage