import React, { useContext, useEffect, useState } from 'react';
import { View, Text, FlatList } from 'react-native';
import { UserContext } from './UserContext';

const Notifications: React.FC = () => {
    const [messageSet, setMessageSet] = useState<Set<string>>(new Set());
    const [messages, setMessages] = useState<string[]>([]);
    
    // Use the context and handle undefined state
    const userContext = useContext(UserContext);

    if (!userContext) {
        return (
            <View>
                <Text>No user context available. If not logged in please log in.</Text>
            </View>
        );
    }

    const { user } = userContext;

    useEffect(() => {
        if (!user) return;

        console.log("WebSocket is being set up.");
        const socket = new WebSocket('ws://localhost:15674/ws');

        const handleMessage = (event: WebSocketMessageEvent) => {
            const rawData = event.data as string;
            const contentLengthIndex = rawData.lastIndexOf("content-length:");

            if (contentLengthIndex !== -1) {
                const startIndex = rawData.indexOf(" ", contentLengthIndex);
                const lengthString = rawData.substring(contentLengthIndex + "content-length:".length, startIndex).trim();
                const messageBodyLength = parseInt(lengthString, 10) + 2;

                const messageBodyStartIndex = rawData.length - messageBodyLength;
                const messageBody = rawData.substring(messageBodyStartIndex);

                if (messageSet.has(messageBody)) {
                    return;
                }

                messageSet.add(messageBody);
                setMessageSet(new Set(messageSet));

                setMessages((prevMessages) => [...prevMessages, messageBody]);
            }
        };

        socket.addEventListener('message', handleMessage);

        const handleOpen = () => {
            const login = 'guest';
            const passcode = 'guest';
            socket.send(`CONNECT\nlogin:${login}\npasscode:${passcode}\n\n\0`);
            socket.send(`SUBSCRIBE\nid:sub-0\ndestination:/queue/user_queue_${user.id}\nack:client\n\n\0`);
        };

        socket.addEventListener('open', handleOpen);

        return () => {
            socket.removeEventListener('message', handleMessage);
            socket.removeEventListener('open', handleOpen);
            socket.close();
        };
    }, [user, messageSet]);

    if (!user) {
        return (
            <View>
                <Text>Notifications</Text>
                <Text>Loading...</Text>
            </View>
        );
    }

    return (
        <View>
            <Text>Notifications</Text>
            <FlatList
                data={messages}
                keyExtractor={(item, index) => index.toString()}
                renderItem={({ item }) => (
                    <Text>{item}</Text>
                )}
            />
        </View>
    );
};

export default Notifications;
