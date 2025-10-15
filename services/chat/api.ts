import { db } from '@/lib/firebase';
import { collection, query, orderBy, getDocs, getDoc, doc, where, deleteDoc } from 'firebase/firestore';
import { ChatDataType, chatType, messageType } from './types';
import { AppUserType, User } from '../users/types';
import { ProductType } from '../products/types';

export const getChatMessages = async (chatId: string) : Promise<messageType[]> => {
  try {
    const messagesRef = collection(db, 'chats', chatId, 'messages');
    const q = query(messagesRef, orderBy('createdAt', 'asc'));
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