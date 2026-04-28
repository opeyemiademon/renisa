import graphqlClient from './graphqlClient'

const SPORT_FIELDS = `id name order isActive createdAt`

export const getSports = async (activeOnly?: boolean) => {
  const query = `
    query GetSports($activeOnly: Boolean) {
      getSports(activeOnly: $activeOnly) { ${SPORT_FIELDS} }
    }
  `
  const response = await graphqlClient.post('', { query, variables: { activeOnly } })
  if (response.data.errors) throw new Error(response.data.errors[0].message)
  return response.data.data.getSports as { id: string; name: string; order: number; isActive: boolean; createdAt: string }[]
}

export const createSport = async (name: string) => {
  const mutation = `
    mutation CreateSport($name: String!) {
      createSport(name: $name) { success message data { ${SPORT_FIELDS} } }
    }
  `
  const response = await graphqlClient.post('', { query: mutation, variables: { name } })
  if (response.data.errors) throw new Error(response.data.errors[0].message)
  return response.data.data.createSport
}

export const deleteSport = async (id: string) => {
  const mutation = `
    mutation DeleteSport($id: ID!) {
      deleteSport(id: $id) { success message }
    }
  `
  const response = await graphqlClient.post('', { query: mutation, variables: { id } })
  if (response.data.errors) throw new Error(response.data.errors[0].message)
  return response.data.data.deleteSport
}

export const updateSport = async (id: string, data: { name?: string; isActive?: boolean }) => {
  const mutation = `
    mutation UpdateSport($id: ID!, $name: String, $isActive: Boolean) {
      updateSport(id: $id, name: $name, isActive: $isActive) { success message data { ${SPORT_FIELDS} } }
    }
  `
  const response = await graphqlClient.post('', { query: mutation, variables: { id, ...data } })
  if (response.data.errors) throw new Error(response.data.errors[0].message)
  return response.data.data.updateSport
}
