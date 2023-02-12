import { useEffect, useState } from 'react'
import { GetOrganisationsData, Organisation } from '../types/types'

export const useOrganisations = () => {
    const [organisations, setOrganisations] = useState<Organisation[]>([])
    const [organisationPage, setOrganisationPage] = useState<number>(0)

    useEffect(() => {
        fetch(
            `http://localhost:3000/orgs?` +
                new URLSearchParams({
                    page: organisationPage.toString(),
                    per_page: '50',
                })
        ) // GET /orgs/:orgId/users?page&per_page
            .then((response) => response.json())
            .then((resData) => {
                console.log('GetOrganisationsRes', resData)
                if (organisations) {
                    setOrganisations([
                        ...organisations,
                        ...resData.data.map((org: GetOrganisationsData) => {
                            return {
                                id: org.id,
                                name: org.name,
                            }
                        }),
                    ])
                } else {
                    setOrganisations(
                        resData.data.map((org: GetOrganisationsData) => {
                            return {
                                id: org.id,
                                name: org.name,
                            }
                        })
                    )
                }
            })
            .catch((err) => {
                console.error(err.message)
            })
    }, [])

    return { organisations }
}
