"use client"

import styles from "./login.module.css"
import { useDispatch } from "react-redux"
import { AppDispatch } from "@/redux/store"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { loginSchema, LoginSchemaType } from "@/schemas/login"
import { loginUser } from "@/redux/feature/auth/auth-action"
import { useRouter } from "next/navigation"
import ForumIcon from '@mui/icons-material/Forum';

import {
    Box,
    Button,
    Card,
    TextField,
    Typography,
    Divider
} from "@mui/material"
import { enqueueSnackbar } from "notistack"
import Image from "next/image"

export default function LoginForm() {
    const dispatch = useDispatch<AppDispatch>()
    const router = useRouter()

    const {
        register,
        handleSubmit,
        formState: { errors }
    } = useForm<LoginSchemaType>({
        resolver: zodResolver(loginSchema)
    })

    const onSubmit = async (data: LoginSchemaType) => {
        try {
            await dispatch(loginUser(data)).unwrap()
            router.replace("/")
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

                    <Button
                        type="submit"
                        className={styles.button}
                    >
                        Login
                    </Button>

                    <Button
                        variant="text"
                        className={styles.button}
                        onClick={() => router.replace("/signup")}
                    >
                        Create New Account?
                    </Button>

                    <Divider className={styles.divider}>OR</Divider>

                    <Button
                        className={styles.providerLoginBox}
                    >
                        {/* <GoogleIcon /> */}
                        <Image
                            src={'/google.png'}
                            alt="google icon"
                            width={25}
                            height={25}
                        />
                        <Typography>
                            Login with Google
                        </Typography>
                    </Button>
                </form>
            </Card>
        </Box>
    )
}