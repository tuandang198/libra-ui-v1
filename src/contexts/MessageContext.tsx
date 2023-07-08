import { CONVERSATION } from '@/common/constants/api-const';
import {
  AllMessageResponse,
  BaseResponse,
  ChatGPTMessage,
} from '@/types/types';
import { formatMarkdown } from '@/utils/markdown';
import React, { createContext, useState } from 'react';
import { axiosInstance } from '../../pages/api/authAPI';

interface MessageContextProps {
  conversationId: string | undefined;
  setConversationId: React.Dispatch<React.SetStateAction<string | undefined>>;
  getChatHistoryById: Promise<ChatGPTMessage[]>;
}

export const MessageContext = createContext<MessageContextProps | undefined>(
  undefined,
);

interface ContextProps {
  children: React.ReactNode;
}

const getMessage = async (conversationId: string | undefined) => {
  const msgs: ChatGPTMessage[] = [];
  if (conversationId as string) {
    const res = await axiosInstance.get<BaseResponse<AllMessageResponse>>(
      `${CONVERSATION}/${conversationId}`,
    );
    if (res)
      res.data.result.conversation.messages.map((msg) => {
        const { content, bot } = msg;
        msgs.push({
          role: bot ? 'assistant' : 'user',
          content: bot ? formatMarkdown(content, msg.references) : content,
        } as ChatGPTMessage);
      });
  }
  return msgs;
};

const Context: React.FC<ContextProps> = ({ children }) => {
  const [conversationId, setConversationId] = useState<string | undefined>(
    undefined,
  );
  const getChatHistoryById = getMessage(conversationId);
  return (
    <MessageContext.Provider
      value={{
        conversationId,
        setConversationId,
        getChatHistoryById,
      }}
    >
      {children}
    </MessageContext.Provider>
  );
};

export default Context;
