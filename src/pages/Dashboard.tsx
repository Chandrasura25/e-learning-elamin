import { axiosPrivate } from '@/api/axios';
import DashboardTable from '@/components/Tables/DashboardTable';
import { useAuth } from '@/contexts/AuthContext';
import { useEffect, useState } from 'react';
import { Watch } from "react-loader-spinner";

const Dashboard = () => {
  const [notes, setNotes] = useState([]);
  const [loading, setLoading] = useState(true); // Add loading state
  const { user } = useAuth();

  const getNotes = async () => {
    try {
      if (user?.id) {
        setLoading(true); // Set loading to true before fetching data
        const response = await axiosPrivate.get(`/user/${user.id}`);
        setNotes(response.data.notes); // Assuming the API returns an object of notes
      }
    } catch (error) {
      console.error("Error fetching notes:", error);
    } finally {
      setLoading(false); // Set loading to false once data is fetched or if an error occurs
    }
  };
  useEffect(() => {

    getNotes();
  }, [user?.id, axiosPrivate]);

  return (
    <div>
      <div className="w-full h-fit py-3 px-8 flex justify-between items-center bg-white rounded-[16px]">
        <div className="">
          <h2 className='text-heading2-semibold text-light-4'>Hi {user?.firstname}!</h2>
          <p>Make sure to jot down a note about today’s lesson and any important details for the students!</p>
        </div>
        <div className="">
          <img src="/images/writing.gif" alt="" className='h-24' />
        </div>
        <div className=""></div>
      </div>
      <div className="bg-white mt-4 p-4 rounded-[16px]">
        {loading ? (
          <div className="flex justify-center items-center h-64">
            <Watch
              height="80"
              width="80"
              radius="48"
              color="#B43330"
              ariaLabel="watch-loading"
              wrapperStyle={{}}
              wrapperClass=""
            />
          </div>
        ) : (
          <DashboardTable data={notes} getNotes={getNotes} />
        )}
      </div>
    </div>
  )
}

export default Dashboard;
