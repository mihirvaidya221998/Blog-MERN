// ChatBotButton.jsx
import React from 'react';
import { useState } from 'react';
import ChatBotWindow from './ChatBotWindow';
import { TbMessageChatbot } from "react-icons/tb";

function ChatBotButton() {
    const [isOpen, setIsOpen] = useState(false);
    const toggleChat = () => {
        setIsOpen(!isOpen);
    };
    return (
        <div className="fixed bottom-5 right-5 z-50">
            <button
                onClick={toggleChat}
                className="w-16 h-16 bg-lime-500 text-white rounded-full shadow-lg hover:bg-lime-600 focus:outline-none flex items-center justify-center transition duration-300 ease-in-out"
            >
                <TbMessageChatbot size={30} />
            </button>
            {isOpen && <ChatBotWindow toggleChat={toggleChat} />}
        </div>
    );
}

export default ChatBotButton;