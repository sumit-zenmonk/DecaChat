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
  const { user } = useAppSelector((state: RootState) => state.authReducer);
  const { publicRooms, publicRoomsTotalDocuments, joinedRooms, viewerCounts } = useAppSelector((state: RootState) => state.roomReducer);
  const { roomMembersTotalDocuments } = useAppSelector((state: RootState) => state.roomMemberReducer);
  const [offset, setOffset] = useState(Number(process.env.NEXT_PUBLIC_PAGE_OFFSET) || 0);
  const limit = Number(process.env.NEXT_PUBLIC_PAGE_LIMIT) || 10;
  const ROOM_MEMBER_LIMIT = Number(process.env.NEXT_PUBLIC_ROOM_MEMBER_LIMIT) || 10;
  const [value, setValue] = useState('active');
  const [searchQuery, setSearchQuery] = useState("");

  useEffect(() => {
    const delayDebounceFn = setTimeout(() => {
      setOffset(0);
      dispatch(getPublicRooms({ limit, offset: 0, search: searchQuery })).unwrap();
    }, 500);

    return () => clearTimeout(delayDebounceFn);
  }, [searchQuery]);

  useEffect(() => {
    if (!joinedRooms.length && user) {
      dispatch(getJoinedRooms({ limit, offset: 0, })).unwrap();
    }
  }, [user]);

  const fetchRooms = async () => {
    try {
      if (publicRooms.length >= publicRoomsTotalDocuments) return;

      const newOffset = offset + limit;
      setOffset(newOffset);
      await dispatch(getPublicRooms({ limit, offset: newOffset, search: searchQuery })).unwrap();
      if (user) {
        await dispatch(getJoinedRooms({ limit, offset: newOffset, })).unwrap();
      }
    } catch (error: any) {
      enqueueSnackbar(error, { variant: "error" });
      console.log(error);
    }
  };

  const handleRoomJoin = async (uuid: string) => {
    try {
      if (!user) {
        enqueueSnackbar("Login for conversation", { variant: "info" });
        return;
      }
      const memberCount = roomMembersTotalDocuments[uuid] || 1;
      if (memberCount >= ROOM_MEMBER_LIMIT) {
        enqueueSnackbar("Max Limit Exceeded", { variant: "error" });
        return;
      }
      await dispatch(createRoomMember({ room_uuid: uuid })).unwrap();
    } catch (error: any) {
      enqueueSnackbar(error, { variant: "error" });
      console.log(error);
    }
  };

  const handleTabChange = (event: React.SyntheticEvent, newValue: string) => {
    setValue(newValue);
  };

  const getFilteredRooms = () => {
    if (!publicRooms) return [];
    switch (value) {
      case 'active':
        return publicRooms.filter((room) => {
          const memberCount = roomMembersTotalDocuments[room.uuid] || 1;
          return memberCount < ROOM_MEMBER_LIMIT;
        });
      case 'full':
        return publicRooms.filter((room) => {
          const memberCount = roomMembersTotalDocuments[room.uuid] || 1;
          return memberCount >= ROOM_MEMBER_LIMIT;
        });
      case 'newest':
      default:
        return publicRooms;
    }
  };

  const filteredRooms = getFilteredRooms();

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
            type="text"
            fullWidth
            className={styles.textFieldWrapper}
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
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
            onChange={handleTabChange}
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
            dataLength={filteredRooms?.length || 0}
            next={fetchRooms}
            hasMore={publicRooms?.length < publicRoomsTotalDocuments}
            loader={<Box className={styles.loader}><CircularProgress size={30} /></Box>}
            endMessage={<Typography className={styles.endMessage}>Yay! You have seen it all</Typography>}
            scrollableTarget="scrollableDiv"
          >
            <Box className={styles.roomWrapper}>
              {filteredRooms && filteredRooms.map((room: Room) => {
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
                          memberCount <= ROOM_MEMBER_LIMIT ?
                            <Typography className={styles.memberCount}><GroupsIcon />{memberCount} members</Typography> :
                            <Typography className={styles.roomFull}><DoDisturbIcon />Room Full</Typography>
                        }
                      </Box>

                      <Box className={styles.cardButtonBox}>
                        <Button
                          className={styles.joinButton}
                          onClick={() => handleRoomJoin(room.uuid)}
                          disabled={!!isJoined || memberCount >= ROOM_MEMBER_LIMIT}
                        >
                          {!isJoined ? (memberCount >= ROOM_MEMBER_LIMIT ? 'Room Full' : 'Join Room') : 'Already Joined'}
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