"use client";

import { Box, Button, CircularProgress, Container, Typography, TextField, IconButton } from "@mui/material";
import styles from "./chat.module.css";
import { useEffect, useMemo, useState } from "react";
import { useAppDispatch, useAppSelector } from "@/redux/hooks.ts";
import { getRoomMembers } from "@/redux/feature/member/member-action";
import { useParams, useRouter } from "next/navigation";
import { RootState } from "@/redux/store";
import InfiniteScroll from "react-infinite-scroll-component";
import SendIcon from '@mui/icons-material/Send';
import EmojiEmotionsIcon from '@mui/icons-material/EmojiEmotions';
import { enqueueSnackbar } from "notistack";
import dynamic from 'next/dynamic';
import { createRoomChat, deleteRoomChat, getRoomChats } from "@/redux/feature/chat/chat-action";
import DeleteIcon from '@mui/icons-material/Delete';
import { connectUnAuthSocket } from "@/service/socket/socket";
import { SocketEventSubscribeEnum } from "@/service/socket/socket-event.enum";
import { addChat, removeChat } from "@/redux/feature/chat/chat-slice";
import { RoomChat } from "@/redux/feature/chat/chat-type";
import Image from "next/image";
import FiberManualRecordIcon from '@mui/icons-material/FiberManualRecord';
let unauth_socket: any;

// Dynamically import the EmojiPicker to disable SSR
const EmojiPicker = dynamic(() => import('emoji-picker-react'), { ssr: false });

