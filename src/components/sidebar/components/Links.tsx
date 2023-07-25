'use client';
/* eslint-disable */

// chakra imports
import {
  Box,
  Flex,
  HStack,
  Text,
  Icon,
  useColorModeValue,
} from '@chakra-ui/react';
import NavLink from '@/components/link/NavLink';
import { IRoute } from '@/types/navigation';
import {
  PropsWithChildren,
  useCallback,
  useContext,
  useEffect,
  useState,
} from 'react';
import { usePathname } from 'next/navigation';
import { MdMessage } from 'react-icons/md';
import { CONVERSATIONS_ALL, ME } from '@/common/constants/api-const';
import {
  AllChatHistoryResponse,
  BaseResponse,
  MessageResponse,
} from '@/types/types';
import { axiosInstance } from '../../../../pages/api/authAPI';
import { MessageContext } from '@/contexts/MessageContext';
// import { MessageContext } from '@/contexts/ChatContext';

interface SidebarLinksProps extends PropsWithChildren {
  routes: IRoute[];
}

export function SidebarLinks(props: SidebarLinksProps) {
  //   Chakra color mode
  const pathname = usePathname();
  const [chatHistory, setChatHistory] = useState<MessageResponse[]>([]);
  // @ts-ignore
  const { conversationId, setConversationId } = useContext(MessageContext);

  const { routes } = props;

  // verifies if routeName is the one active (in browser input)
  const activeRoute = useCallback(
    (routeName: string) => {
      return pathname?.includes(routeName);
    },
    [pathname],
  );

  useEffect(() => {
    const fetchChatHistory = async () => {
      try {
        const response = await axiosInstance
          .get<BaseResponse<AllChatHistoryResponse>>(CONVERSATIONS_ALL, {
            params: {
              take: 9,
            },
          })
          .then((res) => {
            const chatHistory: AllChatHistoryResponse = res.data.result;
            console.log(chatHistory);

            setChatHistory(chatHistory.conversations);
          });
      } catch (error) {
        console.error(error);
      }
    };

    fetchChatHistory();
  }, [conversationId]);

  // this function creates the links and collapses that appear in the sidebar (left menu)
  const createLinks = (routes: IRoute[]) => {
    return chatHistory.map((chat, key) => {
      return (
        <>
          {
            <Flex
              align="center"
              justifyContent="space-between"
              w="100%"
              maxW="100%"
              ps="17px"
              mb="0px"
            >
              <HStack w="100%" mb="14px" spacing={'26px'}>
                (
                <NavLink
                  //   href={route.layout ? route.layout + route.path : route.path}
                  href={''}
                  key={key}
                  styles={{ width: '100%' }}
                >
                  <Flex
                    w="100%"
                    alignItems="center"
                    justifyContent="center"
                    onClick={() => {
                      setConversationId(chat.id);
                    }}
                  >
                    <Box me="12px" mt="6px">
                      <Icon
                        as={MdMessage}
                        width="20px"
                        height="20px"
                        color="inherit"
                      />
                    </Box>
                    <Text
                      me="auto"
                      fontWeight="500"
                      letterSpacing="0px"
                      fontSize="sm"
                    >
                      {chat.id}
                    </Text>
                  </Flex>
                </NavLink>
                )
              </HStack>
            </Flex>
          }
        </>
      );
    });
  };

  return <>{createLinks(routes)}</>;
}

export default SidebarLinks;
