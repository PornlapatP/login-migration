import { useSession } from "next-auth/react";

const ProfilePage = () => {
  const { data: session } = useSession();
  
  console.log(session); // ตรวจสอบข้อมูลที่เก็บใน session

  if (!session) {
    return <div>Not logged in</div>;
  }

  return (
    <div>
      <p>Email: {session.user?.email}</p>
      {/* <p>AuthToken: {session.accessToken}</p> แสดง authToken */}
    </div>
  );
};


export default ProfilePage;
