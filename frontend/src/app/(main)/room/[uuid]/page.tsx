"use client";

import { Avatar, Box, Button, Card, CardContent, CircularProgress, Container, Modal, Typography } from "@mui/material";
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

export default function SpecificRoom() {
  const dispatch = useAppDispatch();
  const router = useRouter();
  const { uuid } = useParams();
  const room_uuid = String(uuid);
  const { roomMembers, roomMembersTotalDocuments } = useAppSelector((state: RootState) => state.roomMemberReducer);
  const { user } = useAppSelector((state: RootState) => state.authReducer);
  const members = roomMembers?.[room_uuid];
  const total_members = roomMembersTotalDocuments?.[room_uuid];
  const [offset, setOffset] = useState(Number(process.env.NEXT_PUBLIC_PAGE_OFFSET) || 0);
  const limit = Number(process.env.NEXT_PUBLIC_PAGE_LIMIT) || 10;
  const [isLinkOpen, setIsLinkOpen] = useState<boolean>(false);

  const pathname = usePathname();
  const BACKEND_URL = process.env.NEXT_PUBLIC_BACKEND_URL || "http://localhost:8090";
  const searchParams = useSearchParams();
  const shareUrl = `${BACKEND_URL}${pathname}${searchParams.toString() ? `?${searchParams.toString()}` : ''}`;
  const title = 'Awesome Room Page please visit once';

  useEffect(() => {
    dispatch(getRoomMembers({ room_uuid: room_uuid, limit: 0, offset: 0 })).unwrap();
  }, []);

  const fetchRooms = async () => {
    try {
      if (members?.length >= total_members) return;

      const newOffset = offset + limit;
      setOffset(newOffset);
      await dispatch(getRoomMembers({ room_uuid: room_uuid, limit, offset: newOffset, })).unwrap();
    } catch (error: any) {
      enqueueSnackbar(error, { variant: "error" });
      console.log(error);
    }
  };

  return (
    <Box className={styles.container}>
      <Box className={styles.header}>
        <Typography variant="h4" className={styles.heading}>
          {members?.[0] ? members[0].room.name : "Specific Room"}'s Members
        </Typography>

        <Typography className={styles.subHeading}>
          {members?.[0] ? members[0].room.description : "Specific Room Description"}
        </Typography>
      </Box>

      <Box className={styles.sideButtonCard}>
        <Button
          onClick={() => router.push(`/room/${room_uuid}/chat`)}
        >
          View Chat
        </Button>

        <Button
          className={styles.deleteRoom}
          onClick={() => setIsLinkOpen(!isLinkOpen)}
        >
          Share Room
        </Button>
      </Box>

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
              return (
                <Card
                  key={member.uuid}
                  className={styles.card}
                  elevation={2}
                >
                  <CardContent className={styles.cardContent}>
                    <Typography className={styles.roomMemberName}>Name : {member.user.name}</Typography>
                    <Typography className={styles.email}>Email : {member.user.email}</Typography>
                    <Typography className={styles.role}>Role : {member.role}</Typography>
                    <Typography variant="body2" style={{ color: member.user.is_online ? '#4caf50' : '#757575', fontWeight: 'bold' }}>
                      Status: {member.user.is_online ? 'Online' : 'Offline'}
                    </Typography>
                  </CardContent>
                </Card>
              );
            })}
          </Box>
        </InfiniteScroll>
      </Box>

      <LinkShareComp open={isLinkOpen} onClose={() => setIsLinkOpen(false)} data={{ shareUrl: shareUrl, title: title }} />
    </Box>
  );
}