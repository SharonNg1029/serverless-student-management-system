import { useState } from 'react'

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

  if (!isOpen) return null

  return (
    <div className="chat-sidebar-overlay">
      <div className="chat-sidebar">
        <div className="chat-header">
          <h3>Chat</h3>
          <button onClick={onClose} className="btn-close">×</button>
        </div>

        <div className="chat-messages">
          {messages.map((message) => (
            <div key={message.id} className="chat-message">
              <div className="message-sender">{message.senderName}</div>
              <div className="message-content">{message.content}</div>
              <div className="message-time">
                {new Date(message.timestamp).toLocaleTimeString('vi-VN')}
              </div>
            </div>
          ))}
          
          {messages.length === 0 && (
            <div className="no-messages">Chưa có tin nhắn nào</div>
          )}
        </div>

        <div className="chat-input">
          <input
            type="text"
            placeholder="Nhập tin nhắn..."
            value={newMessage}
            onChange={(e) => setNewMessage(e.target.value)}
            onKeyPress={(e) => e.key === 'Enter' && sendMessage()}
          />
          <button 
            onClick={sendMessage}
            disabled={loading || !newMessage.trim()}
            className="btn-send"
          >
            Gửi
          </button>
        </div>
      </div>
    </div>
  )
}
