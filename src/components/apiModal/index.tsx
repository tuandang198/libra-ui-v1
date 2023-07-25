'use client';
import { MessageContext } from '@/contexts/MessageContext';
import { Button, useToast } from '@chakra-ui/react';
import { useContext } from 'react';

function APIModal(props: { setApiKey: any; sidebar?: boolean }) {
  const { sidebar } = props;
  //   @ts-ignore
  const { setConversationId } = useContext(MessageContext);

  function handleNewChat() {
    setConversationId('');
  }

  return (
    <>
      {sidebar ? (
        <Button
          display="flex"
          variant="api"
          fontSize={'sm'}
          fontWeight="600"
          borderRadius={'45px'}
          mt="8px"
          minH="40px"
          onClick={handleNewChat}
        >
          Tạo hội thoại mới
        </Button>
      ) : null}
    </>
  );
}

export default APIModal;
