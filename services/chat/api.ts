import { db } from '@/lib/firebase';
import { collection, query, orderBy, getDocs, getDoc, doc, where, deleteDoc, updateDoc, or, DocumentSnapshot, limit, startAfter, and } from 'firebase/firestore';
import { ChatDataType, chatType, GetAllChatsParamsType, GetAllChatsReturnType, messageType } from './types';
import { AppUserType, User } from '../users/types';
import { ProductType } from '../products/types';

export const getChatMessages = async (chatId: string) : Promise<messageType[]> => {
  try {
    const messagesRef = collection(db, 'chats', chatId, 'messages');
    const q = query(messagesRef, orderBy('timestamp', 'asc'));
    const querySnapshot = await getDocs(q);
    
    return querySnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    })) as messageType[];

  } catch (error) {
    console.error('Error fetching chat messages:', error);
    throw error;
  }
};

export const getUserInfo = async (userId: string) : Promise<AppUserType> => {
  try {
    const userRef = doc(db, 'users', userId);
    const docSnap = await getDoc(userRef);
    return {
       uid: docSnap.id,
       ...docSnap.data()
    } as AppUserType;
  } catch (error) {
    console.error('Error fetching user info:', error);
    throw error;
  }
};

export const getProductDetails = async (productId: string) : Promise<ProductType> => {
  try {
    const productRef = doc(db, 'products', productId);
    const docSnap = await getDoc(productRef);
    return {
       id: docSnap.id,
       ...docSnap.data()
    } as ProductType;
  } catch (error) {
    console.error('Error fetching product details:', error);
    throw error;
  }
};

export const getChatDetails = async (chatId: string) : Promise<chatType>  => {
  try {
    const chatRef = doc(db, 'chats', chatId);
    const docSnap = await getDoc(chatRef);
    return {
       id: docSnap.id,
       ...docSnap.data()
    } as chatType;
  } catch (error) {
    console.error('Error fetching chat:', error);
    throw error;
  }
};

export const getChatData = async (productId: string, userId: string, chatId: string) : Promise<ChatDataType>  => {
    try {
    const [userInfo, chatMessages, productDetails, chatDetails] = await Promise.all([
        getUserInfo(userId),
        getChatMessages(chatId),
        getProductDetails(productId),
        getChatDetails(chatId)
    ]);
    return {userInfo, chatMessages, productDetails, chatDetails};
  } catch (error) {
    console.error('Error fetching product details:', error);
    throw error;
  }
};

export const deleteMessage = async (chatId: string, messageId: string) => {
  const docRef = doc(db, 'chats', chatId, 'messages', messageId);
    try {
        await deleteDoc(docRef);
        console.log("✅ Message deleted successfully");
        return true;
    } catch (error) {
        console.error('Error deleting message', error);
        throw error;
    }
};
export const editMessage = async (chatId: string, messageId: string, text: string) => {
  const docRef = doc(db, 'chats', chatId, 'messages', messageId);
    try {
        await updateDoc(docRef, {
          text: text,
          edited: true,
        });
        console.log("✅ Message updated successfully");
        return true;
    } catch (error) {
        console.error('Error updating message', error);
        throw error;
    }
};

const PAGE_SIZE = 10;
export const getAllChats = async ({pageParam, userId}: GetAllChatsParamsType) : Promise<GetAllChatsReturnType> => {
  try {
    const chatRef = collection(db, 'chats');
    let q;
    if(!pageParam) {
      q = query(chatRef, and(
        where("archived", "==", false),
        or(
          where("sellerId", "==", userId),
          where("buyerId", "==", userId)
        )
      ), orderBy('createdAt', 'desc'), limit(PAGE_SIZE));
    } else {
      q = query(chatRef, and(
        where("archived", "==", false),
        or(
          where("sellerId", "==", userId),
          where("buyerId", "==", userId)
        )
      ),  orderBy('createdAt', 'desc'), startAfter(pageParam), limit(PAGE_SIZE));
    }
    
    const chatsSnapshot = await getDocs(q);
    
    const promises = chatsSnapshot.docs.map(async (chatDoc) => {
      const chatData = { id: chatDoc.id, ...chatDoc.data() as Omit<chatType, 'id' | 'messages'>, messages: [] as any[]};
      const messagesRef = collection(db, "chats", chatDoc.id, "messages");
      const messagesQuery = query(messagesRef);
      const messagesSnapshot = await getDocs(messagesQuery);

      messagesSnapshot.docs.forEach((messageDoc) => {
        chatData.messages.push({ id: messageDoc.id, ...messageDoc.data() });
      });

      return chatData;
    });

    const chatsWithMessages = await Promise.all(promises);
    const lastDoc : DocumentSnapshot = chatsSnapshot.docs[chatsSnapshot.docs.length - 1];
    console.log(chatsWithMessages);
    return {documents: chatsWithMessages, lastVisible: lastDoc};
  } catch (error) {
    console.error('Error fetching chats:', error);
    throw error;
  }
};

