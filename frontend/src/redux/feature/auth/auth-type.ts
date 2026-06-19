export interface User {
  uuid: string
  email: string | null
  profile_image: string | null
  is_online: boolean
}

export interface AuthState {
  user: User | null
  token: string
  loading: boolean
  error: string | null
  status: "pending" | "succeed" | "rejected"
}