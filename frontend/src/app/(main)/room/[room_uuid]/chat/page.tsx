"use client";

import { Box, Button, CircularProgress, Container, Typography, TextField, IconButton, Drawer, Card, CardContent, Avatar } from "@mui/material";
import styles from "./chat.module.css";
import { useEffect, useMemo, useState } from "react";
import { useAppDispatch, useAppSelector } from "@/redux/hooks.ts";
import { createRoomMember, getRoomMembers } from "@/redux/feature/member/member-action";
import { useParams, useRouter } from "next/navigation";
import { RootState } from "@/redux/store";
import InfiniteScroll from "react-infinite-scroll-component";
import SendIcon from '@mui/icons-material/Send';
import EmojiEmotionsIcon from '@mui/icons-material/EmojiEmotions';
import { enqueueSnackbar } from "notistack";
import { createRoomChat, deleteRoomChat, getRoomChats } from "@/redux/feature/chat/chat-action";
import DeleteIcon from '@mui/icons-material/Delete';
import { connectUnAuthSocket } from "@/service/socket/socket";
import { SocketEventSubscribeEnum } from "@/service/socket/socket-event.enum";
import { addChat, removeChat } from "@/redux/feature/chat/chat-slice";
import { RoomChat } from "@/redux/feature/chat/chat-type";
import Image from "next/image";
import FiberManualRecordIcon from '@mui/icons-material/FiberManualRecord';
import EmojiPicker from 'emoji-picker-react';
import { RoomMember } from "@/redux/feature/member/member-type";
import PersonAddAlt1Icon from '@mui/icons-material/PersonAddAlt1';
let unauth_socket: any;

