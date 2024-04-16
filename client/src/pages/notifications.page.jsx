import React, { useContext, useEffect, useState } from 'react';
import ApiCaller, { endpoints, methods } from '../common/api-caller';
import { filterPageData } from '../common/filter-pagination-data';
import { UserContext } from '../common/context';
import Loader from '../components/loader.component';
import AnimationWrapper from '../common/page-animation';
import NoDataMessage from '../components/nodata.component';
import NotificationCard from '../components/notification-card.component';
import LoadMoreDataBtn from '../components/load-more.component';

const Notifications = () => {

    const [filter, setFilter] = useState('all');
    const [notifications, setNotifications] = useState(null);
    let { user,user: { access_token,new_notifications_available },setUser } = useContext(UserContext);

    let filters = ['all', 'like', 'comment', 'reply'];

    const fetchNotifications = async ({ page, deleteDocCount = 0 }) => {
        let promise = new ApiCaller(endpoints['get-all-notifications'], methods.post, {
            page,
            filter,
            deleteDocCount,
        });

        let data = (await promise).data;

        if(new_notifications_available){
            setUser({...user,new_notification_available: false});
        }

        let formatedData = await filterPageData({
            state: notifications,
            data,
            page,
            countRoute: endpoints['get-all-notifications-count'],
            data_to_send: { filter },
        });
        setNotifications(formatedData);
    }

    const handleFilterClick = (e) => {
        e.preventDefault();

        let new_filter = e.target.innerHTML;
        if (new_filter == filter) return;
        setFilter(new_filter);
        setNotifications(null);
    }

    useEffect(() => {
        if (access_token) {
            fetchNotifications({ page: 1 });
        }
    }, [access_token, filter]);


    return (
        <div>
            <h1 className='max-md:hidden'>Recent Notifications</h1>

            <div className="my-8 flex gap-6">
                {
                    filters.map((filterName, index) => {
                        return <button onClick={handleFilterClick} className={`py-2 ${filter == filterName ? 'btn-dark' : 'btn-light'}`} key={index}>{filterName}</button>
                    })
                }
            </div>

            {
                notifications == null
                    ?
                    <Loader />
                    :
                    <>
                        {
                            notifications.results.length
                                ?
                                notifications.results.map((notification, index) => {
                                    return (
                                        <AnimationWrapper
                                            key={index}
                                            transition={{
                                                delay: index * 0.08
                                            }}
                                        >
                                            <NotificationCard key={index} data={notification} index={index} notificationState={{notifications,setNotifications}} />
                                        </AnimationWrapper>
                                    )
                                })
                                :
                                <NoDataMessage message="Nothing avaliable" />
                        }

                        <LoadMoreDataBtn state={notifications} fetchDatFun={fetchNotifications} additionalParam={{deleteDocCount: notifications.deletedDocCount}} />
                    </>
            }
        </div>
    )
}

export default Notifications