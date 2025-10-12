'use client';
import ChatHeader from '@/components/chat/ChatHeader';
import ChatSkeleton from '@/components/chat/ChatSkeleton';
import { useAuth } from '@/lib/contexts/auth-context';
import socket from '@/lib/socket';
import { useGetChatData } from '@/services/chat/queries';
import { messageType } from '@/services/chat/types';
import { Image } from 'lucide-react';
import { useParams } from 'next/navigation';
import React, { useEffect, useState } from 'react'

const page = () => {
    const {user} = useAuth()
    const param = useParams<{chatId: string}>();
    const chatId : string = param.chatId;
    const [productId, buyerId, sellerId] = chatId.split('_');
    const [identity, setIdentity] = useState<'buyer' | 'seller'>();
    const {isLoading, isError, data} = useGetChatData(productId, identity === 'seller' ? sellerId : buyerId, chatId);
    const [messages, setMessages] = useState<messageType[] | []>(data?.chatMessages || []);
    const [text, setText] = useState('');
    const [isTextAreaOpen, setIsTextAreaOpen] = useState(false);
    
    useEffect(() => {
      setMessages(data?.chatMessages || []);
    }, [data?.chatMessages])
    
  useEffect(() => {
    socket.emit("joinChat", { productId, buyerId, sellerId });
    
    const handleNewMessage = (msg: messageType) => {
      setMessages((prev) => [...prev, msg]);
    };
    
    socket.on("newMessage", handleNewMessage);
    
    return () => {
      socket.off("newMessage", handleNewMessage);
    };
  }, [productId, buyerId, sellerId]);

  useEffect(() => {
    if(user?.uid === buyerId){
        setIdentity('seller')
    } else {
        setIdentity('buyer')
    }
  }, [chatId, user])
  

  const sendMessage = ({}) => {
    if (!text.trim()) return;
    
    const newMessage = {
      productId,
      buyerId,
      sellerId,
      senderId: user?.uid || '',
      text,
      createdAt: new Date(),
    };
    
    // Add message to local state immediately
    setMessages((prev) => [...prev, newMessage]);
    setText("");
    
    // Send to server
    socket.emit("sendMessage", {
        productId,
        buyerId,
        sellerId,
        senderId: user?.uid || '',
        text,
      });
      console.log(newMessage);
  };
  return (
    <section className='w-full h-dvh flex flex-col justify-between bg-[#F9F9F9]'>
        {data && (
            <>
             <ChatHeader user={data.userInfo} productDetails={data?.productDetails} />
             <div className=" px-2 [@media(min-width:375px)]:px-4 flex flex-col h-[calc(100vh-150px)] p-4 bg-[#F9F9F9]">
                 <div className="h-full flex-1 overflow-y-auto">
                 {messages.map((m, i) => (
                     <div key={i} className={`w-fit py-2 px-4 rounded-4xl ${m.senderId === user?.uid ? "bg-dark-blue ml-auto text-white" : "bg-[#ebeffaed] mr-auto text-black"}`}>
                     {m.text}
                     </div>
                 ))}
                 </div>
             </div>
             <div className="w-full px-2 [@media(min-width:375px)]:px-4 relative mt-3">
                <div className="w-full px-2 [@media(min-width:375px)]:px-4 absolute top-[-100px] left-0 z-30 m-0">
                 <textarea className={`w-full bg-[#E5EBFC] p-5 rounded-t-4xl h-[100px] max-h-[400px] overflow-y-auto scrollbar-hide placeholder:text-dark-blue border-0 stroke-none outline-0 ${isTextAreaOpen ? 'block' : 'hidden'} transition-transform duration-200 ease-in-out`} placeholder='Type a message...'></textarea>
                </div>
                <div className={`mb-3 flex gap-2 w-full py-2 px-4 bg-[#E5EBFC] items-center justify-between ${isTextAreaOpen ? 'rounded-b-4xl' : 'rounded-4xl'}`}>
                    <button
                    onClick={() => setIsTextAreaOpen(!isTextAreaOpen)}
                        className="px-2  text-dark-blue border-0 stroke-none outline-0"
                    >{isTextAreaOpen ? '' : 'Type a message...'}</button>
                    <div className="flex items-center">
                        <button onClick={() => sendMessage()}>
                         <Image className='size-[26px] text-dark-blue' />
                        </button>
                    </div>
                </div>
             </div>
             </>
        )}

        {isLoading && (
           <ChatSkeleton />
        )}

    </section>
  )
}

export default page
