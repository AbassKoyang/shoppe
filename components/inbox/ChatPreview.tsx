'use client';
import { useAuth } from '@/lib/contexts/auth-context';
import { defaultProfileAvatar } from '@/public/assets/images/exports';
import { chatType } from '@/services/chat/types'
import Image from 'next/image';
import Link from 'next/link';
import React from 'react'

const ChatPreview = ({chat}: {chat: chatType}) => {
    const {user} = useAuth();
    const [partcipant1, partcipant2] = chat.participants;
    const receiver = partcipant1.uid == user?.uid ? partcipant2 : partcipant1;

    const formatName = (name: string) => {
        const newName = name.substring(0, 20);
        if (name.length > 20 ) return newName+ '...'
        return name;
    }
    const formatPreviewMessage = (message: string) => {
        const newMessage = message.substring(0, 30);
        if (message.length > 30 ) return newMessage+ '...'
        return message;
    }
    const formattedName = formatName(receiver.profile.name);
    const formattedPreviewMessage = formatPreviewMessage(chat.messages[chat.messages.length -1].text);
    const rawTs = (chat.messages[chat.messages.length -1] as any).timestamp ?? (chat.messages[chat.messages.length -1] as any).createdAt;
    const resolvedDate = rawTs?.toDate ? rawTs.toDate() : (rawTs instanceof Date ? rawTs : new Date(rawTs));
    const messageDate = isNaN(resolvedDate?.getTime?.()) ? '' : resolvedDate.toLocaleTimeString() + '' + resolvedDate.toLocaleDateString();

  return (
    <Link href={`/chat/${chat.id}`} className='w-full'>
       <div className="w-full border-b border-gray-200 py-3">
        <div className="w-full flex items-center justify-between">
                <div className="size-[60px] rounded-full overflow-hidden border-[3px] border-white shadow-[0_5px_10px_0_rgba(0,0,0,0.12)] mr-3">
                    <Image width={57} height={57} blurDataURL='/assets/images/default-profile-avatar.webp' src={receiver.profile.imageUrl || defaultProfileAvatar} alt="Profile Avatar" className='object-contain object-center' />
                </div>
                <div className="w-[80%]">
                    <div className="flex items-start justify-between">
                    <h6 className='font-raleway font-semibold text-[18px] text-[#202020]'>{formattedName}</h6>
                    <span className='font-nunito-sans font-light text-[10px] text-gray-500'>{messageDate}</span>
                    </div>
                    <p className="font-nunito-sans font-normal text-[14px] text-gray-600">{formattedPreviewMessage}</p>
                </div>
            </div>
       </div>
    </Link>
)
}

export default ChatPreview