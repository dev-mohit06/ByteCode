import React, { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import InpageNavigation from '../components/inpage-navigation.component';
import ApiCaller, { endpoints, methods } from '../common/api-caller';
import { filterPageData } from '../common/filter-pagination-data';
import Loader from '../components/loader.component';
import NoDataMessage from '../components/nodata.component';
import LoadMoreDataBtn from '../components/load-more.component';
import BlogPostCard from '../components/blog-post.component';
import AnimationWrapper from '../common/page-animation';
import UserCard from '../components/usercard.component';

export let searchParams;

const SearchPage = () => {

    let { query: params } = useParams();

    searchParams = params;

    const [blogs, setBlogs] = useState(null);
    const [users, setUsers] = useState(null);

    const searchBlogs = async ({ page = 1, create_new_arr = false }) => {

        let endpoint = endpoints['search-blogs'];
        let promise = new ApiCaller(endpoint, methods.post, { query: params, page });
        try {
            let data = (await promise).data;
            let formatedData = await filterPageData({
                create_new_arr,
                state: blogs,
                data: data,
                page,
                countRoute: endpoints['all-search-blogs-count'],
                data_to_send: {
                    query: params
                },
            });
            setBlogs(formatedData);
        } catch (e) {
            console.log(e);
            toast.error("Internal server error. Please refresh the page.");
        }

    }

    const fetchUser = async ({ page = 1 }) => {
        let endpoint = endpoints['search-user'];
        let promise = new ApiCaller(endpoint, methods.post, { query: params });

        let users = (await promise).data;
        setUsers(users);
    }

    useEffect(() => {
        searchBlogs({ page: 1, create_new_arr: true });
        fetchUser({ page: 1 });
    }, [params]);

    const UserCardWrapper = () => {
        return (
            <>
                {
                    users ? <>
                        {
                            users.length ? users.map((user, i) => (
                                <AnimationWrapper key={i} transition={{
                                    duration: 1,
                                    delay: i * 0.08
                                }}>
                                    <UserCard user={user} />
                                </AnimationWrapper>
                            )) : <NoDataMessage message="No account matched" />
                        }
                    </> : <Loader />
                }
            </>
        )
    }

    return (
        <section className='h-cover flex justify-center gap-10'>
            <div className="w-full">
                <InpageNavigation routes={[`Search Results from "${params}"`, "Accounts Matched"]} defaultHidden={["Accounts Matched"]}>

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
                                                    tag: params,
                                                    search: false,
                                                }} blog={blog} author={blog.author.personal_info} />
                                            </AnimationWrapper>
                                        ))
                                    }
                                    <LoadMoreDataBtn state={blogs} fetchDatFun={searchBlogs} />
                                </>
                                :
                                <NoDataMessage message="No blog published" />
                            :
                            <Loader />
                    }

                    <UserCardWrapper />

                </InpageNavigation>
            </div>
            
            <div className='min-w-[40%] lg:min-w-[350px] max-w-min border-l border-grey pl-8 pt-3 max-md:hidden'>
                <h1 className='font-medium text-xl mb-8'>User related to search <i className="fi fi-rr-user"></i></h1>
                <UserCardWrapper/>
            </div>
        </section>
    )
}

export default SearchPage