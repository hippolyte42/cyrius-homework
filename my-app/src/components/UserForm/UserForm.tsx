import { User, UserInputs } from '../../types/types'
import LabelsComboBox from '../LabelsComboBox/LabelsComboBox'

interface UserFormProps {
    selectedUser: User
    inputs: UserInputs | undefined
    setSelectedUser: React.Dispatch<React.SetStateAction<User | undefined>>
    setUsers: React.Dispatch<React.SetStateAction<User[] | undefined>>
    users: User[]
    setInputs: React.Dispatch<React.SetStateAction<UserInputs | undefined>>
    isFormReadOnly: boolean
    organisationLabels: string[] | undefined
}

export const UserForm = ({
    selectedUser,
    inputs,
    setSelectedUser,
    setUsers,
    users,
    setInputs,
    isFormReadOnly,
    organisationLabels,
}: UserFormProps) => {
    const handleSubmit: React.FormEventHandler<HTMLFormElement> = (
        event: React.FormEvent<HTMLFormElement>
    ) => {
        event.preventDefault()
        if (selectedUser) {
            fetch(
                `http://localhost:3000/orgs/${selectedUser.orgId}/users/${selectedUser.id}`, //  /orgs/:oid/users/:uid?mask=first_name,email
                {
                    method: 'PATCH',
                    body: JSON.stringify({
                        first_name: inputs?.firstName ?? selectedUser.firstName,
                        last_name: inputs?.lastName ?? selectedUser.lastName,
                        email: inputs?.email ?? selectedUser.email,
                        org: inputs?.orgId ?? selectedUser.orgId,
                        labels: inputs?.labels ?? selectedUser.labels,
                    }),
                    headers: {
                        'Content-type': 'application/json; charset=UTF-8',
                    },
                }
            )
                .then((response) => response.json())
                .then((res) => {
                    const updatedUserFields: Partial<User> = {
                        firstName: res.first_name,
                        lastName: res.last_name,
                        email: res.email,
                        orgId: res.org,
                        labels: res.labels,
                    }

                    setSelectedUser({ ...selectedUser, ...updatedUserFields })

                    const newUsers = users?.map((u: User) => {
                        if (u.id === selectedUser.id) {
                            return {
                                ...u,
                                ...updatedUserFields,
                            }
                        }
                        return u
                    })
                    setUsers(newUsers)
                })
                .catch((err) => {
                    console.error(err.message)
                })
        }
    }

    const handleChange: React.ChangeEventHandler<HTMLInputElement> = (
        event: React.ChangeEvent<HTMLInputElement>
    ) => {
        const name = event.target.name
        const value = event.target.value
        setInputs((values: React.SetStateAction<UserInputs | undefined>) => ({
            ...values,
            [name]: value,
        }))
    }

    // todo make input bg-white on isFormReadOnly false
    return (
        <form className="max-w-4xl" onSubmit={handleSubmit}>
            <div className="md:flex md:items-center mb-6">
                <div className="md:w-1/3">
                    <label className="block text-gray-500 font-bold md:text-right mb-1 md:mb-0 pr-4">
                        Id
                    </label>
                </div>
                <div className="md:w-2/3">
                    <input
                        className="bg-gray-200 appearance-none border-2 border-gray-200 rounded w-full py-2 px-4 text-gray-700 leading-tight focus:outline-none focus:border-blue-500"
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
                        id="firstname"
                        className={`${
                            isFormReadOnly ? '' : 'focus:bg-white'
                        } bg-gray-200 appearance-none border-2 border-gray-200 rounded w-full py-2 px-4 text-gray-700 leading-tight focus:outline-none  focus:border-blue-500`}
                        type="text"
                        placeholder={selectedUser?.firstName}
                        readOnly={isFormReadOnly}
                        name="firstName"
                        onChange={handleChange}
                        value={inputs?.firstName || ''}
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
                        id="lastname"
                        className={`${
                            isFormReadOnly ? '' : 'focus:bg-white'
                        } bg-gray-200 appearance-none border-2 border-gray-200 rounded w-full py-2 px-4 text-gray-700 leading-tight focus:outline-none  focus:border-blue-500`}
                        type="text"
                        placeholder={selectedUser?.lastName}
                        readOnly={isFormReadOnly}
                        name="lastName"
                        onChange={handleChange}
                        value={inputs?.lastName || ''}
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
                        id="email"
                        className={`${
                            isFormReadOnly ? '' : 'focus:bg-white'
                        } bg-gray-200 appearance-none border-2 border-gray-200 rounded w-full py-2 px-4 text-gray-700 leading-tight focus:outline-none  focus:border-blue-500`}
                        type="text"
                        placeholder={selectedUser?.email}
                        readOnly={isFormReadOnly}
                        name="email"
                        onChange={handleChange}
                        value={inputs?.email || ''}
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
                        id="orgid"
                        className={`${
                            isFormReadOnly ? '' : 'focus:bg-white'
                        } bg-gray-200 appearance-none border-2 border-gray-200 rounded w-full py-2 px-4 text-gray-700 leading-tight focus:outline-none  focus:border-blue-500`}
                        type="text"
                        placeholder={selectedUser?.orgId}
                        readOnly={isFormReadOnly}
                        name="orgId"
                        onChange={handleChange}
                        value={inputs?.orgId || ''}
                    />
                </div>
            </div>

            <LabelsComboBox
                isFormReadOnly={isFormReadOnly}
                selectedUserLabelsInput={inputs?.labels || selectedUser.labels}
                setInputs={setInputs}
                organisationLabels={organisationLabels}
            />

            <div className="md:flex md:items-center mb-6">
                <div className="md:w-1/3"></div>
                <div className="md:w-2/3">
                    <input
                        id="submit"
                        className="shadow bg-blue-500 hover:bg-blue-400 focus:shadow-outline focus:outline-none text-white font-bold py-2 px-4 rounded"
                        value="Modifier"
                        type="submit"
                    />
                </div>
            </div>
        </form>
    )
}
