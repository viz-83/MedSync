import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Bot, User } from 'lucide-react';
import ReactMarkdown from 'react-markdown';

const ChatMessage = ({ message, isUser, actions, onActionClick }) => {
    return (
        <div className={`flex w-full mb-4 ${isUser ? 'justify-end' : 'justify-start'}`}>
            <div className={`flex max-w-[85%] ${isUser ? 'flex-row-reverse' : 'flex-row'} gap-3 items-start`}>

                {/* Avatar */}
                <div className={`
                    w-8 h-8 rounded-full flex items-center justify-center shrink-0 shadow-sm
                    ${isUser ? 'bg-gray-100 text-gray-600' : 'bg-secondary text-cta'}
                `}>
                    {isUser ? <User size={16} /> : <Bot size={16} />}
                </div>

                {/* Message Bubble */}
                <div className={`flex flex-col ${isUser ? 'items-end' : 'items-start'}`}>
                    <div className={`
                        p-4 rounded-2xl text-sm leading-relaxed shadow-sm
                        ${isUser
                            ? 'bg-cta text-white rounded-tr-none'
                            : 'bg-white text-text-primary rounded-tl-none border border-gray-100'}
                    `}>
                        {/* Render simple markdown/text */}
                        <div className="prose prose-sm max-w-none dark:prose-invert">
                            <ReactMarkdown>{message}</ReactMarkdown>
                        </div>
                    </div>

                    {/* Suggested Actions (Only for AI) */}
                    {!isUser && actions && actions.length > 0 && (
                        <div className="flex flex-wrap gap-2 mt-3">
                            {actions.map((action, idx) => (
                                <button
                                    key={idx}
                                    onClick={() => onActionClick(action)}
                                    className="px-3 py-1.5 bg-white border border-cta/20 text-cta text-xs font-semibold rounded-full hover:bg-secondary/30 transition-colors shadow-sm"
                                >
                                    {action.label}
                                </button>
                            ))}
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default ChatMessage;
