import graphqlClient from './graphqlClient'

const APPLICATION_FIELDS = `
  id
  electionId { id title }
  positionId { id title formFee }
  memberId { id firstName lastName memberNumber }
  manifesto
  photoUrl
  paymentStatus
  paymentReference
  paymentAmount
  paymentDate
  status
  approvedBy { id name }
  approvedAt
  rejectionReason
  rejectedBy { id name }
  rejectedAt
  createdAt
  updatedAt
`

export const getElectionApplications = async (electionId: string) => {
  const query = `
    query GetElectionApplications($electionId: ID!) {
      getElectionApplications(electionId: $electionId) { ${APPLICATION_FIELDS} }
    }
  `
  const response = await graphqlClient.post('', { query, variables: { electionId } })
  if (response.data.errors) throw new Error(response.data.errors[0].message)
  return response.data.data.getElectionApplications
}

export const getMyApplications = async () => {
  const query = `
    query GetMyApplications {
      getMyApplications { ${APPLICATION_FIELDS} }
    }
  `
  const response = await graphqlClient.post('', { query })
  if (response.data.errors) throw new Error(response.data.errors[0].message)
  return response.data.data.getMyApplications
}

export const getMyApplicationForElection = async (electionId: string) => {
  const query = `
    query GetMyApplicationForElection($electionId: ID!) {
      getMyApplicationForElection(electionId: $electionId) { ${APPLICATION_FIELDS} }
    }
  `
  const response = await graphqlClient.post('', { query, variables: { electionId } })
  if (response.data.errors) throw new Error(response.data.errors[0].message)
  return response.data.data.getMyApplicationForElection
}

export const getApplicationsByPosition = async (positionId: string) => {
  const query = `
    query GetApplicationsByPosition($positionId: ID!) {
      getApplicationsByPosition(positionId: $positionId) { ${APPLICATION_FIELDS} }
    }
  `
  const response = await graphqlClient.post('', { query, variables: { positionId } })
  if (response.data.errors) throw new Error(response.data.errors[0].message)
  return response.data.data.getApplicationsByPosition
}

export const getPendingApplications = async (electionId?: string) => {
  const query = `
    query GetPendingApplications($electionId: ID) {
      getPendingApplications(electionId: $electionId) { ${APPLICATION_FIELDS} }
    }
  `
  const response = await graphqlClient.post('', { query, variables: { electionId } })
  if (response.data.errors) throw new Error(response.data.errors[0].message)
  return response.data.data.getPendingApplications
}

export const submitApplication = async (data: {
  electionId: string
  positionId: string
  manifesto: string
  photoBase64?: string
}) => {
  const mutation = `
    mutation SubmitApplication($data: CreateApplicationInput!) {
      submitApplication(data: $data) {
        success
        message
        data { ${APPLICATION_FIELDS} }
      }
    }
  `
  const response = await graphqlClient.post('', { query: mutation, variables: { data } })
  if (response.data.errors) throw new Error(response.data.errors[0].message)
  const result = response.data.data.submitApplication
  if (!result.success) throw new Error(result.message)
  return result
}

export const updateApplicationPayment = async (
  applicationId: string,
  data: { paymentReference: string; paymentAmount: number }
) => {
  const mutation = `
    mutation UpdateApplicationPayment($applicationId: ID!, $data: UpdateApplicationPaymentInput!) {
      updateApplicationPayment(applicationId: $applicationId, data: $data) {
        success
        message
        data { ${APPLICATION_FIELDS} }
      }
    }
  `
  const response = await graphqlClient.post('', { query: mutation, variables: { applicationId, data } })
  if (response.data.errors) throw new Error(response.data.errors[0].message)
  const result = response.data.data.updateApplicationPayment
  if (!result.success) throw new Error(result.message)
  return result
}

export const confirmApplicationPaystackPayment = async (params: {
  applicationId: string
  reference: string
  amount: number
}) => {
  const mutation = `
    mutation ConfirmApplicationPaystackPayment($applicationId: ID!, $reference: String!, $amount: Float!) {
      confirmApplicationPaystackPayment(applicationId: $applicationId, reference: $reference, amount: $amount) {
        success
        message
        data { ${APPLICATION_FIELDS} }
      }
    }
  `
  const response = await graphqlClient.post('', { query: mutation, variables: params })
  if (response.data.errors) throw new Error(response.data.errors[0].message)
  const result = response.data.data.confirmApplicationPaystackPayment
  if (!result.success) throw new Error(result.message)
  return result
}

export const approveApplication = async (applicationId: string) => {
  const mutation = `
    mutation ApproveApplication($data: ApproveApplicationInput!) {
      approveApplication(data: $data) {
        success
        message
        data { ${APPLICATION_FIELDS} }
      }
    }
  `
  const response = await graphqlClient.post('', { query: mutation, variables: { data: { applicationId } } })
  if (response.data.errors) throw new Error(response.data.errors[0].message)
  const result = response.data.data.approveApplication
  if (!result.success) throw new Error(result.message)
  return result
}

export const rejectApplication = async (applicationId: string, rejectionReason: string) => {
  const mutation = `
    mutation RejectApplication($data: RejectApplicationInput!) {
      rejectApplication(data: $data) {
        success
        message
        data { ${APPLICATION_FIELDS} }
      }
    }
  `
  const response = await graphqlClient.post('', {
    query: mutation,
    variables: { data: { applicationId, rejectionReason } },
  })
  if (response.data.errors) throw new Error(response.data.errors[0].message)
  const result = response.data.data.rejectApplication
  if (!result.success) throw new Error(result.message)
  return result
}

export const deleteApplication = async (applicationId: string) => {
  const mutation = `
    mutation DeleteApplication($applicationId: ID!) {
      deleteApplication(applicationId: $applicationId) {
        success
        message
      }
    }
  `
  const response = await graphqlClient.post('', { query: mutation, variables: { applicationId } })
  if (response.data.errors) throw new Error(response.data.errors[0].message)
  const result = response.data.data.deleteApplication
  if (!result.success) throw new Error(result.message)
  return result
}