export default function SpecificRoomChat() {
  const dispatch = useAppDispatch();
  const { room_uuid } = useParams();
  const curr_room_uuid = String(room_uuid);
  const { roomMembers, roomMembersTotalDocuments } = useAppSelector((state: RootState) => state.roomMemberReducer);
  const { chatDrawerState } = useAppSelector((state: RootState) => state.commonReducer);
  const { user } = useAppSelector((state: RootState) => state.authReducer);
  const { roomChats, roomChatsTotalDocuments, loading } = useAppSelector((state: RootState) => state.chatReducer);
  const [message, setMessage] = useState('');
  const [isEmojiPickerOpen, setIsEmojiPickerOpen] = useState(false);

  const members = roomMembers?.[curr_room_uuid];
  const memberCount = roomMembersTotalDocuments[curr_room_uuid] || 1;
  const chats = roomChats?.[curr_room_uuid] || [];
  const total_members = roomMembersTotalDocuments?.[curr_room_uuid];
  const totalChats = roomChatsTotalDocuments?.[curr_room_uuid] || 0;
  const member = roomMembers?.[curr_room_uuid]?.find((member) => member.user_uuid == user?.uuid);

  const [offset, setOffset] = useState(0);
  const limit = Number(process.env.NEXT_PUBLIC_PAGE_LIMIT) || 10;
  const ROOM_MEMBER_LIMIT = Number(process.env.NEXT_PUBLIC_ROOM_MEMBER_LIMIT) || 10;

  useEffect(() => {
    if (!roomMembers[curr_room_uuid]?.length || !roomChats[curr_room_uuid]?.length) {
      dispatch(getRoomMembers({ room_uuid: curr_room_uuid, limit: 0, offset: 0 })).unwrap();
      dispatch(getRoomChats({ room_uuid: curr_room_uuid, limit: limit, offset: 0 })).unwrap();
    }
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
    dispatch(getRoomChats({ room_uuid: curr_room_uuid, limit: limit, offset: nextOffset }));
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
      if (!user) {
        enqueueSnackbar("Login for conversation", { variant: "info" });
        return;
      }
      if (!member?.uuid) {
        enqueueSnackbar("Not a member right now", { variant: "info" });
        return;
      }

      await dispatch(createRoomChat({ member_uuid: member?.uuid, message: message, room_uuid: curr_room_uuid })).unwrap();

      setIsEmojiPickerOpen(false);
      setMessage('');
    } catch (error: any) {
      enqueueSnackbar(error, { variant: "error" });
      console.log(error);
    }
  };

  const handleDeleteChat = async (chat_uuid: string, room_uuid: string) => {
    try {
      if (!user) {
        enqueueSnackbar("Login for conversation", { variant: "info" });
        return;
      }
      await dispatch(deleteRoomChat({ chat_uuid, room_uuid })).unwrap();
      enqueueSnackbar("Message deleted", { variant: "success" });
    } catch (error: any) {
      enqueueSnackbar(error, { variant: "error" });
    }
  };

  const handleKeyPress = async (e: any) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      await handleSend();
    }
  };

  const handleRoomJoin = async () => {
    try {
      if (!user) {
        enqueueSnackbar("Login for conversation", { variant: "info" });
        return;
      }
      if (members?.length >= ROOM_MEMBER_LIMIT) {
        enqueueSnackbar("Max Limit Exceeded", { variant: "error" });
        return;
      }
      await dispatch(createRoomMember({ room_uuid: curr_room_uuid })).unwrap();
    } catch (error: any) {
      enqueueSnackbar(error, { variant: "error" });
      console.log(error);
    }
  };

  return (
    <Box className={styles.container}>
      <Box className={chatDrawerState ? styles.leftContainerDrawerOpen : styles.leftContainer}>
        <Box id="scrollableDiv" className={styles.scrollWrapper}>
          <InfiniteScroll
            dataLength={chats.length}
            next={fetchMoreData}
            hasMore={chats.length < totalChats}
            loader={<Box className={styles.loader}><CircularProgress size={30} /></Box>}
            inverse={true}
            endMessage={<Typography className={styles.endMessage}>Yay! You have seen it all</Typography>}
            scrollableTarget="scrollableDiv"
          >
            <Box className={styles.roomChatWrapper}>
              {chats.map((chat: RoomChat) => {
                const member = members?.find((member) => member.user_uuid == chat.member?.user_uuid);

                return (
                  <Box key={chat.uuid} className={styles.chatMessage}>
                    <Box className={styles.avatarBox}>
                      <Image src={member?.user.profile_image || ''} width={100} height={100} alt="Profile image not found" className={styles.profileImage} />
                      {/* <FiberManualRecordIcon className={member?.user.is_online ? styles.bottomGreenDotMessaging : styles.bottomGrayDotMessaging} /> */}
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

            <Box className={chatDrawerState ? styles.emojiPickerBoxDrawerOpen : styles.emojiPickerBox}>
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
            <IconButton
              className={`${styles.actionButton} ${(message.trim() && message.length <= 2000) ? styles.sendButton : ''}`}
              onClick={handleSend}
            >
              <SendIcon fontSize="small" />
            </IconButton>
          </Box>
        </Box>
      </Box>

      <Drawer
        variant="persistent"
        anchor="right"
        open={chatDrawerState}
        sx={{
          '& .MuiDrawer-paper': {
            width: '20%',
            height: '93%',
            marginTop: '3.5%',
            bgcolor:'transparent'
          },
        }}
      >
        <Box className={styles.rightContainer}>
          <Box className={styles.topBox}>
            <Typography variant="h5" className={styles.title}>
              Members
            </Typography>

            <Typography variant="h5" className={styles.subTitle}>
              {memberCount}/{ROOM_MEMBER_LIMIT}
            </Typography>
          </Box>

          <Box className={styles.middleBox}>
            {members && members.map((member: RoomMember) => {
              return (
                <Card
                  key={member.uuid}
                  className={styles.card}
                  elevation={2}
                >
                  <CardContent className={styles.cardContent}>
                    <Image src={member.user.profile_image} width={50} height={50} alt="Profile image not found" className={styles.profileSideImage} />
                    <FiberManualRecordIcon className={member.user.is_online ? styles.bottomGreenDotSideMessaging : styles.bottomGrayDotSideMessaging} />

                    <Box className={styles.cardBoxContent}>
                      <Typography className={styles.email}>{member.user.email}</Typography>
                      <Typography className={styles.role}>{member.role.toUpperCase()}</Typography>
                    </Box>
                  </CardContent>
                </Card>
              );
            })}
            {Array.from({ length: ROOM_MEMBER_LIMIT - members?.length }).map((_, index) => {
              const number = index + 1;
              return (
                <Card
                  key={number}
                  className={styles.dummyCard}
                  elevation={2}
                >
                  <CardContent className={styles.cardContent}>
                    <Avatar alt="join to see you" className={styles.sideAvatar}>+</Avatar>

                    <Box className={styles.cardBoxContent}>
                      <Typography className={styles.email}>Open Slot</Typography>
                    </Box>
                  </CardContent>
                </Card>
              );
            })}
          </Box>

          <Box className={styles.bottomBox}>
            {
              !member ?
                <Button className={styles.joinRoomButton} onClick={() => handleRoomJoin()}>
                  <PersonAddAlt1Icon />
                  Join as Member
                </Button>
                :
                <></>
            }
          </Box>
        </Box >
      </Drawer>

      <Typography className={chatDrawerState ? styles.middleTitleDrawerOpen : styles.middleTitle}>Room created by {member?.room.creator.email || 'N/A'} • Welcome to DecaChat</Typography>
    </Box >
  );
}