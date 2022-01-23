import axios from "axios";
import {  useEffect, useState } from "react";
import "./AllUser.css";

export default function AllUser({ allUsers, currentId, setCurrentChat }) {
  const [users, setUsers] = useState([]);
  const PF = process.env.REACT_APP_PUBLIC_FOLDER;

  useEffect(() => {
    setUsers(allUsers.filter((f) => f._id !== currentId));
  }, [currentId,allUsers]);

  const handleClick = async (receiver) => {

    try {
      const res = await axios.get(
        `https://ancient-woodland-67815.herokuapp.com/api/conversations/find/${currentId}/${receiver._id}`
      );
      setCurrentChat(res.data);
      if(res.data === null)  {
        const con = {
          senderId : currentId, 
          receiverId:receiver._id
        };
        const res = await axios.post(
          "https://ancient-woodland-67815.herokuapp.com/api/conversations/",con
        );
        setCurrentChat(res.data);
      }
    } catch (err) {
      console.log(err);
    }
  };

  return (
    <div className="chatOnline">
      <h4>All Users</h4>
      {users.map((o) => (
        <div key={o._id} className="chatOnlineFriend" onClick={() => handleClick(o)}>
          <div className="chatOnlineImgContainer">
            <img
              className="chatOnlineImg"
              src={
                o?.profilePicture
                  ?  o.profilePicture
                  : PF + "person/noAvatar.png"
              }
              alt=""
            />
          </div>
          <span className="chatOnlineName">{o?.username}</span>
        </div>
      ))}
    </div>
  );
}