export const getSellingChats = async ({pageParam, userId}: GetAllChatsParamsType) : Promise<GetAllChatsReturnType> => {
  try {
    const chatRef = collection(db, 'chats');
    let q;
    if(!pageParam) {
      q = query(chatRef, where("sellerId", "==", userId), where("archived", "==", false), orderBy('createdAt', 'desc'), limit(PAGE_SIZE));
    } else {
      q = query(chatRef, where("sellerId", "==", userId), where("archived", "==", false), orderBy('createdAt', 'desc'), startAfter(pageParam), limit(PAGE_SIZE));
    }
    
    const chatsSnapshot = await getDocs(q);
    
    const promises = chatsSnapshot.docs.map(async (chatDoc) => {
      const chatData = { id: chatDoc.id, ...chatDoc.data() as Omit<chatType, 'id' | 'messages'>, messages: [] as any[]};
      const messagesRef = collection(db, "chats", chatDoc.id, "messages");
      const messagesQuery = query(messagesRef);
      const messagesSnapshot = await getDocs(messagesQuery);

      messagesSnapshot.docs.forEach((messageDoc) => {
        chatData.messages.push({ id: messageDoc.id, ...messageDoc.data() });
      });

      return chatData;
    });

    const chatsWithMessages = await Promise.all(promises);
    const lastDoc : DocumentSnapshot = chatsSnapshot.docs[chatsSnapshot.docs.length - 1];
    console.log(chatsWithMessages);
    return {documents: chatsWithMessages, lastVisible: lastDoc};
  } catch (error) {
    console.error('Error fetching chats:', error);
    throw error;
  }
};
export const getBuyingChats = async ({pageParam, userId}: GetAllChatsParamsType) : Promise<GetAllChatsReturnType> => {
  try {
    const chatRef = collection(db, 'chats');
    let q;
    if(!pageParam) {
      q = query(chatRef, where("buyerId", "==", userId), where("archived", "==", false), orderBy('createdAt', 'desc'), limit(PAGE_SIZE));
    } else {
      q = query(chatRef, where("buyerId", "==", userId), where("archived", "==",false), orderBy('createdAt', 'desc'), startAfter(pageParam), limit(PAGE_SIZE));
    }
    
    const chatsSnapshot = await getDocs(q);
    
    const promises = chatsSnapshot.docs.map(async (chatDoc) => {
      const chatData = { id: chatDoc.id, ...chatDoc.data() as Omit<chatType, 'id' | 'messages'>, messages: [] as any[]};
      const messagesRef = collection(db, "chats", chatDoc.id, "messages");
      const messagesQuery = query(messagesRef);
      const messagesSnapshot = await getDocs(messagesQuery);

      messagesSnapshot.docs.forEach((messageDoc) => {
        chatData.messages.push({ id: messageDoc.id, ...messageDoc.data() });
      });

      return chatData;
    });

    const chatsWithMessages = await Promise.all(promises);
    const lastDoc : DocumentSnapshot = chatsSnapshot.docs[chatsSnapshot.docs.length - 1];
    console.log(chatsWithMessages);
    return {documents: chatsWithMessages, lastVisible: lastDoc};
  } catch (error) {
    console.error('Error fetching chats:', error);
    throw error;
  }
};

export const addChatToArchives = async (chatId: string) => {
  const docRef = doc(db, 'chats', chatId);
    try {
        await updateDoc(docRef, {
          archived: true,
        });
        console.log("✅ Chat archived successfully");
        return true;
    } catch (error) {
        console.error('Error archiving chat', error);
        throw error;
  }
}
export const removeChatFromArchives = async (chatId: string) => {
  const docRef = doc(db, 'chats', chatId);
    try {
        await updateDoc(docRef, {
          archived: false,
        });
        console.log("✅ Chat removed from archive successfully");
        return true;
    } catch (error) {
        console.error('Error removing chat from archive', error);
        throw error;
  }
}

export const getArchivedChats = async ({pageParam, userId}: GetAllChatsParamsType) : Promise<GetAllChatsReturnType> => {
  try {
    const chatRef = collection(db, 'chats');
    let q;
    if(!pageParam) {
      q = query(chatRef, and(
        where("archived", "==", true),
        or(
          where("sellerId", "==", userId),
          where("buyerId", "==", userId)
        )
      ), orderBy('createdAt', 'desc'), limit(PAGE_SIZE));
    } else {
      q = query(chatRef, and(
        where("archived", "==", true),
        or(
          where("sellerId", "==", userId),
          where("buyerId", "==", userId)
        )
      ), orderBy('createdAt', 'desc'), startAfter(pageParam), limit(PAGE_SIZE));
    }
    
    const chatsSnapshot = await getDocs(q);
    
    const promises = chatsSnapshot.docs.map(async (chatDoc) => {
      const chatData = { id: chatDoc.id, ...chatDoc.data() as Omit<chatType, 'id' | 'messages'>, messages: [] as any[]};
      const messagesRef = collection(db, "chats", chatDoc.id, "messages");
      const messagesQuery = query(messagesRef);
      const messagesSnapshot = await getDocs(messagesQuery);

      messagesSnapshot.docs.forEach((messageDoc) => {
        chatData.messages.push({ id: messageDoc.id, ...messageDoc.data() });
      });

      return chatData;
    });

    const chatsWithMessages = await Promise.all(promises);
    const lastDoc : DocumentSnapshot = chatsSnapshot.docs[chatsSnapshot.docs.length - 1];
    console.log(chatsWithMessages);
    return {documents: chatsWithMessages, lastVisible: lastDoc};
  } catch (error) {
    console.error('Error fetching chats:', error);
    throw error;
  }
};