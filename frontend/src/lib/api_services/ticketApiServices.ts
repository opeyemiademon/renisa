import graphqlClient from './graphqlClient'

const TICKET_FIELDS = `
  id
  subject
  description
  status
  priority
  attachments
  closedAt
  closedBy
  createdAt
  
  member {
    id
    firstName
    lastName
    memberNumber
    profilePicture
    email
  }
  replies {
    id
    authorId
    authorType
    authorName
    message
    attachments
    createdAt
  }
`

export const getMyTickets = async (status?: string) => {
  const res = await graphqlClient.post('', {
    query: `
      query GetMyTickets($status: String) {
        getMyTickets(status: $status) { ${TICKET_FIELDS} }
      }
    `,
    variables: { status },
  })
  if (res.data.errors) throw new Error(res.data.errors[0].message)
  return res.data.data.getMyTickets
}

export const getTicket = async (id: string) => {
  const res = await graphqlClient.post('', {
    query: `
      query GetTicket($id: ID!) {
        getTicket(id: $id) { ${TICKET_FIELDS} }
      }
    `,
    variables: { id },
  })
  if (res.data.errors) throw new Error(res.data.errors[0].message)
  return res.data.data.getTicket
}

export const getAllTickets = async (filters?: { status?: string; memberId?: string; priority?: string }) => {
  const res = await graphqlClient.post('', {
    query: `
      query GetAllTickets($status: String, $memberId: ID, $priority: String) {
        getAllTickets(status: $status, memberId: $memberId, priority: $priority) { ${TICKET_FIELDS} }
      }
    `,
    variables: { status: filters?.status, memberId: filters?.memberId, priority: filters?.priority },
  })
  if (res.data.errors) throw new Error(res.data.errors[0].message)
  return res.data.data.getAllTickets
}

export const createTicket = async (data: {
  subject: string
  description: string
  priority?: string
  attachments?: string[]
}) => {
  const res = await graphqlClient.post('', {
    query: `
      mutation CreateTicket($data: CreateTicketInput!) {
        createTicket(data: $data) {
          success message
          ticket { ${TICKET_FIELDS} }
        }
      }
    `,
    variables: { data },
  })
  if (res.data.errors) throw new Error(res.data.errors[0].message)
  return res.data.data.createTicket
}

export const replyToTicket = async (data: { ticketId: string; message: string; attachments?: string[] }) => {
  const res = await graphqlClient.post('', {
    query: `
      mutation ReplyToTicket($data: ReplyTicketInput!) {
        replyToTicket(data: $data) {
          success message
          ticket { ${TICKET_FIELDS} }
        }
      }
    `,
    variables: { data },
  })
  if (res.data.errors) throw new Error(res.data.errors[0].message)
  return res.data.data.replyToTicket
}

export const adminReplyToTicket = async (data: { ticketId: string; message: string; attachments?: string[] }) => {
  const res = await graphqlClient.post('', {
    query: `
      mutation AdminReplyToTicket($data: ReplyTicketInput!) {
        adminReplyToTicket(data: $data) {
          success message
          ticket { ${TICKET_FIELDS} }
        }
      }
    `,
    variables: { data },
  })
  if (res.data.errors) throw new Error(res.data.errors[0].message)
  return res.data.data.adminReplyToTicket
}

export const updateTicketStatus = async (id: string, status: string) => {
  const res = await graphqlClient.post('', {
    query: `
      mutation UpdateTicketStatus($id: ID!, $status: String!) {
        updateTicketStatus(id: $id, status: $status) {
          success message
          ticket { ${TICKET_FIELDS} }
        }
      }
    `,
    variables: { id, status },
  })
  if (res.data.errors) throw new Error(res.data.errors[0].message)
  return res.data.data.updateTicketStatus
}
