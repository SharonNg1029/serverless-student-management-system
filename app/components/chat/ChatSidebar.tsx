import { useState } from 'react'
import {
  Drawer,
  Portal,
  Button,
  Input,
  Stack,
  Text,
  Box,
  Flex,
  IconButton,
  HStack,
  VStack,
  Heading,
  Spinner
} from '@chakra-ui/react'
import { Send, X, MessageCircle } from 'lucide-react'

interface Message {
  id: string
  senderId: string
  senderName: string
  content: string
  timestamp: string
}

interface ChatSidebarProps {
  isOpen: boolean
  onClose: () => void
  classId?: string
}

export default function ChatSidebar({ isOpen, onClose, classId }: ChatSidebarProps) {
  const [messages, setMessages] = useState<Message[]>([])
  const [newMessage, setNewMessage] = useState('')
  const [loading, setLoading] = useState(false)

  const sendMessage = async () => {
    if (!newMessage.trim()) return

    setLoading(true)
    try {
      // TODO: Send message via AppSync/Lambda
      console.log('Sending message:', newMessage)
      setNewMessage('')
      // TODO: Fetch updated messages
    } catch (error) {
      console.error('Failed to send message:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      sendMessage()
    }
  }

  return (
    <Drawer.Root
      open={isOpen}
      onOpenChange={(e) => !e.open && onClose()}
      placement={{ base: 'bottom', md: 'end' }}
      size={{ base: 'full', md: 'md' }}
    >
      <Portal>
        <Drawer.Backdrop />
        <Drawer.Positioner>
          <Drawer.Content>
            <Drawer.Header borderBottomWidth="1px" bg="orange.50">
              <HStack gap={2}>
                <Box bg="orange.500" p={2} rounded="lg" color="white">
                  <MessageCircle size={20} />
                </Box>
                <Drawer.Title color="slate.800" fontWeight="bold">
                  Chat
                </Drawer.Title>
              </HStack>
              <Drawer.CloseTrigger asChild position="absolute" top="3" right="3">
                <IconButton variant="ghost" size="sm" aria-label="Close chat">
                  <X size={18} />
                </IconButton>
              </Drawer.CloseTrigger>
            </Drawer.Header>

            <Drawer.Body p={4} overflowY="auto" flex="1" bg="gray.50">
              {messages.length === 0 ? (
                <VStack
                  align="center"
                  justify="center"
                  h="full"
                  gap={3}
                  color="gray.400"
                >
                  <MessageCircle size={48} />
                  <Text fontSize="sm" fontWeight="medium">
                    Chưa có tin nhắn nào
                  </Text>
                </VStack>
              ) : (
                <VStack gap={3} align="stretch">
                  {messages.map((message) => (
                    <Box
                      key={message.id}
                      bg="white"
                      p={3}
                      rounded="lg"
                      shadow="sm"
                      borderWidth="1px"
                      borderColor="gray.200"
                    >
                      <HStack justify="space-between" align="center" mb={1}>
                        <Text fontSize="sm" fontWeight="bold" color="slate.700">
                          {message.senderName}
                        </Text>
                        <Text fontSize="xs" color="gray.500">
                          {new Date(message.timestamp).toLocaleTimeString('vi-VN')}
                        </Text>
                      </HStack>
                      <Text fontSize="sm" color="slate.600">
                        {message.content}
                      </Text>
                    </Box>
                  ))}
                </VStack>
              )}
            </Drawer.Body>

            <Drawer.Footer borderTopWidth="1px" p={4} bg="white">
              <HStack gap={2} w="full">
                <Input
                  placeholder="Nhập tin nhắn..."
                  value={newMessage}
                  onChange={(e) => setNewMessage(e.target.value)}
                  onKeyDown={handleKeyPress}
                  size="md"
                  flex="1"
                  borderColor="gray.300"
                  _focus={{ borderColor: 'orange.500', boxShadow: '0 0 0 1px #dd7323' }}
                />
                <Button
                  onClick={sendMessage}
                  disabled={loading || !newMessage.trim()}
                  loading={loading}
                  bg="#dd7323"
                  color="white"
                  _hover={{ bg: '#c2621a' }}
                  size="md"
                  px={6}
                >
                  <Send size={18} />
                </Button>
              </HStack>
            </Drawer.Footer>
          </Drawer.Content>
        </Drawer.Positioner>
      </Portal>
    </Drawer.Root>
  )
}
