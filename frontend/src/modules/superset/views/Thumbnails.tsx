/* eslint-disable prettier/prettier */
// import { useRouter } from 'next/router';
import { Card, Title } from '@tremor/react';
// import Popover from '@/common/components/common/popover';
// import { FiMoreVertical } from 'react-icons/fi';
// import {
//     BsFillEyeFill,
//     BsFillHeartFill,
//     BsFillPieChartFill,
// } from 'react-icons/bs';
import { useGetThumbnailQuery, useGetDashboardsQuery } from '../superset';
import { useState, useEffect } from 'react';
import { DashboardListResult } from '../interface';

export const ThumbnailList = () => {
    const [searchInput] = useState<string>('');
    const { data } = useGetDashboardsQuery(searchInput);
    const [thumbnailUrl, setThumbnailUrl] = useState('test+++test');
    const { data: thumbnail, refetch: refetchThumbnail } = useGetThumbnailQuery(thumbnailUrl);
  
    useEffect(() => {
      if (data && data.result) {
        // Fetch the thumbnail data when the dashboard data is available
        data.result.forEach((dashboardData: DashboardListResult) => {
        /* eslint-disable no-console */
        console.log(dashboardData)
        const thumbnailUrl = dashboardData.thumbnail_url;
        /* eslint-disable no-console */
        const parts = thumbnailUrl.split('/');
        const id = dashboardData.id;
        const digest = parts[parts.length - 2];

        const combinedString = id+'+++'+digest
        // Make a backend call to fetch the thumbnail data
        setThumbnailUrl(combinedString)
        refetchThumbnail();
        });
      }
    }, [data, refetchThumbnail]);
  
    // const router = useRouter();

    // const embedDashboard = (id: string) => {
    //     router.push(`/dashboards/${id}`);
    // };

    // const updateThumbnail = (thumbnail_url: string) => {
    //     /* eslint-disable no-console */
    //     console.log('#################### Target: ')
    //     console.log(thumbnail_url);
    //     setThumbnailUrl(thumbnail_url);
    // };

    return (
        <div className="">
            <nav className="mb-5">
                <div>
                    <h2 className="text-3xl">Superset Dashboards</h2>
                    <p className="mt-2 text-gray-600">
                        Dashboard list created on Apache Superset.
                    </p>
                </div>
            </nav>
            <div>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 my-3">
                    {data?.result.map((data: any, index: any) => (
                        <div key={index} className="">
                            <Card className="bg-white h-96">
                                <div className="mb-5 h-72">
                                    <img className="object-cover h-full" src={thumbnail? thumbnail.message : '/avater.png'} alt="icon"/>
                                </div>
                                <div className="border-t flex justify-between pt-3">
                                    <Title className="w-full text-xs font-normal whitespace-nowrap overflow-hidden text-ellipsis">
                                        {data?.dashboard_title}
                                    </Title>
                                    {/* <Popover>
                                        <button>
                                            <FiMoreVertical className="text-xl" />
                                        </button>
                                        <div className='font-["Segoe_UI"] w-[200px] bg-white shadow-lg rounded-md'>
                                            <h3 className="border-b px-4 py-2">Actions</h3>
                                            <ul className="list-none">
                                                <li>
                                                    <button
                                                        onClick={() => embedDashboard(String(data?.id))}
                                                        className="flex space-x-2 border-b w-full py-1 px-3 hover:bg-orange-600 hover:text-white"
                                                    >
                                                        <BsFillPieChartFill className="mt-1 text-prim" />{' '}
                                                        <span>Preview Dashboard</span>
                                                    </button>
                                                </li>
                                                <li>
                                                    <button className="flex space-x-2 border-b w-full py-1 px-3 hover:bg-orange-600 hover:text-white">
                                                        <BsFillEyeFill className="mt-1 text-indigo-700" />{' '}
                                                        <span className="text-sm">Dashboard Details</span>
                                                    </button>
                                                </li>
                                                <li>
                                                    <button className="flex space-x-2 border-b w-full py-1 px-3 hover:bg-orange-600 hover:text-white">
                                                        <BsFillHeartFill className="mt-1 text-red-600" />{' '}
                                                        <span>Make Favorite</span>
                                                    </button>
                                                </li>
                                            </ul>
                                        </div>
                                    </Popover> */}
                                </div>
                            </Card>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};
