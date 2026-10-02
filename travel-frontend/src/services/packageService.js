import api from './api'

export const getPackages = async () => {
  const response = await api.get('/packages')
  return response.data
}

export const getPackageById = async (id) => {
  const response = await api.get(`/packages/${id}`)
  return response.data
}