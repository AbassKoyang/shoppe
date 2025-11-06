'use client';
import { mastraClient } from '@/lib/mastra-client';
import React, { useRef, useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Send, Loader2, Bot, User, ChevronLeft } from 'lucide-react';
import { toast } from 'sonner';
import { ProductType } from '@/services/products/types';
import JustForYouProductCard from '@/components/JustForYouProductCard';
import { useAuth } from '@/lib/contexts/auth-context';
import { useQuery } from '@tanstack/react-query';
import Link from 'next/link';
import Image from 'next/image';
import { defaultProfileAvatar } from '@/public/assets/images/exports';
import ReactMarkdown  from 'react-markdown';
import { OrderDataType } from '@/services/payment/types';
import OrderCard from '@/components/profile/OrderCard';
import SalesCard from '@/components/profile/SalesCard';
import { useRouter } from 'next/navigation';

interface Message {
content: string;
createdAt: string;
id: string;
resourceId: string;
role: 'user' | 'assistant';
threadId: string;
type: string;
}

const Page = () => {
  const {user} = useAuth();
  const {data, isError, isLoading} = useQuery({
    queryKey: ['agent-messages', user?.uid],
    queryFn: async () => {
        const thread = mastraClient.getMemoryThread(user?.uid || '', 'shoppeAgent');
        const { messages } = await thread.getMessages();
        console.log(messages, 'messages');
        return messages as Message[];
    },
  });
  const router = useRouter();
  
  const [messages, setMessages] = useState<Message[]>(data || []);
  const [input, setInput] = useState('');
  const [isStreaming, setIsStreaming] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const [products, setProducts] = useState<ProductType[]>();
  const [orders, setOrders] = useState<OrderDataType[]>();
  const [sales, setSales] = useState<OrderDataType[]>();
  const [listedProducts, setListedProducts] = useState<ProductType[]>();


  
  useEffect(() => {
    setMessages(data || []);
  }, [data]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto';
      textareaRef.current.style.height = `${textareaRef.current.scrollHeight}px`;
    }
  }, [input]);

  const handleSend = async () => {
    if (!input.trim() || isStreaming) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      role: 'user',
      content: input.trim(),
      createdAt: new Date().toISOString(),
      resourceId: user?.uid || '',
      threadId: user?.uid || '',
      type: 'text',
    };

    setProducts([]);
    setOrders([]);
    setListedProducts([]);
    setMessages((prev) => [...prev, userMessage]);
    setInput('');
    setIsStreaming(true);

    const assistantMessageId = (Date.now() + 1).toString();
    const assistantMessage: Message = {
      id: assistantMessageId,
      role: 'assistant',
      content: '',
      createdAt: new Date().toISOString(),
      resourceId: user?.uid || '',
      threadId: user?.uid || '',
      type: 'text',
    };
    setMessages((prev) => [...prev, assistantMessage]);

    try {
      const agent = mastraClient.getAgent("shoppeAgent");

      const response = await agent.stream({
        messages: [
          {
            role: "user",
            content: userMessage.content,
          },          
        ],
        threadId: user?.uid,
        resourceId: user?.uid,
        runtimeContext: {
          userId: user?.uid
        }
      });
      console.log(response);

      await response.processDataStream({
        onChunk: async (chunk) => {
          if (chunk.type === 'text-delta') {
            setMessages((prev) =>
              prev.map((msg) =>
                msg.id === assistantMessageId
                  ? { ...msg, content: msg.content + chunk.payload.text }
                  : msg
              )
            );
          } else if (chunk.type === 'tool-call') {
            console.log('Tool call detected:', chunk.payload.toolName, chunk.payload.args); 
          } else if (chunk.type === 'tool-result') {
            const payload = chunk.payload as { toolName?: string; result?: unknown };
            const toolName = payload.toolName;
            const result = payload.result;
            
            console.log('Tool result received:', result);
            
            if (toolName === 'getProductsTool' && Array.isArray(result)) {
              setProducts(result as ProductType[]);
            } else if (toolName === 'searchProductsTool' && result && typeof result === 'object' && result !== null && 'products' in result) {
              setProducts((result as { products: ProductType[] }).products);
            } else if (toolName === 'getPendingOrdersTool' && Array.isArray(result)) {
              setOrders(result as OrderDataType[]);
            } else if (toolName === 'getCompletedOrdersTool' && Array.isArray(result)) {
              setOrders(result as OrderDataType[]);
            } else if (toolName === 'getCompletedSalesTool' && Array.isArray(result)) {
              setSales(result as OrderDataType[]);
            } else if (toolName === 'getPendingSalesTool' && Array.isArray(result)) {
              setSales(result as OrderDataType[]);
            } else if (toolName === 'getUserProductsTool' && Array.isArray(result)) {
              setListedProducts(result as ProductType[]);
            }
          }
        },
      });
    } catch (error) {
      console.error('Error generating response:', error);
      toast.error('Failed to get response from AI agent');
      setMessages((prev) => prev.filter((msg) => msg.id !== assistantMessageId));
    } finally {
      setIsStreaming(false);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  return (
    <div className="flex flex-col h-screen bg-background">
      <div className="border-b bg-card p-4 flex items-center gap-1">
        <button onClick={() => router.back()}>
         <ChevronLeft className='size-9 text-dark-blue' />
        </button>
        <div className="flex items-center gap-2">
          <div className="flex-shrink-0 size-[55px] rounded-full bg-[#E5EBFC] flex items-center justify-center border-[3px] border-white shadow-[0_5px_10px_0_rgba(0,0,0,0.12)]">
                <Bot className="size-7 text-dark-blue" />
          </div>
          <div className="">
            <h1 className="text-xl font-bold text-dark-blue font-raleway tracking-[-0.2px]">Shoppe AI</h1>
            <p className='text-xs mt-[-2px] font-medium text-[#202020] font-raleway tracking-[-0.14px]'>Shoppe Ai Assistant</p>
          </div>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto p-4 space-y-4 scrollbar-hide">
        {isLoading && (
          <div className="w-full h-[100vh] flex flex-col justify-center bg-gray-200 px-2 [@media(min-width:375px)]:px-4 rounded-xl">
            <div className={`w-[200px] h-10 rounded-xl ml-auto skeleton mt-3`}></div>
            <div className={`w-[200px] h-10 rounded-xl mr-auto skeleton mt-3`}></div>
            <div className={`w-[200px] h-10 rounded-xl ml-auto skeleton mt-3`}></div>
            <div className={`w-[200px] h-10 rounded-xl mr-auto skeleton mt-3`}></div>
            <div className={`w-[200px] h-10 rounded-xl ml-auto skeleton mt-3`}></div>
            <div className={`w-[200px] h-10 rounded-xl mr-auto skeleton mt-3`}></div>
          </div>
        )}

        {isError && (
          <div className='w-full h-[60vh] flex items-center justify-center'>
            <p>Oops, Failed to load messages.</p>
          </div>
        )}

        {!isLoading && !isError && messages.length === 0 && (
          <div className="flex flex-col items-center justify-center h-full text-center text-muted-foreground">
            <Bot className="h-12 w-12 mb-4 opacity-50" />
            <p className="text-lg font-medium font-raleway">Start a conversation</p>
            <p className="text-sm mt-2 font-nunito-sans">Ask me anything!</p>
          </div>
        )}

        {data && (
          <>
          {messages.filter((m) => m.type === 'text').map((message) => (
          <div
            key={message.id}
            className={`flex gap-3 font-nunito-sans ${
              message.role === 'user' ? 'justify-end' : 'justify-start'
            }`}
          >
            {message.role === 'assistant' && (
              <div className="flex-shrink-0 size-[44px] rounded-full bg-[#E5EBFC] flex items-center justify-center border-[2px] border-white shadow-[0_5px_10px_0_rgba(0,0,0,0.12)]">
                <Bot className="h-4 w-4 text-dark-blue" />
              </div>
            )}

            <div
              className={`max-w-[80%] rounded-lg px-4 py-2 ${
                message.role === 'user'
                  ? 'bg-dark-blue text-primary-foreground'
                  : 'bg-[#E5EBFC] text-foreground'
              }`}
            >
              <div className="whitespace-pre-wrap break-words">
                <ReactMarkdown>{message.content}</ReactMarkdown>
                {message.content ? null : <div className='size-2 rounded-full bg-primary animate-ping'></div>}
              </div>
            </div>

            {message.role === 'user' && (
              <Link href={`/profile/${user?.uid}`} className='relative size-[44px] rounded-full overflow-hidden object-contain object-center border-[2px] border-white shadow-[0_5px_10px_0_rgba(0,0,0,0.12)]'>
                <Image src={user?.profile.imageUrl ? user.profile.imageUrl : defaultProfileAvatar} width={40} height={40}  className='' alt='Profile avatar' />
            </Link>
            )}
          </div>
        ))}
          </>
        )}
          {isStreaming === false && products && (<div className="w-full flex justify-center flex-wrap mt-3">        
          {products.map((product) => (
                  <JustForYouProductCard key={product.id} product={product} />
              ))}
          </div>)}
          {isStreaming === false && listedProducts && (<div className="w-full flex justify-center flex-wrap mt-3">        
          {listedProducts.map((product) => (
                  <JustForYouProductCard key={product.id} product={product} />
              ))}
          </div>)}
          {isStreaming === false && orders && (
            <div className="w-full mt-3 flex items-center justify-center">
              <div className="w-full max-w-[80%]">        
            {orders.map((order) => (
                    <OrderCard key={order.id} order={order} />
              ))}
            </div>
            </div>
          )}
          {isStreaming === false && sales && (
            <div className="w-full mt-3 flex items-center justify-center">
              <div className="w-full max-w-[80%]">        
            {sales.map((sale) => (
                    <SalesCard key={sale.id} order={sale} />
              ))}
            </div>
            </div>
          )}
        <div ref={messagesEndRef} />
      </div>

      <div className="border-t bg-card p-4 py-3">
        <div className="flex gap-2 items-end">
          <div className="flex-1 relative">
            <Textarea
              ref={textareaRef}
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="Type your message... (Press Enter to send, Shift+Enter for new line)"
              className="min-h-[35px] max-h-[200px] resize-none pr-12 placeholder:text-xs"
              disabled={isStreaming}
            />
          </div>
          <Button
            onClick={handleSend}
            disabled={!input.trim() || isStreaming || isLoading}
            size="icon"
            className="size-9 shrink-0 bg-dark-blue hover:bg-dark-blue/80"
          >
            {isStreaming ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : (
              <Send className="h-4 w-4" />
            )}
          </Button>
        </div>
      </div>
    </div>
  );
};

export default Page;