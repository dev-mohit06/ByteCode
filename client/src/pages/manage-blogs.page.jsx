import React, { useContext, useEffect, useState } from 'react'
import ApiCaller, { endpoints, methods } from '../common/api-caller';
import { UserContext } from '../common/context';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { filterPageData } from '../common/filter-pagination-data';
import { Toaster } from 'react-hot-toast';
import InPageNavigation, { activeTabRef } from '../components/inpage-navigation.component';
import Loader from '../components/loader.component';
import NoDataMessage from '../components/nodata.component';
import AnimationWrapper from '../common/page-animation';
import LoadMoreDataBtn from '../components/load-more.component';
import { ManageDraftBlogPost, ManagePublishedBlogCard } from '../components/manage-blogcard.component';

const ManageBlogs = () => {

  const [blogs, setBlogs] = useState(null);
  const [drafts, setDrafts] = useState(null);
  const [query, setQuery] = useState('');

  let activeTab = useSearchParams()[0].get("tab");

  const navigate = useNavigate();

  let { user: { access_token } } = useContext(UserContext);

  useEffect(() => {
    if (!access_token) {
      navigate('/');
    } else {
      activeTabRef.current.click()
      if (blogs == null) {
        getBlogs({ page: 1, draft: false });
      }
      if (drafts == null) {
        getBlogs({ page: 1, draft: true });
      }
    }
  }, [access_token, blogs, drafts, query]);

  const getBlogs = async ({ page, draft, deleteDocCount = 0 }) => {

    let promise = new ApiCaller(endpoints['get-user-blogs'], methods['post'], {
      page, draft, query, deleteDocCount
    });

    let data = (await promise).data;
    let formatedData = await filterPageData({
      state: draft ? drafts : blogs,
      data: data,
      page,
      user: access_token,
      countRoute: endpoints['get-user-blogs-count'],
      data_to_send: { draft, query }
    });

    if (draft) {
      setDrafts(formatedData);
    } else {
      setBlogs(formatedData);
    }
  }

  const handelSearch = (e) => {
    let searchQuery = e.target.value;
    setQuery(searchQuery);

    if (e.key === 'Enter' && searchQuery.length > 0) {
      setBlogs(null);
      setDrafts(null);
    }
  }

  const handleChange = (e) => {
    if (!e.target.value.length) {
      setQuery("");
      setBlogs(null);
      setDrafts(null);
    }
  }


  return (
    <>
      <Toaster />

      <div className='relative max-md:mt-8 mb-10'>
        <input type="search"
          className='w-full bg-grey p-4 pl-12 pr-6 rounded-full placeholder:'
          placeholder='Search Blogs'
          onChange={handleChange} onKeyDown={handelSearch} />

        <i className="fi fi-rr-search absolute right-[10%] md:pointer-events-none md:left-5 top-1/2 -translate-y-1/2 text-xl text-dark-grey"></i>
      </div>

      <InPageNavigation routes={["Published Blogs", "Drafts"]} defaultActiveIndex={activeTab != 'draft' ? 0 : 1}>
        {
          blogs == null
            ?
            <Loader />
            :
            blogs.results.length
              ?
              <>
                {
                  blogs.results.map((blog, i) => {
                    return <AnimationWrapper key={i} transition={{
                      delay: i * 0.04
                    }}>

                      <ManagePublishedBlogCard blog={{
                        ...blog, index: i, setStateFunction: setBlogs
                      }} />

                    </AnimationWrapper>
                  })
                }

                <LoadMoreDataBtn state={blogs} fetchDatFun={getBlogs} additionalParam={{
                  draft: false,
                  deleteDocCount: blogs.deleteDocCount,
                }} />
              </>
              :
              <NoDataMessage message="No published blogs" />
        }

        {
          drafts == null
            ?
            <Loader />
            :
            drafts.results.length
              ?
              <>
                {
                  drafts.results.map((blog, i) => {
                    return <AnimationWrapper key={i} transition={{
                      delay: i * 0.04
                    }}>

                      <ManageDraftBlogPost blog={{
                        ...blog, index: i, setStateFunction: setDrafts
                      }} />

                    </AnimationWrapper>
                  })
                }

                <LoadMoreDataBtn state={drafts} fetchDatFun={getBlogs} additionalParam={{
                  draft: true,
                  deleteDocCount: drafts.deleteDocCount,
                }} />
              </>
              :
              <NoDataMessage message="No draft blogs" />
        }

      </InPageNavigation>

    </>
  )
}

export default ManageBlogs;