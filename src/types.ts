export type Session = {
	type?: "login_username" | "login_password" | "add_lesson"
	username?: string
	admin?: boolean
}