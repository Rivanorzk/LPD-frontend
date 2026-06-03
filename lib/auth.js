import api from "@/lib/api"

// LOGIN
export async function loginUser({
  username,
  password,
}) {

  const response = await api.post(
    "/auth/login",
    {
      username,
      password,
    }
  )

  return response.data
}

// REGISTER
export async function registerUser({
  username,
  password,
}) {

  const response = await api.post(
    "/auth/register",
    {
      username,
      password,
    }
  )

  return response.data
}

// SAVE AUTH
export function saveAuth(data) {

  localStorage.setItem(
    "token",
    data.token
  )

  localStorage.setItem(
    "user",
    JSON.stringify(data.user)
  )
}

// LOGOUT
export function logoutUser() {

  localStorage.removeItem("token")
  localStorage.removeItem("user")

  window.location.href = "/login"
}

