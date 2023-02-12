export type Organisation = {
    id: string
    name: string
}

export type User = {
    id: string
    firstName: string
    lastName: string
    email: string
    orgId: string
    labels: string[]
}

export type GetOrganisationsData = {
    id: string
    name: string
}

export type GetOrganisationUsersData = {
    id: string
    first_name: string
    last_name: string
    email: string
    org: string
    labels: string[]
}

export type UserInputs = {
    firstName?: string
    lastName?: string
    email?: string
    orgId?: string
    labels?: string[]
}
