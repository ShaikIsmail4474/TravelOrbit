import api from './api'

export const getAllUsers = async () => {
  const response = await api.get('/users')
  return response.data
}

export const updateUser = async (
  userId,
  userData
) => {
  const response = await api.put(
    `/users/${userId}`,
    userData
  )

  return response.data
}

export const updateUserStatus = async (
  userId,
  active
) => {
  const response = await api.put(
    `/users/${userId}/status`,
    null,
    {
      params: {
        active
      }
    }
  )

  return response.data
}