"use client";

import { Avatar, Box, Button, Card, CardContent, CircularProgress, Container, Divider, Modal, Typography } from "@mui/material";
import styles from "./room.module.css";
import { useEffect, useMemo, useState } from "react";
import { useAppDispatch, useAppSelector } from "@/redux/hooks.ts";
import { getRoomMembers } from "@/redux/feature/member/member-action";
import { useParams, usePathname, useRouter, useSearchParams } from "next/navigation";
import { RootState } from "@/redux/store";
import InfiniteScroll from "react-infinite-scroll-component";
import { RoomMember } from "@/redux/feature/member/member-type";
import { enqueueSnackbar } from "notistack";
import LinkShareComp from "@/component/link-share-comp/link-share-comp";
import ChatIcon from '@mui/icons-material/Chat';
import ShareIcon from '@mui/icons-material/Share';
import GroupsIcon from '@mui/icons-material/Groups';
import TrendingUpIcon from '@mui/icons-material/TrendingUp';
import Image from "next/image";
import { getChatTimeFormat } from "@/utils/time-format";
import FiberManualRecordIcon from '@mui/icons-material/FiberManualRecord';
import { BarChartComp } from "@/component/bar-chart-comp/bar-chart-comp";
import { getRoomChats, getRoomChatsAnalytics } from "@/redux/feature/chat/chat-action";
import CircleIcon from '@mui/icons-material/Circle';

