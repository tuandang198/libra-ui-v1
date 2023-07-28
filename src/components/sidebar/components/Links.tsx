'use client';
/* eslint-disable */

// chakra imports
import { CONVERSATIONS_ALL } from '@/common/constants/api-const';
import NavLink from '@/components/link/NavLink';
import { MessageContext } from '@/contexts/MessageContext';
import { IRoute } from '@/types/navigation';
import {
  AllChatHistoryResponse,
  BaseResponse,
  MessageResponse,
} from '@/types/types';
import { Box, Flex, HStack, Icon, Text } from '@chakra-ui/react';
import { usePathname } from 'next/navigation';
import {
  PropsWithChildren,
  useCallback,
  useContext,
  useEffect,
  useState,
} from 'react';
import { MdMessage } from 'react-icons/md';
import { axiosInstance } from '../../../../pages/api/authAPI';
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
              key={key}
            >
              <HStack w="100%" mb="14px" spacing={'26px'}>
                (
                <NavLink
                  href={''}
                  styles={{ width: '100%' }}
                >
                  <Flex
                    w="100%"
                    alignItems="center"
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
                      css={
                        conversationId === chat.id
                          ? 'text-decoration: underline;font-weight:900;'
                          : 'font-weight:500;'
                      }
                      letterSpacing="0px"
                      fontSize="sm"
                      whiteSpace={'nowrap'}
                      textOverflow={'ellipsis'}
                      overflow="hidden"
                    >
                      {chat.title}
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
