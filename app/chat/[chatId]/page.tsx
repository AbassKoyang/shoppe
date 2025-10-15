'use client';
import ChatHeader from '@/components/chat/ChatHeader';
import ChatSkeleton from '@/components/chat/ChatSkeleton';
import ImageGrid from '@/components/chat/ImageGrid';
import Message from '@/components/chat/Message';
import JustForYouProductCard from '@/components/JustForYouProductCard';
import { useAuth } from '@/lib/contexts/auth-context';
import { useLongPress } from '@/lib/hooks/useLongPress';
import socket from '@/lib/socket';
import { useGetChatData } from '@/services/chat/queries';
import { messageType } from '@/services/chat/types';
import { Image, ImagePlus, SendHorizontal, X } from 'lucide-react';
import { useParams } from 'next/navigation';
import React, { useEffect, useRef, useState } from 'react'

const page = () => {
    const {user} = useAuth()
    const param = useParams<{chatId: string}>();
    const chatId : string = param.chatId;
    const [productId, buyerId, sellerId] = chatId.split('_');
    const [identity, setIdentity] = useState<'buyer' | 'seller'>();
    const {isLoading, isError, data} = useGetChatData(productId, identity === 'seller' ? sellerId : buyerId, chatId);
    const [messages, setMessages] = useState<messageType[] | []>(data?.chatMessages || []);
    const [text, setText] = useState('');    
    const textareaRef = useRef<HTMLTextAreaElement>(null);
    const [previewUrls, setPreviewUrls] = useState<string[]>([]);
    const [selectedFiles, setSelectedFiles] = useState<File[]>([]);
    const [userTyping, setUserTyping] = useState(false);
    const [userOnline, setUserOnline] = useState(false);
    const messagesEndRef = useRef<HTMLDivElement>(null);

    const rawTs = data?.chatDetails.createdAt ?? new Date();
    const resolvedDate = rawTs?.toDate ? rawTs.toDate() : (rawTs instanceof Date ? rawTs : new Date(rawTs));
    const chatDate = isNaN(resolvedDate?.getTime?.()) ? '' : resolvedDate.toLocaleString();

    const handleInput = () => {
      const el = textareaRef.current;
      if (!el) return;
      el.style.height = `${Math.min(el.scrollHeight, 250)}px`;
      if(el.value == '') el.style.height = '30px';
    };

    useEffect(() => {
      setMessages(data?.chatMessages || []);
    }, [data?.chatMessages]);


    
    useEffect(() => {
      messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, [messages]);



    useEffect(() => {
      const handleBeforeUnload = (e: BeforeUnloadEvent) => {
        e.preventDefault(); 
        e.returnValue = '';
        socket.emit('userOffline', {productId, buyerId, sellerId})
      };
  
      window.addEventListener('beforeunload', handleBeforeUnload);
  
      return () => {
        window.removeEventListener('beforeunload', handleBeforeUnload);
        // also emit offline when this page unmounts (route change)
        socket.emit('userOffline', { productId, buyerId, sellerId });
      };
    }, [productId, buyerId, sellerId]);



    useEffect(() => {
      const handleUserOnline = () => {
        setUserOnline(true);
        console.log('user is online');
      };
      const handleUseroffline = () => {
        setUserOnline(false);
        console.log('user is offline');
      };
  
      socket.on('user-online', handleUserOnline);
      socket.on('user-offline', handleUseroffline);
  
      return () => {
        socket.off('user-online', handleUserOnline);
        socket.off('user-offline', handleUseroffline);
      };
    }, [user, chatId]);


    
    useEffect(() => {
      socket.emit("joinChat", { productId, buyerId, sellerId });
      socket.emit('userOnline', { productId, buyerId, sellerId });
    
      const handleConnect = () => {
        socket.emit("joinChat", { productId, buyerId, sellerId });
        socket.emit('userOnline', { productId, buyerId, sellerId });
      };
    
      socket.on('connect', handleConnect);
      return () => {
        socket.off('connect', handleConnect);
      };
    }, [productId, buyerId, sellerId]);



  useEffect(() => {
    const handleNewMessage = (msg: messageType) => {
      setMessages((prev) => [...prev, msg]);
    };
    // Ensure no duplicate listeners
    socket.off("newMessage");
    socket.on("newMessage", handleNewMessage);
    
    return () => {
      socket.off("newMessage", handleNewMessage);
    };
  }, []);
  


  useEffect(() => {
    if(user?.uid === buyerId){
        setIdentity('seller')
    } else {
        setIdentity('buyer')
    }
  }, [chatId, user]);



  useEffect(() => {
    const handleUserTyping = () => {
      setUserTyping(true);
      console.log('user is typing');
    };
    const handleUserStopTyping = () => {
      setUserTyping(false);
      console.log('user stopped typing');
    };

    socket.on('user-typing', handleUserTyping);
    socket.on('user-stop-typing', handleUserStopTyping);

    return () => {
      socket.off('user-typing', handleUserTyping);
      socket.off('user-stop-typing', handleUserStopTyping);
    };
  }, [user, chatId]);
  
  

  const sendMessage = async ({}) => {
    if (!text.trim()) return;
    let uploadedUrls : string[]  = [];
    try {
      if(selectedFiles && selectedFiles.length > 0){
        uploadedUrls = await Promise.all(
         selectedFiles.map(async (file) => {
           const formData = new FormData();
           formData.append("file", file);
           formData.append("upload_preset", "chat-picture-preset");
   
           const res = await fetch(
             `https://api.cloudinary.com/v1_1/${process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME}/image/upload`,
             {
               method: "POST",
               body: formData,
             }
           );
   
           const data = await res.json();
           console.log('image uploaded successfully', data.secure_url);
           return data.secure_url as string;
         })
       );
     }
    } catch (error) {
      console.error(error);
    }

    const newMessage = {
      productId,
      buyerId,
      sellerId,
      senderId: user?.uid || '',
      text,
      createdAt: new Date(),
    };

    setText("");
    setPreviewUrls([]);
    setSelectedFiles([]);
    setMessages((prev) => [...prev, { ...newMessage, images: uploadedUrls } as unknown as messageType]);
    
    socket.emit("sendMessage", {
        productId,
        buyerId,
        sellerId,
        senderId: user?.uid || '',
        text,
        images: uploadedUrls,
      });
      console.log(newMessage);
  };

  const handleImageUpload  = (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    const files = e.target.files ? Array.from(e.target.files) : [];
    if (files.length === 0) return;
    const urls = files.map(file => URL.createObjectURL(file));
    setPreviewUrls(urls);
    setSelectedFiles(files);
};

  return (
    <section className='w-full h-dvh flex flex-col justify-between bg-[#F9F9F9] scrollbar-hide'>
        {data && (
            <>
             <ChatHeader user={data.userInfo} productDetails={data?.productDetails} userTyping={userTyping} userOnline={userOnline} />


             <div className="px-2 [@media(min-width:375px)]:px-4 flex flex-col h-full pt-[68px] p-4 pb-[68px] bg-[#F9F9F9]">
                 <div className="h-full flex-1 overflow-y-auto scrollbar-hide">
                  <div className="w-full flex items-center justify-center">
                    <span className='mt-[150px] text-[10px] font-nunito-sans bg-gray-200 text-black p-2 rounded-lg items-center'>{chatDate}</span>
                  </div>
                    {messages.map((m, i) =>(
                    <Message key={`{m}${i}`} m={m}  chatId={chatId} />))}
                    
                    <div ref={messagesEndRef} />
                    </div>
                  </div>


              <div className="w-full fixed bottom-0 py-2 left-0 bg-transparent">
                <div className="px-2 [@media(min-width:375px)]:px-4 flex gap-2 flex-wrap">
                  {previewUrls.map((url, i) => (
                    <div key={url} className='h-20 w-20 relative'>
                      <img
                      key={i}
                      src={url}
                      alt={`Image ${i}`}
                      className="size-full object-cover rounded-md border border-[#9297e7]"
                        />
                        <span onClick={() => {
                          const updatedUrls = previewUrls.filter((_, index) => index !== i);
                          setPreviewUrls(updatedUrls);
                          const updatedFiles = selectedFiles.filter((_, index) => index !== i);
                          setSelectedFiles(updatedFiles);
                        }} className='absolute top-[-5%] right-[-5%] rounded-full bg-red-600 flex items-center justify-center p-0.5'>
                        <X className='size-[14px] text-white' />
                        </span>
                    </div>
                  ))}
                </div>
                  
                <form onSubmit={(e) => {
                  e.preventDefault();
                  sendMessage({});
                }} className="w-full px-2 [@media(min-width:375px)]:px-4 relative mt-3">
                    <div className={`flex gap-2 w-full py-3 px-5 bg-[#E5EBFC] ${text.length > 0 ? 'items-end' : 'items-center'} justify-between rounded-4xl overflow-hidden transition-all duration-200 ease-in-out`}>
                        <textarea 
                        onFocus={() => {
                          socket.emit('userTyping', { productId, buyerId, sellerId });
                        }} 
                        onBlur={() => {
                          socket.emit('userStopTyping', { productId, buyerId, sellerId });
                        }} 
                        ref={textareaRef} onInput={handleInput} 
                        value={text} onChange={(e) => setText(e.target.value)} 
                        className={`w-[90%] ${text.length == 0 ? 'h-[30px]' : ''} h-[30px] max-h-[250px] overflow-y-auto scrollbar-hide placeholder:text-dark-blue border-0 stroke-none outline-0 transition-all duration-200 ease-in-out resize-none`} placeholder='Type a message...'></textarea>
                        <div className="flex items-center">
                          {text === '' ? (
                            <button type='button' className='size-[28px] relative'>
                              <input
                              type="file"
                              multiple
                              accept="image/*"
                              onChange={handleImageUpload}
                              className='w-full h-full opacity-0 z-30 absolute left-0 top-0'
                            />
                            <Image className='size-[26px] text-dark-blue z-20' />
                            </button>
                          ) : (
                            <button type='submit'>
                            <SendHorizontal  className='size-[26px] text-dark-blue' />
                            </button>
                          )}
                        </div>
                    </div>
                </form>
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
