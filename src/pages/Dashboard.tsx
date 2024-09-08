import DashboardTable from '@/components/Tables/DashboardTable';
import { useAuth } from '@/contexts/AuthContext';
const Dashboard = () => {
  const { user } = useAuth();
  return (
    <div>
      <div className="w-full h-fit py-3 px-8 flex justify-between items-center bg-white rounded-[16px]">
        <div className="">
          <h2 className='text-heading2-semibold text-light-4'>Hi {user?.firstname}!</h2>
          <p>You have completed Lorem, ipsum dolor. Start writing your E-note</p>
        </div>
        <div className="">
          <img src="/images/writing.gif" alt="" className='h-24' />
        </div>
        <div className=""></div>
      </div>
      <div className="bg-white mt-4 p-4 rounded-[16px]">
        <DashboardTable />
      </div>
    </div>
  )
}

export default Dashboard