import React, { useContext, useEffect, useState } from "react";
import Message from './Message';
import { doc, onSnapshot } from 'firebase/firestore';
import { db } from '../firebase/Config';
import { ChatContext } from '../contexts/ChatContext';

export default function Messages() {
  const [mesajlar,setMesajlar]=useState([])
  const {data}=useContext(ChatContext)

  useEffect(() => {
    const unSub = onSnapshot(doc(db, "chatler", data.chatId), (doc) => {
    doc.exists() && setMesajlar(doc.data().mesajlar);
  });
  
  return () => {
    unSub();
  };
  }, [data.chatId]);

  return (
    <div className='messages'>
    {mesajlar.map((m) => (
    <Message mesaj={m} key={m.id} />
    ))}
  </div>
  );
}
