import { useSession } from "next-auth/react";

const Dashboard = () => {
  const { data: session } = useSession();
  console.log("Session Data2:", session); // ตรวจสอบค่าที่ได้รับ

  return (
    <div className="p-4 bg-gray-100 rounded-md shadow-md mt-4">
      <h2 className="text-lg font-semibold">User Info</h2>
      {session ? (
        <p>Welcome, {session.user?.email}</p>
      ) : (
        <p>Please log in to see your dashboard.</p>
      )}
    </div>
  );
};

export default Dashboard;