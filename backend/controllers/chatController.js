const Message = require('../models/Message'); 

// Get all messages (admin only - room filter add)
const getMessages = async (req, res) => {
  try {
    const { room } = req.query;  // Room filter
    const query = room ? { room } : {};
    const messages = await Message.find(query).sort({ createdAt: 1 }).limit(50).lean();  // Limit add for performance
    const formattedMessages = messages.map(m => ({  // Formatting add kiya (frontend match)
      ...m,
      userName: m.user,
      message: m.text,
      timestamp: m.createdAt.getTime()
    }));
    res.json({ success: true, messages: formattedMessages });
  } catch (err) {
    console.error('Error fetching messages:', err);
    res.status(500).json({ message: 'Server Error' });
  }
};

// Post a new message (admin/user - room add)
const postMessage = async (req, res) => {
  try {
    const { user, text, room } = req.body;  // Room add
    if (!room) return res.status(400).json({ message: 'Room required' });
    const newMessage = await Message.create({ user, text, room });
    res.status(201).json({ success: true, message: newMessage });
  } catch (err) {
    console.error('Error posting message:', err);
    res.status(500).json({ message: 'Server Error' });
  }
};

// Naya: Admin broadcast post
const adminBroadcast = async (req, res) => {
  try {  // Try-catch add kiya (error handling)
    const { adminName, message } = req.body;
    const newMessage = await Message.create({
      user: adminName,
      text: message,
      room: "general",
      isBroadcast: true  // Model mein add karo agar nahi hai
    });
    res.status(201).json({ success: true, message: newMessage });
  } catch (err) {
    console.error('Error broadcasting:', err);  // Log add
    res.status(500).json({ message: 'Server Error' });
  }
};

module.exports = { getMessages, postMessage, adminBroadcast };