import { useEffect, useState } from 'react'
import { ReactComponent as EditIcon } from './assets/edit.svg'

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
    labels: string
}

export type UserInputs = {
    firstName?: string
    lastName?: string
    email?: string
    orgId?: string
    labels?: string
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
    labels: string
}

function App() {
    const [organisations, setOrganisations] = useState<Organisation[]>([])
    const [users, setUsers] = useState<User[]>()
    const [organisationPage, setOrganisationPage] = useState<number>(0)

    const [selectedUser, setSelectedUser] = useState<User>()
    const [isPanelOpen, setIsPanelOpen] = useState<boolean>(false)
    const [isFormReadOnly, setIsFormReadOnly] = useState<boolean>(true)

    const [inputs, setInputs] = useState<UserInputs>()

    const handleChange: React.ChangeEventHandler<HTMLInputElement> = (
        event: React.ChangeEvent<HTMLInputElement>
    ) => {
        const name = event.target.name
        const value = event.target.value
        setInputs((values) => ({ ...values, [name]: value }))
    }

    const deleteUser = () => {
        fetch(
            `http://localhost:3000/orgs/${selectedUser?.orgId}/users/${selectedUser?.id}`,
            {
                method: 'DELETE',
                headers: {
                    'Content-type': 'application/json; charset=UTF-8',
                },
            }
        ) //  /orgs/:oid/users/:uid
            .then((response) => response.json())
            .then((data) => {
                console.log(data)
                setIsPanelOpen(false)
                setIsFormReadOnly(true)
                setInputs(undefined)
                if (users) {
                    const newUsers = users.filter(
                        (u) => u.id !== selectedUser?.id
                    )
                    setUsers(newUsers)
                }
            })
            .catch((err) => {
                console.log(err.message)
            })
    }

    const handleSubmit: React.FormEventHandler<HTMLFormElement> = (
        event: React.FormEvent<HTMLFormElement>
    ) => {
        event.preventDefault()
        console.log('handleSubmit', inputs)
        if (selectedUser) {
            fetch(
                `http://localhost:3000/orgs/${selectedUser.orgId}/users/${selectedUser.id}`, //  /orgs/:oid/users/:uid?mask=first_name,email
                {
                    method: 'PATCH',
                    body: JSON.stringify(`{
                        "first_name": "${
                            inputs?.firstName || selectedUser.firstName
                        }",
                        "last_name": "${
                            inputs?.lastName || selectedUser.lastName
                        }",
                        "email": "${inputs?.email || selectedUser.email}",
                        "org": "${inputs?.orgId || selectedUser.orgId}"
                        "labels": "${inputs?.labels || selectedUser.labels}"
                    }`),
                    headers: {
                        'Content-type': 'application/json; charset=UTF-8',
                    },
                }
            )
                .then((response) => response.json())
                .then((res) => {
                    console.log('patchOrganisationUser', res)
                    setSelectedUser({ ...selectedUser, ...inputs })
                    if (users) {
                        const newUsers = users.map((u) => {
                            if (u.id === selectedUser.id) {
                                return {
                                    ...u,
                                    ...inputs,
                                }
                            }
                            return u
                        })
                        setUsers(newUsers)
                    }
                })
                .catch((err) => {
                    console.error(err.message)
                })
        }
    }

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
        fetch(
            `http://localhost:3000/orgs/${'testOrg'}/users?` +
                new URLSearchParams({
                    page: organisationPage.toString(),
                    per_page: '50',
                })
        ) // GET /orgs/:orgId/users?page&per_page
            .then((response) => response.json())
            .then((resData) => {
                console.log('GetOrganisationUsersRes', resData)
                if (users) {
                    setUsers([
                        ...users,
                        ...resData.data.map((u: GetOrganisationUsersData) => {
                            return {
                                id: u.id,
                                firstName: u.first_name,
                                lastName: u.last_name,
                                email: u.email,
                                org: u.org,
                                labels: u.labels,
                            }
                        }),
                    ])
                } else {
                    setUsers(
                        resData.data.map((u: GetOrganisationUsersData) => {
                            return {
                                id: u.id,
                                firstName: u.first_name,
                                lastName: u.last_name,
                                email: u.email,
                                org: u.org,
                                labels: u.labels,
                            }
                        })
                    )
                }
            })
            .catch((err) => {
                console.error(err.message)
            })
    }, [organisations])

    return (
        <div className="App">
            <div className="flex flex-start max-w-screen-full">
                <div
                    className={`${isPanelOpen ? 'max-w-1/3 w-1/3' : 'w-full'}`}
                >
                    <table className={`table-auto my-8 mx-auto text-md`}>
                        <thead>
                            <tr>
                                <th className="px-4 py-2">First Name</th>
                                <th className="px-4 py-2">Last Name</th>
                                <th className="px-4 py-2">Email</th>
                                {!isPanelOpen && (
                                    <th className="px-4 py-2">Org</th>
                                )}
                                {!isPanelOpen && (
                                    <th className="px-4 py-2">Label</th>
                                )}
                            </tr>
                        </thead>
                        <tbody>
                            {users &&
                                users.map((user) => (
                                    <tr
                                        key={user.id}
                                        className=""
                                        onClick={() => {
                                            isPanelOpen && setSelectedUser(user)
                                            setInputs(undefined)
                                            setIsFormReadOnly(true)
                                        }}
                                    >
                                        <td className="border px-4 py-2">
                                            {user.firstName}
                                        </td>
                                        <td className="border px-4 py-2">
                                            {user.lastName}
                                        </td>

                                        <td className="border px-4 py-2">
                                            {user.email}
                                        </td>

                                        {!isPanelOpen && (
                                            <td className="border px-4 py-2">
                                                {organisations.find(
                                                    (o) => o.id === user.orgId
                                                )?.name ||
                                                    (organisations.length &&
                                                        organisations[0].name)}
                                            </td>
                                        )}
                                        {!isPanelOpen && (
                                            <td className="border px-4 py-2">
                                                {user.labels}
                                            </td>
                                        )}
                                        {!isPanelOpen && (
                                            <td
                                                className="border px-4 py-2 cursor-pointer"
                                                onClick={() => {
                                                    setIsPanelOpen(true)
                                                    setSelectedUser(user)
                                                    setInputs(undefined)
                                                    setIsFormReadOnly(true)
                                                }}
                                            >
                                                <button>
                                                    <img
                                                        src={
                                                            './open_in_new.svg'
                                                        }
                                                        alt="Your SVG"
                                                        className="w-6"
                                                    />
                                                </button>
                                            </td>
                                        )}
                                    </tr>
                                ))}
                        </tbody>
                    </table>
                </div>
                <div
                    className={`transform h-screen bg-slate-300 overflow-auto ${
                        isPanelOpen
                            ? 'translate-x-0 w-2/3 fixed top-0 right-0 ease-in-out'
                            : 'translate-x-full w-0'
                    } transition duration-500  m-0`}
                >
                    <button
                        onClick={() => setIsPanelOpen(false)}
                        className="m-4"
                    >
                        <svg
                            className="h-6 w-6"
                            xmlns="http://www.w3.org/2000/svg"
                            fill="none"
                            viewBox="0 0 24 24"
                            stroke="currentColor"
                            aria-hidden="true"
                        >
                            <path
                                stroke-linecap="round"
                                stroke-linejoin="round"
                                stroke-width="2"
                                d="M6 18L18 6M6 6l12 12"
                            />
                        </svg>
                    </button>

                    <div
                        onClick={() => setIsFormReadOnly(!isFormReadOnly)}
                        className={`${
                            isFormReadOnly
                                ? 'bg-slate-200 hover:bg-slate-400'
                                : 'bg-slate-500'
                        } rounded-xl w-[48px] h-[48px] cursor-pointer m-8 shadow`}
                    >
                        <EditIcon className="mx-auto" />
                    </div>

                    <form className="max-w-4xl" onSubmit={handleSubmit}>
                        <div className="md:flex md:items-center mb-6">
                            <div className="md:w-1/3">
                                <label className="block text-gray-500 font-bold md:text-right mb-1 md:mb-0 pr-4">
                                    Id
                                </label>
                            </div>
                            <div className="md:w-2/3">
                                <input
                                    className="bg-gray-200 appearance-none border-2 border-gray-200 rounded w-full py-2 px-4 text-gray-700 leading-tight focus:outline-none focus:border-purple-500"
                                    type="text"
                                    placeholder={selectedUser?.id}
                                    readOnly={true}
                                />
                            </div>
                        </div>
                        <div className="md:flex md:items-center mb-6">
                            <div className="md:w-1/3">
                                <label className="block text-gray-500 font-bold md:text-right mb-1 md:mb-0 pr-4">
                                    Firstname
                                </label>
                            </div>
                            <div className="md:w-2/3">
                                <input
                                    className={`${
                                        isFormReadOnly ? '' : 'focus:bg-white'
                                    } bg-gray-200 appearance-none border-2 border-gray-200 rounded w-full py-2 px-4 text-gray-700 leading-tight focus:outline-none  focus:border-purple-500`}
                                    type="text"
                                    placeholder={selectedUser?.firstName}
                                    readOnly={isFormReadOnly}
                                    name="firstName"
                                    onChange={handleChange}
                                />
                            </div>
                        </div>
                        <div className="md:flex md:items-center mb-6">
                            <div className="md:w-1/3">
                                <label className="block text-gray-500 font-bold md:text-right mb-1 md:mb-0 pr-4">
                                    Lastname
                                </label>
                            </div>
                            <div className="md:w-2/3">
                                <input
                                    className={`${
                                        isFormReadOnly ? '' : 'focus:bg-white'
                                    } bg-gray-200 appearance-none border-2 border-gray-200 rounded w-full py-2 px-4 text-gray-700 leading-tight focus:outline-none  focus:border-purple-500`}
                                    type="text"
                                    placeholder={selectedUser?.lastName}
                                    readOnly={isFormReadOnly}
                                    name="lastName"
                                    onChange={handleChange}
                                />
                            </div>
                        </div>
                        <div className="md:flex md:items-center mb-6">
                            <div className="md:w-1/3">
                                <label className="block text-gray-500 font-bold md:text-right mb-1 md:mb-0 pr-4">
                                    Email
                                </label>
                            </div>
                            <div className="md:w-2/3">
                                <input
                                    className={`${
                                        isFormReadOnly ? '' : 'focus:bg-white'
                                    } bg-gray-200 appearance-none border-2 border-gray-200 rounded w-full py-2 px-4 text-gray-700 leading-tight focus:outline-none  focus:border-purple-500`}
                                    type="text"
                                    placeholder={selectedUser?.email}
                                    readOnly={isFormReadOnly}
                                    name="email"
                                    onChange={handleChange}
                                />
                            </div>
                        </div>
                        <div className="md:flex md:items-center mb-6">
                            <div className="md:w-1/3">
                                <label className="block text-gray-500 font-bold md:text-right mb-1 md:mb-0 pr-4">
                                    Organisation
                                </label>
                            </div>
                            <div className="md:w-2/3">
                                <input
                                    className={`${
                                        isFormReadOnly ? '' : 'focus:bg-white'
                                    } bg-gray-200 appearance-none border-2 border-gray-200 rounded w-full py-2 px-4 text-gray-700 leading-tight focus:outline-none  focus:border-purple-500`}
                                    type="text"
                                    placeholder={selectedUser?.orgId}
                                    readOnly={isFormReadOnly}
                                    name="orgId"
                                    onChange={handleChange}
                                />
                            </div>
                        </div>
                        <div className="md:flex md:items-center mb-6">
                            <div className="md:w-1/3">
                                <label className="block text-gray-500 font-bold md:text-right mb-1 md:mb-0 pr-4">
                                    Labels
                                </label>
                            </div>
                            <div className="md:w-2/3">
                                <input
                                    className={`${
                                        isFormReadOnly ? '' : 'focus:bg-white'
                                    } bg-gray-200 appearance-none border-2 border-gray-200 rounded w-full py-2 px-4 text-gray-700 leading-tight focus:outline-none  focus:border-purple-500`}
                                    type="text"
                                    placeholder={selectedUser?.labels}
                                    readOnly={isFormReadOnly}
                                    name="labels"
                                    onChange={handleChange}
                                />
                            </div>
                        </div>

                        <div className="md:flex md:items-center mb-6">
                            <div className="md:w-1/3"></div>
                            <div className="md:w-2/3">
                                <input
                                    className="shadow bg-blue-500 hover:bg-blue-400 focus:shadow-outline focus:outline-none text-white font-bold py-2 px-4 rounded"
                                    value="Modifier"
                                    type="submit"
                                />
                            </div>
                        </div>
                    </form>
                    <div className="md:flex md:items-center mb-6 w-full max-w-4xl">
                        <div className="md:w-1/3"></div>
                        <div className="md:w-2/3">
                            <button
                                className="bg-red-500 hover:bg-red-400 rounded text-white shadow font-bold py-2 px-4"
                                onClick={() => {
                                    deleteUser()
                                }}
                            >
                                Supprimer l'utilisateur
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default App