export default function SpecificRoomChat() {
  const dispatch = useAppDispatch();
  const { uuid } = useParams();
  const room_uuid = String(uuid);
  const { roomMembers } = useAppSelector((state: RootState) => state.roomMemberReducer);
  const { user } = useAppSelector((state: RootState) => state.authReducer);
  const { roomChats, roomChatsTotalDocuments, loading } = useAppSelector((state: RootState) => state.chatReducer);

  const members = roomMembers?.[room_uuid];
  const chats = roomChats?.[room_uuid] || [];
  const totalChats = roomChatsTotalDocuments?.[room_uuid] || 0;

  const member = roomMembers?.[room_uuid]?.find((member) => member.user_uuid == user?.uuid);
  const [offset, setOffset] = useState(0);
  const limit = Number(process.env.NEXT_PUBLIC_PAGE_LIMIT) || 10;
  const [message, setMessage] = useState('');
  const [isEmojiPickerOpen, setIsEmojiPickerOpen] = useState(false);

  useEffect(() => {
    dispatch(getRoomMembers({ room_uuid: room_uuid, limit: 0, offset: 0 })).unwrap();
    dispatch(getRoomChats({ room_uuid: room_uuid, limit: limit, offset: 0 })).unwrap();
  }, [room_uuid]);

  useEffect(() => {
    unauth_socket = connectUnAuthSocket();

    if (room_uuid) {
      unauth_socket.emit(SocketEventSubscribeEnum.SUBSCRIBE_ROOM_CONNECT, { room_uuid });

      const handleSocketNewChat = (data: any) => {
        console.log("Received :", SocketEventSubscribeEnum.SUBSCRIBE_ROOM_CHAT_CREATED, data);
        dispatch(addChat(data));
      };

      const handleSocketDeleteChat = (data: any) => {
        console.log("Received :", SocketEventSubscribeEnum.SUBSCRIBE_ROOM_CHAT_DELETED, data);
        dispatch(removeChat(data));
      };

      unauth_socket.on(SocketEventSubscribeEnum.SUBSCRIBE_ROOM_CHAT_CREATED, handleSocketNewChat);
      unauth_socket.on(SocketEventSubscribeEnum.SUBSCRIBE_ROOM_CHAT_DELETED, handleSocketDeleteChat);

      return () => {
        unauth_socket.off(SocketEventSubscribeEnum.SUBSCRIBE_ROOM_CHAT_CREATED, handleSocketNewChat);
      };
    }
  }, [room_uuid, dispatch]);


  const fetchMoreData = () => {
    const nextOffset = offset + limit;
    setOffset(nextOffset);
    dispatch(getRoomChats({ room_uuid: room_uuid, limit: limit, offset: nextOffset }));
  };

  const togglePicker = () => {
    setIsEmojiPickerOpen((prev) => !prev);
  };
  const onEmojiClick = (emojiData: any) => {
    setMessage((prev) => prev + emojiData.emoji);
  };

  const handleSend = async () => {
    try {
      if (!message.trim() || message.length > 2000) {
        enqueueSnackbar("message length should be 0-2000", { variant: "warning" });
        return;
      }
      if (!member?.uuid) {
        enqueueSnackbar("Not a member right now", { variant: "info" });
        return;
      }

      await dispatch(createRoomChat({ member_uuid: member?.uuid, message: message, room_uuid })).unwrap();

      setIsEmojiPickerOpen(false);
      setMessage('');
    } catch (error: any) {
      enqueueSnackbar(error, { variant: "error" });
      console.log(error);
    }
  };

  const handleDeleteChat = async (chat_uuid: string, room_uuid: string) => {
    try {
      await dispatch(deleteRoomChat({ chat_uuid, room_uuid })).unwrap();
      enqueueSnackbar("Message deleted", { variant: "success" });
    } catch (error: any) {
      enqueueSnackbar(error, { variant: "error" });
    }
  };

  const handleKeyPress = (e: any) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  return (
    <Box className={styles.container}>
      <Box className={styles.leftContainer}>
        <Box id="scrollableDiv" className={styles.scrollWrapper}>
          <InfiniteScroll
            dataLength={chats.length}
            next={fetchMoreData}
            hasMore={chats.length < totalChats}
            loader={<Box className={styles.loader}><CircularProgress size={30} /></Box>}
            inverse={true}
            // endMessage={<Typography className={styles.endMessage}>Yay! You have seen it all</Typography>}
            scrollableTarget="scrollableDiv"
          >
            <Box className={styles.roomChatWrapper}>
              {chats.map((chat: RoomChat) => {
                const member = members.find((member) => member.user_uuid == chat.member?.user_uuid);

                return (
                  <Box key={chat.uuid} className={styles.chatMessage}>
                    <Box className={styles.avatarBox}>
                      <Image src={member?.user.profile_image || ''} width={100} height={100} alt="Profile image not found" className={styles.profileImage} />
                      <FiberManualRecordIcon className={member?.user.is_online ? styles.bottomGreenDotMessaging : styles.bottomGrayDotMessaging} />
                    </Box>

                    <Box className={styles.messageContent}>
                      <Box className={styles.messageInfo}>
                        <Typography variant="caption" className={styles.chatEmail}>
                          {member ? member.user.email : 'N/A'}
                        </Typography>
                        <Typography variant="caption" className={styles.messageTime}>
                          {new Date(chat.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                        </Typography>
                        {member?.room.creator.uuid === member?.user_uuid && <Typography variant="caption" className={styles.creatorTag}>
                          CREATOR
                        </Typography>}
                      </Box>

                      <Box className={styles.messageData}>
                        {chat.member?.user_uuid === user?.uuid && (
                          <IconButton size="small" onClick={() => handleDeleteChat(chat.uuid, chat.room_uuid)} className={styles.deleteBtn}>
                            <DeleteIcon fontSize="inherit" />
                          </IconButton>
                        )}
                        <Typography className={styles.messageText}>{chat.message}</Typography>
                      </Box>
                    </Box>
                  </Box>
                );
              })}
            </Box>
          </InfiniteScroll>
        </Box >

        <Box className={styles.inputContainer}>
          <Box className={styles.emojiPickerBox}>
            {isEmojiPickerOpen && (
              <EmojiPicker onEmojiClick={onEmojiClick} />
            )}
          </Box>

          <Box sx={{ display: 'flex', gap: 1 }}>
            <IconButton
              className={`${styles.actionButton} ${styles.sendButton}`}
              size="small"
              onClick={togglePicker}
            >
              <EmojiEmotionsIcon />
            </IconButton>
          </Box>

          <Box className={styles.inputWrapper}>
            <TextField
              placeholder="Join as Member to Chat"
              multiline
              minRows={1}
              maxRows={10}
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              onKeyDown={handleKeyPress}
              className={styles.inputField}
              slotProps={{
                input: {
                  className: (styles.inputField),
                },
              }}
            />
          </Box>

          <IconButton
            className={`${styles.actionButton} ${(message.trim() && message.length <= 2000) ? styles.sendButton : ''}`}
            onClick={handleSend}
          >
            <SendIcon fontSize="small" />
          </IconButton>
        </Box>
      </Box>

      <Box className={styles.rightContainer}>
      </Box >

      <Typography className={styles.middleTitle}>Room created by {member?.room.creator.email || 'N/A'} • Welcome to DecaChat</Typography>
    </Box >
  );
}