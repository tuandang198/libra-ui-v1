'use client';
import { CHAT } from '@/common/constants/api-const';
/*eslint-disable*/

import MessageBoxChat from '@/components/MessageBox';
import { MessageContext } from '@/contexts/MessageContext';
import {
  BaseResponse,
  ChatBody,
  ChatGPTMessage,
  ChatRequest,
  ChatResponse,
  OpenAIModel,
} from '@/types/types';
import { formatMarkdown } from '@/utils/markdown';
import {
  Button,
  Flex,
  Icon,
  Img,
  Input,
  Text,
  useColorModeValue,
} from '@chakra-ui/react';
import { useContext, useEffect, useRef, useState } from 'react';
import { MdAutoAwesome, MdEdit, MdPerson } from 'react-icons/md';
import Bg from '../public/img/chat/scale.png';
import { axiosInstance } from './api/authAPI';

export const initialMessages: ChatGPTMessage[] = [
  {
    role: 'assistant',
    content: 'Hi! I am Libra, a friendly Legal AI assistant. Ask me anything!',
  },
];

export default function Chat(props: { apiKeyApp: string }) {
  // *** If you use .env.local variable for your API key, method which we recommend, use the apiKey variable commented below
  const token =
    typeof window !== 'undefined' ? localStorage.getItem('key') : undefined;
  // Input States
  const [inputOnSubmit, setInputOnSubmit] = useState<string>('');
  const [inputCode, setInputCode] = useState<string>('');
  // Response message
  const [outputCode, setOutputCode] = useState<string>('');
  const [model, setModel] = useState<OpenAIModel>('gpt-3.5-turbo');
  // Loading state
  const [loading, setLoading] = useState<boolean>(false);
  // @ts-ignore
  const { conversationId, setConversationId, getChatHistoryById } =
    useContext(MessageContext);

  const [messages, setMessages] = useState<ChatGPTMessage[]>(initialMessages);
  const containerRef = useRef<HTMLDivElement>(null);

  // API Key
  // const [apiKey, setApiKey] = useState<string>(apiKeyApp);
  const borderColor = useColorModeValue('gray.200', 'whiteAlpha.200');
  const inputColor = useColorModeValue('navy.700', 'white');
  const iconColor = useColorModeValue('brand.500', 'white');
  const bgIcon = useColorModeValue(
    'linear-gradient(180deg, #FBFBFF 0%, #CACAFF 100%)',
    'whiteAlpha.200',
  );
  const brandColor = useColorModeValue('brand.500', 'white');
  const buttonBg = useColorModeValue('white', 'whiteAlpha.100');
  const gray = useColorModeValue('gray.500', 'white');
  const buttonShadow = useColorModeValue(
    '14px 27px 45px rgba(112, 144, 176, 0.2)',
    'none',
  );
  const textColor = useColorModeValue('navy.700', 'white');
  const placeholderColor = useColorModeValue(
    { color: 'gray.500' },
    { color: 'whiteAlpha.600' },
  );
  const messagesEndRef = useRef<null | HTMLDivElement>(null);

  useEffect(() => {
    if (conversationId) {
      getChatHistoryById.then((res: ChatGPTMessage[]) => setMessages(res));
    } else {
      setMessages(initialMessages);
    }
  }, [conversationId, getChatHistoryById]);

  useEffect(() => {
    if (messages.length > 1) {
      scrollToBottom();
    }
  }, [messages]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const handleTranslate = async () => {
    setInputOnSubmit(inputCode);
    const token =
      typeof window !== 'undefined'
        ? localStorage.getItem('access_token')
        : undefined;
    // Chat post conditions(maximum number of characters, valid message etc.)

    if (!token) {
      alert('Please sign in.');
      return;
    }

    if (!inputCode) {
      alert('Please enter your message.');
      return;
    }
    const newMessages = [
      ...messages,
      { role: 'user', content: inputCode },
    ] as ChatGPTMessage[];
    console.log(messages, 'messages');

    // [
    //   ...messages,
    //   { role: 'user', content: inputCode } as ChatGPTMessage,
    // ];

    setMessages(newMessages);
    setOutputCode(' ');
    setLoading(true);

    // -------------- Fetch --------------
    const message: ChatRequest = {
      conversationId: conversationId ? conversationId : '',
      question: inputCode,
      relevant_degree: 0,
    };

    const response = await axiosInstance
      .post<BaseResponse<ChatResponse>>(CHAT, message)
      .then(async (res) => {
        setMessages([
          ...newMessages,
          {
            role: 'assistant',
            content: formatMarkdown(
              res.data.result.message.content,
              res.data.result.message.references,
            ),
          } as ChatGPTMessage,
        ]);

        if (!conversationId) {
          setConversationId(res.data.result.message.conversationId);
        }
      })
      .catch((err) => {
        alert('Something went wrong went fetching from the API.');
        return;
      });

    setLoading(false);
  };

  const sendMessage = async () => {
    const apiKey = token;
    setInputOnSubmit(inputCode);

    // Chat post conditions(maximum number of characters, valid message etc.)

    if (!apiKey) {
      alert('Please sign in.');
      return;
    }

    if (!inputCode) {
      alert('Please enter your message.');
      return;
    }

    setOutputCode(' ');
    setLoading(true);
    const controller = new AbortController();
    const body: ChatBody = {
      inputCode,
      model,
      apiKey,
    };

    // -------------- Fetch --------------
    const response = await fetch('/api/chatAPI', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      signal: controller.signal,
      body: JSON.stringify(body),
    });

    if (!response.ok) {
      setLoading(false);
      if (response) {
        alert(
          'Something went wrong went fetching from the API. Make sure to use a valid API key.',
        );
      }
      return;
    }

    const data = response.body;

    if (!data) {
      setLoading(false);
      alert('Something went wrong');
      return;
    }

    const reader = data.getReader();
    const decoder = new TextDecoder();
    let done = false;

    while (!done) {
      setLoading(true);
      const { value, done: doneReading } = await reader.read();
      done = doneReading;
      const chunkValue = decoder.decode(value);
      setOutputCode((prevCode) => prevCode + chunkValue);
    }

    setLoading(false);
  };

  const handleChange = (Event: any) => {
    setInputCode(Event.target.value);
  };

  const onKeyDown = (event: React.KeyboardEvent<HTMLDivElement>): void => {
    if (event.key === 'Enter') {
      event.preventDefault();
      event.stopPropagation();
      handleTranslate();
    }
  };

  return (
    <Flex
      w="100%"
      pt={{ base: '70px', md: '0px' }}
      direction="column"
      position="relative"
    >
      <Img
        src={Bg.src}
        position={'absolute'}
        w="350px"
        left="50%"
        top="50%"
        transform={'translate(-50%, -50%)'}
      />
      <Flex
        direction="column"
        mx="auto"
        w={{ base: '100%', md: '100%', xl: '100%' }}
        minH={{ base: '75vh', '2xl': '85vh' }}
        maxW="1000px"
      >
        {/* Model Change */}
        <Flex
          direction={'column'}
          w="100%"
          mb={messages ? '20px' : 'auto'}
        ></Flex>
        {/* Main Box */}
        {messages?.map(({ content, role }, index) => (
          <Flex direction="column" w="100%" mx="auto" mb={'20px'} key={index}>
            {role == 'user' ? (
              <Flex w="100%" align={'center'} mb="10px">
                <Flex
                  borderRadius="full"
                  justify="center"
                  align="center"
                  bg={'transparent'}
                  border="1px solid"
                  borderColor={borderColor}
                  me="20px"
                  h="40px"
                  minH="40px"
                  minW="40px"
                >
                  <Icon
                    as={MdPerson}
                    width="20px"
                    height="20px"
                    color={brandColor}
                  />
                </Flex>
                <Flex
                  p="22px"
                  border="1px solid"
                  borderColor={borderColor}
                  borderRadius="14px"
                  w="100%"
                  zIndex={'2'}
                >
                  <Text
                    color={textColor}
                    fontWeight="600"
                    fontSize={{ base: 'sm', md: 'md' }}
                    lineHeight={{ base: '24px', md: '26px' }}
                  >
                    {content}
                  </Text>
                  <Icon
                    cursor="pointer"
                    as={MdEdit}
                    ms="auto"
                    width="20px"
                    height="20px"
                    color={gray}
                  />
                </Flex>
              </Flex>
            ) : null}
            {role == 'assistant' ? (
              <Flex w="100%" key={index}>
                <Flex
                  borderRadius="full"
                  justify="center"
                  align="center"
                  bg={'linear-gradient(15.46deg, #4A25E1 26.3%, #7B5AFF 86.4%)'}
                  me="20px"
                  h="40px"
                  minH="40px"
                  minW="40px"
                >
                  <Icon
                    as={MdAutoAwesome}
                    width="20px"
                    height="20px"
                    color="white"
                  />
                </Flex>
                <MessageBoxChat output={content} />
              </Flex>
            ) : null}
          </Flex>
        ))}

        {/* Chat Input */}
        <Flex
          ms={{ base: '0px', xl: '60px' }}
          mt="20px"
          justifySelf={'flex-end'}
        >
          <Input
            minH="54px"
            h="100%"
            border="1px solid"
            borderColor={borderColor}
            borderRadius="45px"
            p="15px 20px"
            me="10px"
            fontSize="sm"
            fontWeight="500"
            _focus={{ borderColor: 'none' }}
            color={inputColor}
            _placeholder={placeholderColor}
            placeholder="Câu hỏi của bạn..."
            onChange={handleChange}
            onKeyDown={onKeyDown}
          />
          <Button
            variant="primary"
            py="20px"
            px="16px"
            fontSize="sm"
            borderRadius="45px"
            ms="auto"
            w={{ base: '160px', md: '210px' }}
            h="54px"
            _hover={{
              boxShadow:
                '0px 21px 27px -10px rgba(96, 60, 255, 0.48) !important',
              bg: 'linear-gradient(15.46deg, #4A25E1 26.3%, #7B5AFF 86.4%) !important',
              _disabled: {
                bg: 'linear-gradient(15.46deg, #4A25E1 26.3%, #7B5AFF 86.4%)',
              },
            }}
            onClick={handleTranslate}
            isLoading={loading ? true : false}
          >
            Gửi
          </Button>
          <div ref={messagesEndRef} />
        </Flex>
      </Flex>
    </Flex>
  );
}
