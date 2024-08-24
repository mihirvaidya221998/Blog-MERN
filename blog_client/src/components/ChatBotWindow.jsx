import React from 'react';
import { useState } from 'react';
import { ImCancelCircle } from "react-icons/im";

function ChatBotWindow({ toggleChat }) {
    const [messages, setMessages] = useState([]);
    const [input, setInput] = useState('');

    const sendMessage = async () => {
        if (input.trim() === '') return;

        const userMessage = { role: 'user', content: input };
        setMessages([...messages, userMessage]);

        try {
            const response = await fetch('/api/chatbot/interact', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${localStorage.getItem('token')}`, // Assuming the token is stored in localStorage
                },
                body: JSON.stringify({ message: input }),
            });

            const data = await response.json();
            const botMessage = data.chats[data.chats.length - 1]; // Get the last message from the chat history
            setMessages([...messages, userMessage, botMessage]);
        } catch (error) {
            console.error('Error:', error);
        }

        setInput('');
    };

    const handleKeyDown = (e) => {
        if (e.key === 'Enter') {
            sendMessage();
        }
    };

    return (
        <div className="fixed bottom-20 right-5 w-80 h-96 bg-white dark:bg-gray-800 rounded-lg shadow-lg flex flex-col z-50 border border-gray-200 dark:border-gray-700">
            <div className="flex justify-between items-center bg-lime-500 text-white p-3 rounded-t-lg">
                <h3 className="text-lg">ChatBot</h3>
                <button onClick={toggleChat} className="text-white text-lg focus:outline-none hover:text-gray-200">
                    <ImCancelCircle />
                </button>
            </div>
            <div className="flex-1 p-3 overflow-y-auto bg-gray-50 dark:bg-gray-900 dark:text-gray-100 space-y-2">
                {messages.map((msg, index) => (
                    <div
                        key={index}
                        className={`p-2 rounded-lg text-sm max-w-xs break-words ${
                            msg.role === 'user'
                                ? 'bg-lime-500 text-white self-end'
                                : 'bg-gray-200 dark:bg-gray-700 dark:text-gray-100 text-black self-start'
                        }`}
                    >
                        {msg.content}
                    </div>
                ))}
            </div>

            <div className="p-3 border-t border-gray-200 dark:border-gray-700 flex items-center">
                <input
                    type="text"
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    onKeyDown={handleKeyDown}
                    className="flex-1 p-2 border rounded-lg focus:outline-none focus:ring focus:ring-blue-300 dark:focus:ring-lime-700 dark:bg-gray-700 dark:text-gray-100 transition duration-300 ease-in-out"
                    placeholder="Type a message..."
                />
                <button
                    onClick={sendMessage}
                    className="ml-2 bg-lime-500 text-white p-2 rounded-lg hover:bg-lime-600 dark:bg-lime-700 dark:hover:bg-lime-600 focus:outline-none transition duration-300 ease-in-out"
                >
                    Send
                </button>
            </div>
        </div>
    );
}

export default ChatBotWindow;