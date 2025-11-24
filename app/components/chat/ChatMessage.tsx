interface ChatMessageProps {
  senderId: string
  senderName: string
  content: string
  timestamp: string
  isOwn?: boolean
}

export default function ChatMessage({ senderId, senderName, content, timestamp, isOwn }: ChatMessageProps) {
  return (
    <div className={`chat-message-component ${isOwn ? 'own-message' : ''}`}>
      <div className="message-header">
        <span className="sender-name">{senderName}</span>
        <span className="message-timestamp">
          {new Date(timestamp).toLocaleTimeString('vi-VN')}
        </span>
      </div>
      <div className="message-body">
        {content}
      </div>
    </div>
  )
}
