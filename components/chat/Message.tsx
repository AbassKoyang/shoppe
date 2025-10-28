'use client';
import { messageType } from '@/services/chat/types';
import React, { useEffect, useRef, useState } from 'react'
import ImageGrid from './ImageGrid';
import { useLongPress } from '@/lib/hooks/useLongPress';
import { useAuth } from '@/lib/contexts/auth-context';
import { deleteMessage, editMessage } from '@/services/chat/api';
import { QueryClient, useMutation } from '@tanstack/react-query';
import { toast } from 'react-toastify';
import { Copy, LoaderCircle, PencilLine, SendHorizontal, Trash2, X } from 'lucide-react';

const Message = ({m, chatId, removeDeletedMessage, updateEditedMessage} : {m: messageType; chatId: string; removeDeletedMessage: (messageId: string) => void, updateEditedMessage: (messageId: string, text: string) => void}) => {
    const {user} = useAuth();
    const [isPopUpOpen, setIsPopUpOpen] = useState(false);
    const [loading, setLoading] = useState(false);
    const [isEditLoading, setIsEditLoading] = useState(false);
    const [text, setText] = useState(m.text);
    const [isEditModalOpen, setIsEditModalOpen] = useState(false);
    const popUpRef = useRef<HTMLDivElement>(null);
    const textareaRef = useRef<HTMLTextAreaElement>(null);
    const queryClient = new QueryClient();


    const handleInput = () => {
      const el = textareaRef.current;
      if (!el) return;
      el.style.height = `${Math.min(el.scrollHeight, 250)}px`;
      if(el.value == '') el.style.height = '30px';
    };

    const deleteMessageMutation = useMutation({
        mutationFn: ({chatId, messageId} : {chatId: string; messageId: string}) => deleteMessage(chatId, messageId),
        onSuccess: () => {
          queryClient.invalidateQueries({ queryKey: ['chatData']});
        }
      });

    const EditMessageMutation = useMutation({
        mutationFn: ({chatId, messageId, text} : {chatId: string; messageId: string; text: string}) => editMessage(chatId, messageId, text),
        onSuccess: () => {
          queryClient.invalidateQueries({ queryKey: ['chatData']});
        }
      });

    const handleDeleteMessage = async () => {
        try {
            setLoading(true);
          if (!user) {
            toast.error("You must be logged in to delete message.");
            return;
          }  
          await deleteMessageMutation.mutateAsync({chatId: chatId, messageId: m.id || ''});
          removeDeletedMessage(m?.id || '');
        } catch (error: any) {
          console.error("❌ Error deleting message:", error);
      
          if (error?.code === "permission-denied") {
            toast.error("You don’t have permission to delete a message.");
          } else if (error?.message?.includes("network")) {
            toast.error("Network error — check your connection and try again.");
          } else {
            toast.error("Something went wrong while deleting message. Please try again.");
          }
        } finally {
          setLoading(false);
          setIsPopUpOpen(false);
        }
    }

    const handleEditMessage = async (text: string) => {
        try {
            setIsEditLoading(true);
          if (!user) {
            toast.error("You must be logged in to edit message.");
            return;
          }  
          await EditMessageMutation.mutateAsync({chatId: chatId, messageId: m.id || '', text});
          updateEditedMessage(m?.id || '', text);
          setIsEditModalOpen(false);
        } catch (error: any) {
          console.error("❌ Error editting message:", error);
      
          if (error?.code === "permission-denied") {
            toast.error("You don’t have permission to edit a message.");
          } else if (error?.message?.includes("network")) {
            toast.error("Network error — check your connection and try again.");
          } else {
            toast.error("Something went wrong while editing message. Please try again.");
          }
        } finally {
          setIsEditLoading(false);
        }
    }

    const handleMessagePress = useLongPress({
        onLongPress: () => {
                setIsPopUpOpen(true);
        },
        delay: 700
    })
      
      useEffect(() => {
        const handleClickOutside = (e: MouseEvent) => {
          if (popUpRef.current && !popUpRef.current.contains(e.target as Node)) {
            setIsPopUpOpen(false);
          }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
      }, []);

    const rawTs = (m as any).timestamp ?? (m as any).createdAt;
    const resolvedDate = rawTs?.toDate ? rawTs.toDate() : (rawTs instanceof Date ? rawTs : new Date(rawTs));
    const messageDate = isNaN(resolvedDate?.getTime?.()) ? '' : resolvedDate.toLocaleDateString() + '' + resolvedDate.toLocaleTimeString();


    return (
    <>
    <div {...handleMessagePress} className={`w-fit flex flex-col mt-2 py-2 px-2 ${m.senderId === user?.uid ? "ml-auto items-end" : "mr-auto items-start"}  ${loading ? 'opacity-60' : 'opacity-100'} relative select-none`}>
        <ImageGrid images={m.images || []} senderId={m.senderId} />
    <p className={`w-fit max-w-[300px] break-words py-2 px-4 mt-2 rounded-4xl ${m.senderId === user?.uid ? "bg-dark-blue text-white" : "bg-[#ebeffaed] text-black"} font-nunito-sans z-10`}>{m.text}</p>
    <span className='mt-0.5 text-[8px] font-nunito-sans text-gray-500 z-10'>{messageDate}</span>
    {m.edited && (<span className='mt-0.5 text-[7px] font-nunito-sans text-gray-500 z-10'>Edited</span>)}

    <div ref={popUpRef} className={`absolute top-[50%] translate-y-[-50%] ${m.senderId === user?.uid ? "left-[-40px]" : "right-[-40px]"} ${isPopUpOpen ? 'block' : 'hidden'} p-1.5 rounded-[6px] bg-white shadow-[0_5px_10px_0_rgba(0,0,0,0.12)] overflow-hidden transition-all duration-300 ease-in-out z-20 flex items-center gap-5 w-fit`}>
      {m.senderId === user?.uid && (
        <button onClick={() => {
          setIsEditModalOpen(true);
        }}><PencilLine className='size-[20px] text-[#202020]' /></button>
      )}
      {m.senderId === user?.uid && (
         <button onClick={() => {
          handleDeleteMessage();
        }}><Trash2 className='size-[20px] text-[#202020]' /></button>
      )}
      <button onClick={ () => {
        navigator.clipboard.writeText(m.text);
        toast.success('Message copied to clipboard')
      }}> <Copy className='size-[20px] text-[#202020]' /></button>
    </div>
    </div>


  <form onSubmit={(e) => {
      e.preventDefault();
      handleEditMessage(text);
    }} className={`w-[100vw] h-dvh px-2 [@media(min-width:375px)]:px-4 fixed top-0 left-0 z-[2000] justify-end flex-col items-center ${isEditModalOpen ? 'flex' : 'hidden'}`}>
      <div onClick={() => setIsEditModalOpen(false)} className="size-full absolute z-[1] bg-white/30 backdrop-blur-sm"></div>
       <p className={`w-fit max-w-[300px] break-words py-2 px-4 mb-2 rounded-4xl bg-dark-blue text-white z-10 ml-auto`}>{m.text}</p>

        <div className={`w-full py-3 px-5 bg-[#E5EBFC] rounded-4xl z-10 mb-2`}>
          <div className="w-full flex items-center justify-between mb-2">
            <div className="flex items-center gap-3">
             <PencilLine className='text-gray-500 size-[18px]' />
             <span className='text-gray-500'>Edit message</span>
            </div>
            <button onClick={() => setIsEditModalOpen(false)} className=''><X className='text-dark-blue size-[18px]'/></button>
          </div>
          <div className={`flex gap-2 w-full ${text.length > 0 ? 'items-end' : 'items-center'} justify-between overflow-hidden transition-all duration-200 ease-in-out`}>
            <textarea  
            ref={textareaRef} onInput={handleInput} 
            value={text} onChange={(e) => setText(e.target.value)} 
            className={`w-[90%] ${text.length == 0 ? 'h-[30px]' : ''} h-[30px] max-h-[250px] overflow-y-auto scrollbar-hide placeholder:text-dark-blue border-0 stroke-none outline-0 transition-all duration-200 ease-in-out resize-none`} placeholder='Type a message...'></textarea>
            <div className="flex items-center">
              {isEditLoading ?
                <button><LoaderCircle className="animate-spin size-[26px] text-dark-blue" /></button>
                :
                <button type='submit'>
                <SendHorizontal  className='size-[26px] text-dark-blue' />
                </button>}
            </div>
          </div>
        </div>
    </form>
    </>
  )
}

export default Message