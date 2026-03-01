import axios from 'axios'

const client = axios.create({
  baseURL: '/api',
  timeout: 120000,
})

export const analyzeFile = async (file) => {
  const form = new FormData()
  form.append('file', file)
  const { data } = await client.post('/analyses/', form, {
    headers: { 'Content-Type': 'multipart/form-data' },
  })
  return data
}

export const getAnalysis = async (id) => {
  const { data } = await client.get(`/analyses/${id}`)
  return data
}

export const listAnalyses = async (skip = 0, limit = 20) => {
  const { data } = await client.get('/analyses/', { params: { skip, limit } })
  return data
}

export const deleteAnalysis = async (id) => {
  await client.delete(`/analyses/${id}`)
}

export const compareAnalyses = async (id1, id2) => {
  const { data } = await client.post('/analyses/compare', {
    analysis_id_1: id1,
    analysis_id_2: id2,
  })
  return data
}

export const getReportUrl = (id) => `/api/analyses/${id}/report`

export const getHealth = async () => {
  const { data } = await client.get('/health')
  return data
}

export const getConfig = async () => {
  const { data } = await client.get('/config')
  return data
}
