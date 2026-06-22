"use client";

import { Box, Button, Card, CardContent, CircularProgress, Tab, Tabs, TextField, Typography } from "@mui/material";
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
import SortListComp from "@/component/sort-comp/sort-comp";
import GroupsIcon from '@mui/icons-material/Groups';
import VisibilityOutlinedIcon from '@mui/icons-material/VisibilityOutlined';
import DoDisturbIcon from '@mui/icons-material/DoDisturb';

export default function Home() {
  const router = useRouter();
  const dispatch = useAppDispatch();
  const { publicRooms, publicRoomsTotalDocuments, joinedRooms, viewerCounts } = useAppSelector((state: RootState) => state.roomReducer);
  const { roomMembersTotalDocuments } = useAppSelector((state: RootState) => state.roomMemberReducer);
  const [offset, setOffset] = useState(Number(process.env.NEXT_PUBLIC_PAGE_OFFSET) || 0);
  const limit = Number(process.env.NEXT_PUBLIC_PAGE_LIMIT) || 10;
  const [value, setValue] = useState('active');
  const handleChange = (event: React.SyntheticEvent, newValue: string) => {
    setValue(newValue);
  };

  useEffect(() => {
    if (!publicRooms.length || !getJoinedRooms.length) {
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
        <Box className={styles.field}>
          <Typography variant="h5" className={styles.title}>
            Find Your Space
          </Typography>

          <Typography variant="h5" className={styles.subTitle}>
            Connect with communities, join real-time discussions, or start your own room instantly.
          </Typography>
        </Box>

        <Box className={styles.field}>
          <TextField
            placeholder="Search rooms, topics, or creators..."
            type="email"
            fullWidth
            className={styles.textFieldWrapper}
            slotProps={{
              input: {
                className: (styles.textField),
              },
            }}
          />
        </Box>
      </Box>

      <Box className={styles.bottomContainer}>
        <Box className={styles.optionContainer}>
          <Tabs
            value={value}
            onChange={handleChange}
            className={styles.tabContainer}
          >
            <Tab value="active" label="Active" className={styles.customTab} />
            <Tab value="full" label="Full" className={styles.customTab} />
            <Tab value="newest" label="Newest" className={styles.customTab} />
          </Tabs>
          <SortListComp />
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
                const isJoined = joinedRooms ? joinedRooms.find((joinRoom: Room) => joinRoom.uuid === room.uuid) : null;
                const memberCount = roomMembersTotalDocuments[room.uuid] || 1;

                return (
                  <Card
                    key={room.uuid}
                    className={styles.card}
                    elevation={2}
                  >
                    <CardContent className={styles.cardContent}>
                      <Box className={styles.cardInfoBox}>
                        <Typography className={styles.roomName}>{room.name}</Typography>
                        {/* <Typography className={styles.description}>{room.description}</Typography> */}
                        <Typography className={styles.memberCount}><VisibilityOutlinedIcon />{viewerCounts[room.uuid] || 0} viewers</Typography>
                        {
                          memberCount < Number(process.env.ROOM_MEMBER_LIMIT) || 10 ?
                            <Typography className={styles.memberCount}><GroupsIcon />{memberCount} members</Typography> :
                            <Typography className={styles.roomFull}><DoDisturbIcon />Room Full</Typography>
                        }
                      </Box>

                      <Box className={styles.cardButtonBox}>
                        <Button
                          className={styles.joinButton}
                          onClick={() => handleJoin(room.uuid)}
                          disabled={!!isJoined}
                        >
                          {!isJoined ? 'Join Room' : 'Already Joined'}
                        </Button>

                        <Button
                          className={styles.viewButton}
                          onClick={() => router.push(`/room/${room.uuid}`)}
                        >
                          View Room
                        </Button>
                      </Box>
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