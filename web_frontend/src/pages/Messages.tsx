import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Send, CheckCheck } from 'lucide-react';
import { Button, SkeletonCard } from '@/components/common';
import { getUserConversations, getConversationMessages, sendMessage, type ChatConversation } from '@/services';
import { useAuthStore } from '@/store/useAuthStore';
import type { Message } from '@/types';
import styles from './Messages.module.css';

export default function Messages() {
  const { t } = useTranslation();
  const user = useAuthStore((s) => s.user);
  const [conversations, setConversations] = useState<ChatConversation[]>([]);
  const [activeConv, setActiveConv] = useState<ChatConversation | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputText, setInputText] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getUserConversations(user?.id || 'USR001').then((data) => {
      setConversations(data);
      if (data.length > 0) {
        setActiveConv(data[0]);
      }
      setLoading(false);
    });
  }, [user?.id]);

  useEffect(() => {
    if (activeConv) {
      getConversationMessages(activeConv.conversationId).then((msgs) => setMessages(msgs));
    }
  }, [activeConv]);

  const handleSend = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputText.trim() || !activeConv || !user) return;

    const newMsg = await sendMessage({
      conversationId: activeConv.conversationId,
      senderId: user.id,
      receiverId: activeConv.otherUser.id,
      message: inputText,
    });

    setMessages((prev) => [...prev, newMsg]);
    setInputText('');
  };

  return (
    <div className={`page-enter ${styles.container}`}>
      <h1 className={styles.title}>{t('nav.messages')}</h1>

      <div className={styles.chatLayout}>
        {/* Threads List */}
        <div className={styles.threadsList}>
          {loading ? (
            Array.from({ length: 2 }).map((_, i) => <SkeletonCard key={i} />)
          ) : conversations.length > 0 ? (
            conversations.map((conv) => (
              <div
                key={conv.conversationId}
                className={[styles.threadItem, activeConv?.conversationId === conv.conversationId ? styles.activeThread : ''].join(' ')}
                onClick={() => setActiveConv(conv)}
              >
                <div className={styles.avatar}>{conv.otherUser.name[0]}</div>
                <div className={styles.threadInfo}>
                  <div className={styles.threadTop}>
                    <span className={styles.participantName}>{conv.otherUser.name}</span>
                    <span className={styles.time}>
                      {new Date(conv.lastMessage.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </span>
                  </div>
                  <p className={styles.lastMsg}>{conv.lastMessage.message}</p>
                </div>
              </div>
            ))
          ) : (
            <div className={styles.noChat} style={{ padding: '1.5rem' }}>No conversations yet</div>
          )}
        </div>

        {/* Chat Window */}
        <div className={styles.chatWindow}>
          {activeConv ? (
            <>
              <div className={styles.chatHeader}>
                <div className={styles.avatarSm}>{activeConv.otherUser.name[0]}</div>
                <div>
                  <h3 className={styles.chatName}>{activeConv.otherUser.name}</h3>
                  <span className={styles.chatRole}>{activeConv.otherUser.role} ({activeConv.otherUser.location.area})</span>
                </div>
              </div>

              <div className={styles.messagesBox}>
                {messages.map((m) => {
                  const isMine = m.senderId === (user?.id || 'USR001');
                  return (
                    <div
                      key={m.id}
                      className={[styles.msgRow, isMine ? styles.myMsgRow : styles.otherMsgRow].join(' ')}
                    >
                      <div className={[styles.bubble, isMine ? styles.myBubble : styles.otherBubble].join(' ')}>
                        <p className={styles.msgText}>{m.message}</p>
                        <span className={styles.msgTime}>
                          {new Date(m.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                          {isMine && <CheckCheck size={12} className={styles.checkIcon} />}
                        </span>
                      </div>
                    </div>
                  );
                })}
              </div>

              <form onSubmit={handleSend} className={styles.inputBar}>
                <input
                  type="text"
                  placeholder="Type a message..."
                  value={inputText}
                  onChange={(e) => setInputText(e.target.value)}
                  className={styles.chatInput}
                />
                <Button type="submit" size="sm" icon={<Send size={16} />}>
                  Send
                </Button>
              </form>
            </>
          ) : (
            <div className={styles.noChat}>Select a conversation to start chatting</div>
          )}
        </div>
      </div>
    </div>
  );
}
