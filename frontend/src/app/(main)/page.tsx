"use client";

import { Box, Button, Card, CardContent, CircularProgress, TextField, Typography } from "@mui/material";
import styles from "./home.module.css";
import { useEffect, useState } from "react";
import { useAppDispatch, useAppSelector } from "@/redux/hooks.ts";
import { RootState } from "@/redux/store";
import { getJoinedRooms, getPublicRooms } from "@/redux/feature/room/room-action";
import { enqueueSnackbar } from "notistack";
import { createRoomMember } from "@/redux/feature/member/member-action";
import { Room } from "@/redux/feature/room/room-type";
import { useRouter } from "next/navigation";
import InfiniteScroll from "react-infinite-scroll-component";

export default function Home() {
  const router = useRouter();
  const dispatch = useAppDispatch();
  const { publicRooms, publicRoomsTotalDocuments, joinedRooms } = useAppSelector((state: RootState) => state.roomReducer);
  const { roomMembersTotalDocuments } = useAppSelector((state: RootState) => state.roomMemberReducer);
  const { user } = useAppSelector((state: RootState) => state.authReducer);
  const [offset, setOffset] = useState(Number(process.env.NEXT_PUBLIC_PAGE_OFFSET) || 0);
  const limit = Number(process.env.NEXT_PUBLIC_PAGE_LIMIT) || 10;

  useEffect(() => {
    if (!publicRooms.length) {
      dispatch(getJoinedRooms({ limit, offset: 0, })).unwrap();
      dispatch(getPublicRooms({ limit, offset: 0, })).unwrap();
    }
  }, []);

  const fetchRooms = async () => {
    try {
      if (publicRooms.length >= publicRoomsTotalDocuments) return;

      const newOffset = offset + limit;
      setOffset(newOffset);
      await dispatch(getPublicRooms({ limit, offset: newOffset, })).unwrap();
    } catch (error: any) {
      enqueueSnackbar(error, { variant: "error" });
      console.log(error);
    }
  };

  const handleJoin = async (uuid: string) => {
    try {
      await dispatch(createRoomMember({ room_uuid: uuid })).unwrap();
    } catch (error: any) {
      enqueueSnackbar(error, { variant: "error" });
      console.log(error);
    }
  };


  return (
    <Box className={styles.container}>
      <Box className={styles.topContainer}>
        <Typography variant="h5" className={styles.title}>
          Find Your Space
        </Typography>

        <Typography variant="h5" className={styles.description}>
          Connect with communities, join real-time discussions, or start your own room instantly.
        </Typography>

        <Box className={styles.field}>
          <TextField
            placeholder="Search rooms, topics, or creators..."
            type="email"
            fullWidth
            slotProps={{
              input: {
                className: (styles.textField),
              },
            }}
          />
        </Box>
      </Box>

      <Box className={styles.bottomContainer}>
        <Box className={styles.header}>

        </Box>

        <Box id="scrollableDiv" className={styles.scrollWrapper}>
          <InfiniteScroll
            dataLength={publicRooms?.length || 0}
            next={fetchRooms}
            hasMore={publicRooms?.length < publicRoomsTotalDocuments}
            loader={<Box className={styles.loader}><CircularProgress size={30} /></Box>}
            endMessage={<Typography className={styles.endMessage}>Yay! You have seen it all</Typography>}
            scrollableTarget="scrollableDiv"
          >
            <Box className={styles.roomWrapper}>
              {publicRooms && publicRooms.map((room: Room) => {
                const isJoined = joinedRooms ? joinedRooms.find((joinRoom) => joinRoom.uuid === room.uuid) : [];
                const memberCount = roomMembersTotalDocuments[room.uuid] || 1;

                return (
                  <Card
                    key={room.uuid}
                    className={styles.card}
                    elevation={2}
                  >
                    {/* <Box className={bannerStyles.banner} style={{ backgroundImage: randomImageUrl() }} >
                      <Box className={bannerStyles.memberCount}>
                        {memberCount}/{process.env.ROOM_MEMBER_LIMIT || 10}
                      </Box>
                    </Box> */}

                    <CardContent className={styles.cardContent}>
                      <Typography className={styles.roomName}>{room.name}</Typography>
                      <Typography className={styles.description}>{room.description}</Typography>

                      {
                        user &&
                        <Button
                          onClick={() => handleJoin(room.uuid)}
                          disabled={!!isJoined}
                        >
                          {
                            !isJoined ?
                              'Join' : 'Already joined'
                          }
                        </Button>
                      }
                      <Button
                        onClick={() => router.push(`/room/${room.uuid}`)}
                      >
                        View Room
                      </Button>
                    </CardContent>
                  </Card>
                );
              })}
            </Box>
          </InfiniteScroll>
        </Box>

      </Box>
    </Box>
  );
}