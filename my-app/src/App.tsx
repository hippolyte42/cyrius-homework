import { useEffect, useState } from 'react'
import { ReactComponent as EditIcon } from './assets/edit.svg'
import { DeleteUserButton } from './components/DeleteUserButton/DeleteUserButton'
import { UserForm } from './components/UserForm/UserForm'
import { UserTable } from './components/UserTable/UserTable'
import {
    GetOrganisationsData,
    GetOrganisationUsersData,
    Organisation,
    User,
    UserInputs,
} from './types/types'

function App() {
    const [organisations, setOrganisations] = useState<Organisation[]>([])
    const [users, setUsers] = useState<User[]>()
    const [organisationPage, setOrganisationPage] = useState<number>(0)

    const [selectedUser, setSelectedUser] = useState<User>()
    const [isMenuOpen, setIsMenuOpen] = useState<boolean>(false)
    const [isFormReadOnly, setIsFormReadOnly] = useState<boolean>(true)

    const [inputs, setInputs] = useState<UserInputs>()

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
                <div className={`${isMenuOpen ? 'max-w-1/3 w-1/3' : 'w-full'}`}>
                    {users && (
                        <UserTable
                            isMenuOpen={isMenuOpen}
                            setIsMenuOpen={setIsMenuOpen}
                            users={users}
                            setSelectedUser={setSelectedUser}
                            setIsFormReadOnly={setIsFormReadOnly}
                            setInputs={setInputs}
                            organisations={organisations}
                        />
                    )}
                </div>
                {selectedUser && users && (
                    <div
                        className={`transform h-screen bg-slate-300 overflow-auto ${
                            isMenuOpen
                                ? 'translate-x-0 w-2/3 fixed top-0 right-0 ease-in-out'
                                : 'translate-x-full w-0'
                        } transition duration-500 m-0`}
                    >
                        <button
                            onClick={() => setIsMenuOpen(false)}
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
                            <EditIcon />
                        </div>

                        <UserForm
                            inputs={inputs}
                            isFormReadOnly={isFormReadOnly}
                            setInputs={setInputs}
                            selectedUser={selectedUser}
                            users={users}
                            setUsers={setUsers}
                            setSelectedUser={setSelectedUser}
                        />

                        <div className="md:flex md:items-center mb-6 w-full max-w-4xl">
                            <div className="md:w-1/3"></div>
                            <div className="md:w-2/3">
                                <DeleteUserButton
                                    selectedUser={selectedUser}
                                    setInputs={setInputs}
                                    users={users}
                                    setUsers={setUsers}
                                    setIsFormReadOnly={setIsFormReadOnly}
                                    setIsMenuOpen={setIsMenuOpen}
                                />
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </div>
    )
}

export default App
