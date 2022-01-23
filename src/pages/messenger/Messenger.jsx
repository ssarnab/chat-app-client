import "./messenger.css";
import Conversation from "../../components/conversations/Conversation";
import Message from "../../components/message/Message";
import AllUser from "../../components/AllUser/AllUser";
import { useContext, useEffect, useRef, useState } from "react";
import { AuthContext } from "../../context/AuthContext";
import axios from "axios";
import { io } from "socket.io-client";
import Header from "../../components/Header/Header";

export default function Messenger() {
  const [conversations, setConversations] = useState([]);
  const [currentChat, setCurrentChat] = useState(null);
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState("");
  const [arrivalMessage, setArrivalMessage] = useState(null);
  const [allUsers, setAllusers] = useState([]);
  const [online, setOnlineUsers] = useState([]);
  const socket = useRef();
  const { user } = useContext(AuthContext);
  const scrollRef = useRef();

  const [senderUser,setSenderUser] = useState(null)

  useEffect(() => {
    const getSenderUser = async () => {
      try {
        const res = await axios.get("https://ancient-woodland-67815.herokuapp.com/api/users/?userId="+currentChat.members[1]);
        setSenderUser(res.data);
      } catch (err) {
        console.log(err);
      }
    };
    getSenderUser();
  }, [currentChat]);


  useEffect(() => {
    socket.current = io("https://hidden-journey-86962.herokuapp.com/",{
      transports: ["websocket", "polling"],
    });
    socket.current.on("getMessage", (data) => {
      setArrivalMessage({
        sender: data.senderId,
        text: data.text,
        createdAt: Date.now(),
      });
    });
  }, []);

  useEffect(() => {
    arrivalMessage &&
      currentChat?.members.includes(arrivalMessage.sender) &&
      setMessages((prev) => [...prev, arrivalMessage]);
  }, [arrivalMessage, currentChat]);


  useEffect(() => {
    const getAllusers = async () => {
      try {
        const res = await axios.get("https://ancient-woodland-67815.herokuapp.com/api/users/all");
        setAllusers(res.data);
      } catch (err) {
        console.log(err);
      }
    };
    getAllusers();
  }, [user]);

  useEffect(() => {
   if(allUsers!==null){
    socket.current.emit("addUser", user._id);
    socket.current.on("getUsers", (users) => {
      setOnlineUsers(
        allUsers.filter((f) => users.some((u) => u.userId === f._id))
      );
    });   
   }
  }, [user,allUsers]);

  useEffect(() => {
    const getConversations = async () => {
      try {
        const res = await axios.get("https://ancient-woodland-67815.herokuapp.com/api/conversations/" + user._id);
        setConversations(res.data);
      } catch (err) {
        console.log(err);
      }
    };
    getConversations();
  }, [user._id, currentChat]);

  useEffect(() => {
    const getMessages = async () => {
      try {
        const res = await axios.get("https://ancient-woodland-67815.herokuapp.com/api/messages/" + currentChat?._id);
        setMessages(res.data);
      } catch (err) {
        console.log(err);
      }
    };
    getMessages();
  }, [currentChat]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const message = {
      sender: user._id,
      text: newMessage,
      conversationId: currentChat._id,
    };

    const receiverId = currentChat.members.find(
      (member) => member !== user._id
    );

    socket.current.emit("sendMessage", {
      senderId: user._id,
      receiverId,
      text: newMessage,
    });

    try {
      const res = await axios.post("https://ancient-woodland-67815.herokuapp.com/api/messages", message);
      setMessages([...messages, res.data]);
      setNewMessage("");
    } catch (err) {
      console.log(err);
    }
  };

  useEffect(() => {
    scrollRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  return (
    <>
    
      <div className="container messenger">
        <div className="row">
        
          <div className="chatMenu col-md-3">
            <div className="chatMenuWrapper">
              <input placeholder="Search " className="chatMenuInput ps-3 rounded" />
              {conversations.map((c) => (
                <div key={c._id} onClick={() => setCurrentChat(c)}>
                  <Conversation conversation={c} currentUser={user} />
                </div>
              ))}
            </div>
          </div>
          <div className="chatBox col-md-6">
            <div className="chatBoxWrapper">
            <Header></Header>
              {currentChat && senderUser ? (
                <>
                  
                  
                  <div className="bg-light py-3 fw-bold font-dark">{senderUser?.username}</div>
                  <div className="chatBoxTop">
                    {messages.map((m) => (
                      <div key={m._id} ref={scrollRef}>
                        <Message message={m} own={m.sender === user._id} />
                      </div>
                    ))}
                  </div>
                  <div className="chatBoxBottom">
                    <textarea
                      className="chatMessageInput"
                      placeholder="Enter your Message..."
                      onChange={(e) => setNewMessage(e.target.value)}
                      value={newMessage}
                    ></textarea>
                    <button className="chatSubmitButton" onClick={handleSubmit}>
                      Send
                    </button>
                  </div>
                </>
              ) : (
                <span className="noConversationText">
                  Open a conversation or select user to start a chat.
                </span>
              )}

            </div>
          </div>
          <div className="chatOnline col-md-3">
            <div className="chatOnlineWrapper">
              <AllUser
                allUsers={online}
                currentId={user._id}
                setCurrentChat={setCurrentChat}
              />
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
