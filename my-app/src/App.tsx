import { useState } from 'react'
import { DeleteUserButton } from './components/DeleteUserButton/DeleteUserButton'
import { UserForm } from './components/UserForm/UserForm'
import { UserTable } from './components/UserTable/UserTable'
import { useOrganisations } from './hooks/useOrganisations'
import { useOrganisationUsers } from './hooks/useOrganisationUsers'
import { User, UserInputs } from './types/types'

function App() {
    const { organisations } = useOrganisations()
    const { users, setUsers } = useOrganisationUsers(
        organisations.length ? organisations[0].id : undefined
    )
    const [selectedUser, setSelectedUser] = useState<User>()
    const [isMenuOpen, setIsMenuOpen] = useState<boolean>(false)
    const [isFormReadOnly, setIsFormReadOnly] = useState<boolean>(true)
    const [inputs, setInputs] = useState<UserInputs>()

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
                        className={`transform h-screen bg-gray-300 overflow-auto ${
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
                                    ? 'bg-gray-200 hover:bg-gray-500 hover:outline-gray-100 hover:outline'
                                    : 'bg-gray-400 outline-gray-200 outline'
                            } rounded-xl w-[48px] h-[48px] cursor-pointer m-8 shadow`}
                        >
                            <img src={'./edit.svg'} />
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
