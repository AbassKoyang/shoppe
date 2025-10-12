import { db } from '@/lib/firebase';
import { collection, query, orderBy, getDocs, getDoc, doc } from 'firebase/firestore';
import { ChatDataType, messageType } from './types';
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
    const userRef = doc(db, 'products', productId);
    const docSnap = await getDoc(userRef);
    return {
       id: docSnap.id,
       ...docSnap.data()
    } as ProductType;
  } catch (error) {
    console.error('Error fetching product details:', error);
    throw error;
  }
};

export const getChatData = async (productId: string, userId: string, chatId: string) : Promise<ChatDataType>  => {
    try {
    const [userInfo, chatMessages, productDetails] = await Promise.all([
        getUserInfo(userId),
        getChatMessages(chatId),
        getProductDetails(productId)
    ]);
    return {userInfo, chatMessages, productDetails};
  } catch (error) {
    console.error('Error fetching product details:', error);
    throw error;
  }
};