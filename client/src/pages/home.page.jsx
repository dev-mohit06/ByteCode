import { useEffect, useState } from 'react'
import InpageNavigation, { activeTabRef } from '../components/inpage-navigation.component'
import ApiCaller, { endpoints, methods } from '../common/api-caller'
import Loader from '../components/loader.component'
import toast, { Toaster } from 'react-hot-toast'
import AnimationWrapper from '../common/page-animation'
import BlogPostCard from '../components/blog-post.component'
import MinimalBlogPost from '../components/nobanner-blog-post.component'
import NoDataMessage from '../components/nodata.component'
import { filterPageData } from '../common/filter-pagination-data'
import LoadMoreDataBtn from '../components/load-more.component'

export let fetchLatestBlogs;

const HomePage = () => {

    const [blogs, setBlogs] = useState(null);
    const [isCategorySearch, setIsCategorySearch] = useState(false);
    const [trendingBlogs, setTrendingBlogs] = useState(null);
    const [pageState, setPageState] = useState('home');

    const categories = ["Technology", "Science", "Health", "Business", "Entertainment", "Sports", "Travel", "Food", "Lifestyle", "Fashion", "Education"];

    fetchLatestBlogs = async ({ page = 1 }) => {
        let endpoint = endpoints['latest-blogs'];
        let promise = new ApiCaller(endpoint, methods.post, { page });
        try {
            let data = (await promise).data;
            let formatedData = await filterPageData({
                state: blogs,
                data: data,
                page,
                countRoute: endpoints['all-latest-blogs-count']
            });
            setBlogs(formatedData);
        } catch (e) {
            console.log(e);
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
    const fetchBlogsByCategory = async ({ page = 1 }) => {
        let endpoint = endpoints['blogs-by-category'];
        let promise = new ApiCaller(endpoint, methods.post, { tag: pageState });
        try {
            let data = (await promise).data;
            let formatedData = await filterPageData({
                state: blogs,
                data: data,
                page,
                countRoute: endpoints['all-search-blogs-count'],
                data_to_send: { tag: pageState }
            });
            setIsCategorySearch(true);
            setBlogs(formatedData);
        } catch (e) {
            console.log(e);
            toast.error("Internal server error. Please refresh the page.");
        }
    }

    const loadBlogByCategory = async (e) => {
        let category = e.target.innerText.toLowerCase()
        setBlogs(null)

        if (pageState == category) {
            setPageState('home')
            setIsCategorySearch(false)
            return;
        }
        setPageState(category)
    }

    useEffect(() => {
        activeTabRef.current.click()
        if (pageState == 'home') {
            fetchLatestBlogs({ page: 1 });
        }
        else {
            fetchBlogsByCategory({ page: 1 });
        }
        if (!trendingBlogs) {
            fetchTrendingBlogs();
        }
    }, [pageState]);


    return (
        <>
            <Toaster />
            <section className='h-cover flex justify-center gap-10'>
                {/* Latest blogs */}
                <div className='w-full'>
                    <InpageNavigation routes={[pageState, "trending blogs"]} defaultHidden={["trending blogs"]}>

                        {
                            blogs
                                ?
                                blogs.results.length
                                    ?
                                    <>
                                        {
                                            blogs.results.map((blog, i) => (
                                                <AnimationWrapper
                                                    key={i}
                                                    transition={{
                                                        duration: 1,
                                                        delay: i * 0.1
                                                    }}
                                                >
                                                    <BlogPostCard categorySearch={{
                                                        tag: pageState,
                                                        search: isCategorySearch,
                                                    }} blog={blog} author={blog.author.personal_info} />
                                                </AnimationWrapper>
                                            ))
                                        }
                                        <LoadMoreDataBtn state={blogs} fetchDatFun={pageState == "home" ? fetchLatestBlogs : fetchBlogsByCategory} />
                                    </>
                                    :
                                    <NoDataMessage message="No blog published" />
                                :
                                <Loader />
                        }

                        {
                            trendingBlogs
                                ?
                                trendingBlogs.length
                                    ? trendingBlogs.map((blog, i) => (
                                        <AnimationWrapper
                                            key={i}
                                            transition={{
                                                duration: 1,
                                                delay: i * 0.1
                                            }}
                                        >
                                            <MinimalBlogPost blog={blog} index={i} author={blog.author.personal_info} />
                                        </AnimationWrapper>
                                    ))
                                    :
                                    <NoDataMessage message="No trending blogs" />
                                :
                                <Loader />
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
                                        <button onClick={loadBlogByCategory} key={i} className={`tag ${pageState == category.toLowerCase() ? "bg-black text-white" : " "}`}>{category}</button>
                                    ))
                                }
                            </div>
                        </div>

                        <div>
                            <h1 className='font-medium text-xl mb-8'>Trending <i className="fi fi-rr-arrow-trend-up"></i></h1>

                            {
                                trendingBlogs
                                    ?
                                    trendingBlogs.length
                                        ? trendingBlogs.map((blog, i) => (
                                            <AnimationWrapper
                                                key={i}
                                                transition={{
                                                    duration: 1,
                                                    delay: i * 0.1
                                                }}
                                            >
                                                <MinimalBlogPost blog={blog} index={i} author={blog.author.personal_info} />
                                            </AnimationWrapper>
                                        ))
                                        :
                                        <NoDataMessage message="No trending blogs" />
                                    :
                                    <Loader />
                            }
                        </div>

                    </div>
                </div>
                <div></div>
            </section >
        </>
    )
}

export default HomePage