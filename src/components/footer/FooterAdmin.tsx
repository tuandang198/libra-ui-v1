'use client';
/*eslint-disable*/

import {
  Flex,
  Text,
  useColorModeValue,
} from '@chakra-ui/react';

export default function Footer() {
  const textColor = useColorModeValue('gray.500', 'white');
  return (
    <Flex
      zIndex="3"
      flexDirection={{
        base: 'column',
        xl: 'row',
      }}
      alignItems="center"
      justifyContent="center"
      //   px={{ base: '30px', md: '50px' }}
      mb="30px"
    >
      <Text
        color={textColor}
        fontSize={{ base: 'xs', md: 'sm' }}
        textAlign={{
          base: 'center',
          xl: 'start',
        }}
        fontWeight="500"
        mb={{ base: '10px', xl: '0px' }}
      >
        {' '}
        <Text as="span" fontWeight="500" ms="4px">
          Made with love in Hanoi - {new Date().getFullYear()}
        </Text>
      </Text>
    </Flex>
  );
}
