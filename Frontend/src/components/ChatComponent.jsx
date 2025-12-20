// frontend/src/components/ChatComponent.jsx
import { useState } from "react";
import { Button } from "./ui/button";
import { Send, MessageCircle, Users } from "lucide-react";
import socket from "./socket"; // Socket import

const ChatComponent = ({ selectedUser, adminName, token, onSelectUser, onlineUsers, chatMessages, onReply, onBroadcast, replyMessage, setReplyMessage, broadcastMessage, setBroadcastMessage }) => {
  const adminRoom = 'general';

  const handleReply = () => {
    if (replyMessage.trim() && selectedUser && selectedUser._id) {
      const privateRoom = `private_${selectedUser._id}`;
      socket.emit('adminReply', {
        room: privateRoom,
        message: replyMessage,
        adminName,
        targetUserId: selectedUser._id
      });
      onReply(replyMessage); // Local update
      setReplyMessage('');
    }
  };

  const handleBroadcast = () => {
    if (broadcastMessage.trim()) {
      socket.emit('adminBroadcast', { message: broadcastMessage, adminName });
      onBroadcast(broadcastMessage); // Local update
      setBroadcastMessage('');
    }
  };

  return (
    <div className="flex gap-4">
      {/* Left: Users List */}
      <div className="w-1/3 bg-gray-50 p-4 rounded border">
        <h3 className="font-semibold mb-4 flex items-center gap-2">
          <Users className="h-4 w-4" /> Online Users ({onlineUsers.length})
        </h3>
        <div className="space-y-2 max-h-96 overflow-y-auto">
          {onlineUsers.map((user, i) => (
            <Button
              key={i}
              variant={selectedUser?.id === user.id ? "default" : "outline"}
              className="w-full justify-start"
              onClick={() => onSelectUser(user)}
            >
              <MessageCircle className="h-4 w-4 mr-2" />
              {user.userName}
            </Button>
          ))}
          {onlineUsers.length === 0 && <p className="text-gray-500 text-sm">No online users</p>}
        </div>
      </div>

      {/* Right: Chat Window */}
      <div className="w-2/3 space-y-4">
        {selectedUser ? (
          <>
            <h3 className="font-semibold">Chat with {selectedUser.userName}</h3>
            <div className="h-64 border rounded overflow-y-auto p-2 bg-white">
              {chatMessages.map((msg, i) => (
                <div key={i} className={`mb-2 p-2 rounded ${msg.userName === adminName || msg.senderId === 'admin' ? "bg-blue-100 ml-auto" : "bg-gray-100"}`}>
                  <strong>{msg.userName}:</strong> {msg.message}
                  <small className="block text-xs text-gray-500 mt-1">
                    {msg.timestamp ? new Date(msg.timestamp).toLocaleTimeString() : ""}
                  </small>
                </div>
              ))}
            </div>
            <div className="flex gap-2">
              <input
                value={replyMessage}
                onChange={(e) => setReplyMessage(e.target.value)}
                placeholder="Reply to user..."
                className="flex-1 p-2 border rounded"
                onKeyPress={(e) => e.key === "Enter" && handleReply()}
              />
              <Button onClick={handleReply} disabled={!replyMessage.trim()}>
                <Send className="h-4 w-4 mr-2" /> Reply
              </Button>
            </div>
          </>
        ) : (
          <>
            <h3 className="font-semibold">General Broadcast</h3>
            <div className="h-64 border rounded overflow-y-auto p-2 bg-white">
              {chatMessages.filter((msg) => msg.isBroadcast).map((msg, i) => (
                <div key={i} className={`mb-2 p-2 rounded ${msg.userName === adminName ? "bg-blue-100 ml-auto" : "bg-gray-100"}`}>
                  <strong>{msg.userName}:</strong> {msg.message}
                  <small className="block text-xs text-gray-500 mt-1">
                    {msg.timestamp ? new Date(msg.timestamp).toLocaleTimeString() : ""}
                  </small>
                </div>
              ))}
            </div>
            <div className="flex gap-2">
              <input
                value={broadcastMessage}
                onChange={(e) => setBroadcastMessage(e.target.value)}
                placeholder="Broadcast to all..."
                className="flex-1 p-2 border rounded"
                onKeyPress={(e) => e.key === "Enter" && handleBroadcast()}
              />
              <Button onClick={handleBroadcast} disabled={!broadcastMessage.trim()}>
                <Send className="h-4 w-4 mr-2" /> Broadcast
              </Button>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default ChatComponent;