export default function SpecificRoom() {
  const router = useRouter();
  const dispatch = useAppDispatch();
  const [isLinkOpen, setIsLinkOpen] = useState<boolean>(false);
  const { roomChats, roomChatAnalytic } = useAppSelector((state: RootState) => state.chatReducer);
  const { viewerCounts } = useAppSelector((state: RootState) => state.roomReducer);
  const { roomMembers, roomMembersTotalDocuments } = useAppSelector((state: RootState) => state.roomMemberReducer);

  const { room_uuid } = useParams();
  const curr_room_uuid = String(room_uuid);
  const members = roomMembers?.[curr_room_uuid];
  const total_members = roomMembersTotalDocuments?.[curr_room_uuid];
  const onlineCount = members?.filter(member => member.user.is_online).length;

  const limit = Number(process.env.NEXT_PUBLIC_PAGE_LIMIT) || 10;
  const [offset, setOffset] = useState(Number(process.env.NEXT_PUBLIC_PAGE_OFFSET) || 0);

  const pathname = usePathname();
  const searchParams = useSearchParams();
  const title = 'Awesome Room Page please visit once';
  const BACKEND_URL = process.env.NEXT_PUBLIC_BACKEND_URL || "http://localhost:8090";
  const shareUrl = `${BACKEND_URL}${pathname}${searchParams.toString() ? `?${searchParams.toString()}` : ''}`;

  useEffect(() => {
    // if (!roomMembers[curr_room_uuid]?.length) {
      dispatch(getRoomMembers({ room_uuid: curr_room_uuid, limit: 0, offset: 0 })).unwrap();
    // }
  }, []);

  useEffect(() => {
    // if (!roomChats[curr_room_uuid]?.length) {
      dispatch(getRoomChats({ room_uuid: curr_room_uuid, limit: limit, offset: 0 })).unwrap();
    // }
  }, []);

  useEffect(() => {
    // if (!roomChatAnalytic[curr_room_uuid]?.length) {
      dispatch(getRoomChatsAnalytics({ room_uuid: curr_room_uuid })).unwrap();
    // }
  }, []);

  const fetchRooms = async () => {
    try {
      if (members?.length >= total_members) return;

      const newOffset = offset + limit;
      setOffset(newOffset);
      await dispatch(getRoomMembers({ room_uuid: curr_room_uuid, limit, offset: newOffset, })).unwrap();
    } catch (error: any) {
      enqueueSnackbar(error, { variant: "error" });
      console.log(error);
    }
  };

  const labels = roomChatAnalytic[curr_room_uuid]?.map(item => {
    const dateObj = new Date(item.date);
    // Format to a readable string, e.g., "Jun 24"
    return dateObj.toLocaleDateString('en-US', { weekday: 'short' });
  });

  const chartData = {
    labels: labels,
    datasets: [
      {
        label: 'Message Velocity',
        data: roomChatAnalytic[curr_room_uuid]?.map(item => item.count) || 0,
        backgroundColor: ['#A0A3FF', '#C0C1FF'],
      },
    ],
  };

  return (
    <Box className={styles.container}>
      <Box className={styles.header}>
        <Box className={styles.roomInfo}>
          <Typography variant="h4" className={styles.heading}>
            {members?.[0] ? members[0].room.name : "Specific Room"}
          </Typography>

          <Typography className={styles.subHeading}>
            {members?.[0] ? members[0].room.description : "Specific Room Description"}
          </Typography>
        </Box>

        <Box className={styles.roomButtonCard}>
          <Button
            className={styles.roomCard}
            onClick={() => router.push(`/room/${room_uuid}/chat`)}
          >
            <ChatIcon />
            View Live Chat
          </Button>

          <Button
            className={styles.roomCard}
            onClick={() => setIsLinkOpen(!isLinkOpen)}
          >
            <ShareIcon />
            Share Room
          </Button>
        </Box>

        <Box className={styles.roomViewInfo}>
          <Box className={styles.viewInfo}>
            <Typography variant="h2" className={styles.viewTitle}>
              Active Members
            </Typography>
            <Typography variant="h4" className={styles.activeMember}>
              {onlineCount}
            </Typography>
          </Box>

          <Divider orientation="vertical" variant="middle" flexItem className={styles.divider} />

          <Box className={styles.viewInfo}>
            <Typography variant="h2" className={styles.viewTitle}>
              Viewers
            </Typography>
            <Typography variant="h4" className={styles.viewerCount}>
              {viewerCounts[curr_room_uuid] || 0}
            </Typography>
          </Box>
        </Box>
      </Box>

      <Box className={styles.roomSideInfo}>
        <Box className={styles.manangeMemberInfo}>
          <Typography variant="h2" className={styles.manangeMemberTitle}>
            <GroupsIcon className={styles.groupIcon} /> Manage Members
          </Typography>

          <Box id="scrollableDiv" className={styles.scrollWrapper}>
            <InfiniteScroll
              dataLength={members?.length || 0}
              next={fetchRooms}
              hasMore={members?.length < total_members}
              loader={<Box className={styles.loader}><CircularProgress size={30} /></Box>}
              endMessage={<Typography className={styles.endMessage}>Yay! You have seen it all</Typography>}
              scrollableTarget="scrollableDiv"
            >
              <Box className={styles.roomMemberWrapper}>
                {members && members.map((member: RoomMember) => {
                  const lastChat = roomChats[curr_room_uuid]
                    ?.filter(mem => mem.member.user_uuid === member.user_uuid)
                    .sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime())[0];

                  return (
                    <Card
                      key={member.uuid}
                      className={styles.card}
                      elevation={2}
                    >
                      <CardContent className={styles.cardContent}>
                        <Image src={member.user.profile_image} width={100} height={100} alt="Profile image not found" className={styles.profileImage} />
                        <FiberManualRecordIcon className={member.user.is_online ? styles.bottomGreenDotMessaging : styles.bottomGrayDotMessaging} />

                        <Box className={styles.cardBoxContent}>
                          <Typography className={styles.name}>{member.user.name || 'N/A'}</Typography>

                          <Box className={styles.downBox}>
                            <Typography className={styles.email}>{member.user.email}</Typography>
                            <CircleIcon className={styles.downBoxIcon} />
                            <Typography className={styles.lastMessage}>Last Message: {lastChat ? getChatTimeFormat(lastChat.created_at) : 'N/A'}</Typography>
                          </Box>
                        </Box>
                      </CardContent>
                    </Card>
                  );
                })}
              </Box>
            </InfiniteScroll>
          </Box>
        </Box>

        <Box className={styles.roomActivityInfo}>
          <Box className={styles.manageActivityInfo}>
            <Typography variant="h2" className={styles.roomActivityTitle}>
              <TrendingUpIcon className={styles.chartIcon} /> Activity Overview
            </Typography>
          </Box>

          <Box className={styles.manageActivityChart}>
            <Typography variant="h2" className={styles.roomActivityChartTitle}>
              Message Velocity
            </Typography>

            <Box className={styles.manageActivityChartComp}>
              <BarChartComp chartData={chartData} />
            </Box>
          </Box>
        </Box>
      </Box>

      <LinkShareComp open={isLinkOpen} onClose={() => setIsLinkOpen(false)} data={{ shareUrl: shareUrl, title: title }} />
    </Box>
  );
}