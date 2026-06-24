"use client";

import React, { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useAppDispatch, useAppSelector } from "@/redux/hooks.ts";
import { Modal, Box, Typography, TextField, Button, IconButton, } from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import styles from "./create-room.module.css";
import { CreateRoomSchema, CreateRoomSchemaSchemaType } from "@/schemas/create-room";
import { createRoom } from "@/redux/feature/room/room-action";
import { enqueueSnackbar } from "notistack";

interface RoomModalProps {
    isOpen: boolean;
    onClose: () => void;
}

export default function CreateRoomModal({ isOpen, onClose }: RoomModalProps) {
    const dispatch = useAppDispatch();

    const {
        register,
        handleSubmit,
        reset,
        formState: { errors },
    } = useForm<CreateRoomSchemaSchemaType>({
        resolver: zodResolver(CreateRoomSchema),
        defaultValues: {
            description: "Make your space better for every member.........",
            name: "Your Space"
        },
    });

    useEffect(() => {
        if (isOpen) {
            reset();
        };
    }, [isOpen, reset]);

    const onSubmit = async (data: CreateRoomSchemaSchemaType) => {
        try {
            await dispatch(createRoom(data)).unwrap();
            reset();
            onClose();
            enqueueSnackbar("Room created successfully", { variant: "success" });
        } catch (error: any) {
            enqueueSnackbar(error, { variant: "error" });
            console.log(error);
        }
    };

    return (
        <Modal open={isOpen} onClose={onClose}>
            <Box className={styles.modalContainer}>
                <Box className={styles.header}>
                    <Typography variant="h6">
                        Add Room
                    </Typography>
                </Box>

                <form onSubmit={handleSubmit(onSubmit)} className={styles.form}>

                    <Box className={styles.fieldBox}>
                        <Box className={styles.field}>
                            <TextField
                                placeholder="Name"
                                {...register("name")}
                                error={!!errors.name}
                                helperText={errors.name?.message}
                                fullWidth
                                slotProps={{
                                    input: {
                                        // startAdornment: (
                                        //     <EmailOutlinedIcon className={styles.fieldIcon} />
                                        // ),
                                        className: (styles.textField),
                                    },
                                }}
                            />
                        </Box>
                    </Box>

                    <Box className={styles.fieldBox}>
                        <Box className={styles.field}>
                            <TextField
                                placeholder="Description"
                                {...register("description")}
                                error={!!errors.description}
                                helperText={errors.description?.message}
                                fullWidth
                                multiline
                                minRows={4}
                                maxRows={6}
                                slotProps={{
                                    input: {
                                        // startAdornment: (
                                        //     <EmailOutlinedIcon className={styles.fieldIcon} />
                                        // ),
                                        className: (styles.textField),
                                    },
                                }}
                            />
                        </Box>
                    </Box>


                    <Button
                        type="submit"
                        fullWidth
                        className={styles.AddRoomButton}
                    // disabled={loading}
                    // startIcon={loading && <CircularProgress size={20} />}
                    >
                        Add Room
                    </Button>
                </form>

                <IconButton onClick={onClose} className={styles.closebtn}>
                    <CloseIcon />
                </IconButton>
            </Box>
        </Modal>
    );
}