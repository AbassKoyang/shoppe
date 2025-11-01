'use client';
import ChatHeader from '@/components/chat/ChatHeader';
import ChatSkeleton from '@/components/chat/ChatSkeleton';
import ImageGrid from '@/components/chat/ImageGrid';
import Message from '@/components/chat/Message';
import JustForYouProductCard from '@/components/JustForYouProductCard';
import { Textarea } from '@/components/ui/textarea';
import { useAuth } from '@/lib/contexts/auth-context';
import { useLongPress } from '@/lib/hooks/useLongPress';
import { registerServiceWorker } from '@/lib/registerServiceWorker';
import socket from '@/lib/socket';
import { useGetChatData } from '@/services/chat/queries';
import { messageType } from '@/services/chat/types';
import { AppUserType, User } from '@/services/users/types';
import { Image, ImagePlus, LoaderCircle, SendHorizontal, X } from 'lucide-react';
import { useParams } from 'next/navigation';
import React, { useEffect, useRef, useState } from 'react'
import { toast } from 'sonner';

const page = () => {
    const {user} = useAuth()
    const param = useParams<{chatId: string}>();
    const chatId : string = param.chatId;
    const [productId, buyerId, sellerId] = chatId.split('_');
    const [identity, setIdentity] = useState<'buyer' | 'seller'>();
    const {isLoading, isError, data} = useGetChatData(productId, user?.uid === sellerId ? buyerId : sellerId, chatId);
    const [messages, setMessages] = useState<messageType[] | []>(data?.chatMessages || []);
    const [text, setText] = useState('');    
    const textareaRef = useRef<HTMLTextAreaElement>(null);
    const [previewUrls, setPreviewUrls] = useState<string[]>([]);
    const [selectedFiles, setSelectedFiles] = useState<File[]>([]);
    const [userTyping, setUserTyping] = useState(false);
    const [userOnline, setUserOnline] = useState(false);
    const [isMessageSending, setIsMessageSending] = useState(false);
    const messagesEndRef = useRef<HTMLDivElement>(null);
    console.log(messages);

    const rawTs = data?.chatDetails.createdAt ?? new Date();
    const resolvedDate = rawTs?.toDate ? rawTs.toDate() : (rawTs instanceof Date ? rawTs : new Date(rawTs));
    const chatDate = isNaN(resolvedDate?.getTime?.()) ? '' : resolvedDate.toLocaleString();


    useEffect(() => {
      setMessages(data?.chatMessages || []);
    }, [data?.chatMessages]);


    
    useEffect(() => {
      messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, [messages]);

    useEffect(() => {
      registerServiceWorker();
    }, [user]);

    useEffect(() => {
      const handleBeforeUnload = (e: BeforeUnloadEvent) => {
        socket.emit('userOffline', {productId, buyerId, sellerId})
      };
  
      window.addEventListener('beforeunload', handleBeforeUnload);
  
      return () => {
        window.removeEventListener('beforeunload', handleBeforeUnload);
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
    socket.off("newMessage");
    socket.on("newMessage", handleNewMessage);
    
    return () => {
      socket.off("newMessage", handleNewMessage);
    };
  }, []);




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
      setIsMessageSending(true);
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
      edited: false,
    };

    setText("");
    setPreviewUrls([]);
    setSelectedFiles([]);
    setMessages((prev) => [...prev, { ...newMessage, images: uploadedUrls } as unknown as messageType]);
    setIsMessageSending(false);
    
    socket.emit("sendMessage", {
        productId,
        buyerId,
        sellerId,
        participants: [user, data?.userInfo],
        senderId: user?.uid || '',
        text,
        images: uploadedUrls,
      });
    socket.emit("sendNewMessageNotification", {
      receiverId: user?.uid === sellerId ? buyerId : sellerId, 
      message : text, 
      type: 'new-message',
      chatId
      });
      console.log(newMessage);
  };

  const handleImageUpload  = (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    const files = e.target.files ? Array.from(e.target.files) : [];
    if (files.length === 0) return;
    if (files.length > 4) {
      toast.warning("You can only upload up to 4 images");
      return;
    }
    const urls = files.map(file => URL.createObjectURL(file));
    setPreviewUrls(urls);
    setSelectedFiles(files);
};

const removeDeletedMessage = (messageId: string) => {
  const newMessages = messages.filter((message) => message.id !== messageId);
  setMessages(newMessages);
}
const updateEditedMessage = (messageId: string, text: string) => {
  setMessages(messages.map((message) => 
    message.id === messageId 
      ? {...message, text: text, edited: true}
      : message
  ));
}

  return (
    <section className='w-full h-dvh flex flex-col justify-between bg-[#F9F9F9] scrollbar-hide'>
        {data && (
            <>
             <ChatHeader chatDetails={data.chatDetails} user={data.userInfo} productDetails={data?.productDetails} userTyping={userTyping} userOnline={userOnline} />


             <div className="px-2 [@media(min-width:375px)]:px-4 flex flex-col h-full pt-[68px] p-4 pb-[68px] bg-[#F9F9F9]">
                 <div className="h-full flex-1 overflow-y-auto scrollbar-hide">
                  <div className="w-full flex items-center justify-center">
                    <span className='mt-[150px] text-[10px] font-nunito-sans bg-gray-200 text-black p-2 rounded-lg items-center'>{chatDate}</span>
                  </div>
                    {messages.map((m, i) =>(
                    <Message key={`{m}${i}`} m={m}  chatId={chatId} removeDeletedMessage={removeDeletedMessage} updateEditedMessage={updateEditedMessage} />))}
                    
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
                        <Textarea 
                        onFocus={() => {
                          socket.emit('userTyping', { productId, buyerId, sellerId });
                        }} 
                        onBlur={() => {
                          socket.emit('userStopTyping', { productId, buyerId, sellerId });
                        }} 
                        ref={textareaRef} 
                        value={text} onChange={(e) => setText(e.target.value)} 
                        className={`w-[90%] min-h-[30px] h-[30px] max-h-[250px] overflow-y-auto scrollbar-hide placeholder:text-dark-blue border-0 stroke-none outline-0 transition-all duration-200 ease-in-out`} placeholder='Type a message...'></Textarea>
                        <div className="flex items-center">
                          {text === '' ? (
                            <button type='button' className='size-[28px] relative'>
                              <input
                              type="file"
                              multiple
                              accept="image/*"
                              maxLength={4}
                              onChange={handleImageUpload}
                              className='w-full h-full opacity-0 z-30 absolute left-0 top-0'
                            />
                            <Image className='size-[26px] text-dark-blue z-20' />
                            </button>
                          ) : isMessageSending ? (
                              <button><LoaderCircle className="animate-spin size-[26px] text-dark-blue" /></button>
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

      {isError && (
         <div className='w-full h-[60vh] flex items-center justify-center'>
         <p>Oops, Failed to load messages from this Chat.</p>
         </div>
       )}

    </section>
  )
}

export default page
