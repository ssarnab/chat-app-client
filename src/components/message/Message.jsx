import "./message.css";
import { format } from "timeago.js";
import { useEffect, useState } from "react";
import axios from "axios";

export default function Message({ message, own }) {
 
  const [msgUser,setMsgUser] = useState(null)

  useEffect(() => {
    const getSenderUser = async () => {
      try {
        const res = await axios.get("https://ancient-woodland-67815.herokuapp.com/api/users/?userId="+message.sender);
        setMsgUser(res.data);
      } catch (err) {
        console.log(err);
      }
    };
    getSenderUser();
  }, [message.sender]);

  return (
    <div className={own ? "message own" : "message"}>
      <div className="messageTop">
        <img
          className="messageImg"
          src={msgUser?.profilePicture}
          alt=""
        />
        <p className="messageText">{message.text}</p>
      </div>
      <div className="messageBottom">{format(message.createdAt)}</div>
    </div>
  );
}
