"use client"

import styles from "./signup.module.css"
import { useDispatch } from "react-redux"
import { AppDispatch } from "@/redux/store"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { signupSchema, SignupSchemaType } from "@/schemas/signup"
import { signupUser } from "@/redux/feature/auth/auth-action"
import { useRouter } from "next/navigation"
import ForumIcon from '@mui/icons-material/Forum';

import {
    Box,
    Button,
    Card,
    MenuItem,
    TextField,
    Typography
} from "@mui/material"
import { enqueueSnackbar } from "notistack"

export default function SignupForm() {
    const dispatch = useDispatch<AppDispatch>()
    const router = useRouter()
    const {
        register,
        handleSubmit,
        formState: { errors }
    } = useForm<SignupSchemaType>({
        resolver: zodResolver(signupSchema),
    })

    const onSubmit = async (data: SignupSchemaType) => {
        try {
            await dispatch(signupUser(data)).unwrap()
            enqueueSnackbar("User Registered Success", { variant: "success" });
            router.replace("/login")
        } catch (error) {
            enqueueSnackbar(String(error || "Something wrong"), { variant: "error" });
            console.log(error)
        }
    }

    return (
        <Box className={styles.container}>
            <Card className={styles.formWrapper} elevation={3}>
                <Box className={styles.topWrapper}>
                    <ForumIcon className={styles.forumIcon} />

                    <Typography variant="h5" className={styles.title}>
                        Welcome
                    </Typography>

                    <Typography variant="h5" className={styles.description}>
                        Join Us! It's free to join conversation and became member in rooms.
                    </Typography>
                </Box>

                <form onSubmit={handleSubmit(onSubmit)} className={styles.form}>
                    <Box className={styles.field}>
                        <TextField
                            placeholder="Jhon Doe"
                            type="text"
                            fullWidth
                            {...register("name")}
                            className={styles.textField}
                        />
                        {errors.name && (
                            <span className={styles.error}>
                                {errors.name.message}
                            </span>
                        )}
                    </Box>

                    <Box className={styles.field}>
                        <TextField
                            placeholder="JohnDoe@gmail.com"
                            type="email"
                            fullWidth
                            {...register("email")}
                            className={styles.textField}
                        />
                        {errors.email && (
                            <span className={styles.error}>
                                {errors.email.message}
                            </span>
                        )}
                    </Box>

                    <Box className={styles.field}>
                        <TextField
                            placeholder="jhon3243"
                            type="password"
                            fullWidth
                            {...register("password")}
                            className={styles.textField}
                        />
                        {errors.password && (
                            <span className={styles.error}>
                                {errors.password.message}
                            </span>
                        )}
                    </Box>

                    <Box className={styles.field}>
                        <TextField
                            placeholder="jhon3243"
                            type="password"
                            fullWidth
                            {...register("confirmPassword")}
                            className={styles.textField}
                        />
                        {errors.confirmPassword && (
                            <span className={styles.error}>
                                {errors.confirmPassword.message}
                            </span>
                        )}
                    </Box>

                    <Button
                        type="submit"
                        className={styles.button}
                    >
                        Signup
                    </Button>

                    <Button
                        className={styles.loginBtn}
                        onClick={() => router.replace("/login")}
                    >
                        Already have an account?
                    </Button>
                </form>
            </Card>
        </Box >
    )
}