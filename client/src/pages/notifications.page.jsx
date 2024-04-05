import React, { useContext, useEffect, useState } from 'react';
import ApiCaller, { endpoints, methods } from '../common/api-caller';
import {filterPageData} from '../common/filter-pagination-data';
import { UserContext } from '../common/context';

const Notifications = () => {

    const [filter, setFilter] = useState('all');
    const [notifications,setNotifications] = useState(null);
    let {user:{access_token}} = useContext(UserContext)

    let filters = ['all','like','commnet','reply'];

    const fetchNotifications = async ({page,deleteDocCount = 0}) => {
        let promise = new ApiCaller(endpoints['get-all-notifications'],methods.post,{
            page,
            filter,
            deleteDocCount,
        });

        let data = (await promise).data;
        let formatedData = await filterPageData({
            state: notifications,
            data,
            page,
            countRoute: endpoints['get-all-notifications-count'],
            data_to_send: {filter},
        });
        setNotifications(formatedData);
        console.log(formatedData);
    }

    useEffect(() => {
        if(access_token){
            fetchNotifications({page:1});
        }
    },[access_token,filter]);

    const handleFilterClick = (e) => {
        e.preventDefault();

        let filter = e.target.innerHTML;
        setFilter(filter);
        setNotifications(null);
    }

    return (
        <div>
            <h1 className='max-md:hidden'>Recent Notifications</h1>

            <div className="my-8 flex gap-6">
                {
                    filters.map((filterName,index) => {
                        return <button onClick={handleFilterClick} className={`py-2 ${filter == filterName ? 'btn-dark' : 'btn-light'}`} key={index}>{filterName}</button>
                    })
                }
            </div>
        </div>
    )
}

export default Notifications