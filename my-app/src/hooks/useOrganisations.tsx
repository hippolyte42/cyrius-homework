import { useEffect, useState } from 'react'
import { GetOrganisationsData, Organisation } from '../types/types'

export const useOrganisations = () => {
    const [organisations, setOrganisations] = useState<Organisation[]>([])
    const [organisationLabels, setOrganisationLabels] = useState<string[]>()
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

    useEffect(() => {
        {
            organisations.length &&
                fetch(
                    `http://localhost:3000/orgs/${organisations[0].id}/labels`
                ) // GET /orgs/:oid/labels
                    .then((response) => response.json())
                    .then((resData) => {
                        console.log('GetOrganisationsLabelsRes', resData)
                        setOrganisationLabels(resData.data)
                    })
                    .catch((err) => {
                        console.error(err.message)
                    })
        }
    }, [organisations])

    return { organisations, organisationLabels }
}
