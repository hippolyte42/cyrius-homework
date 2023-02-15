import { useEffect, useState } from 'react'
import { GetOrganisationUsersData, User } from '../types/types'

export const useOrganisationUsers = (organisationId: string | undefined) => {
    const [users, setUsers] = useState<User[]>()

    useEffect(() => {
        if (organisationId) {
            fetch(
                `http://localhost:3000/orgs/${organisationId}/users?` +
                    new URLSearchParams({
                        page: '2', // organisationPage.toString()
                        per_page: '50',
                    })
            ) // GET /orgs/:orgId/users?page&per_page
                .then((response) => response.json())
                .then((resData) => {
                    if (users) {
                        setUsers([
                            ...users,
                            ...resData.data.map(
                                (u: GetOrganisationUsersData): User => {
                                    return {
                                        id: u.id,
                                        firstName: u.first_name,
                                        lastName: u.last_name,
                                        email: u.email,
                                        orgId: u.org,
                                        labels: u.labels,
                                    }
                                }
                            ),
                        ])
                    } else {
                        setUsers(
                            resData.data.map(
                                (u: GetOrganisationUsersData): User => {
                                    return {
                                        id: u.id,
                                        firstName: u.first_name,
                                        lastName: u.last_name,
                                        email: u.email,
                                        orgId: u.org,
                                        labels: u.labels,
                                    }
                                }
                            )
                        )
                    }
                })
                .catch((err) => {
                    console.error(err.message)
                })
        }
    }, [organisationId])

    return { users, setUsers }
}
