import { Organisation, User, UserInputs } from '../../types/types'

interface UserTableProps {
    isMenuOpen: boolean
    setIsMenuOpen: React.Dispatch<React.SetStateAction<boolean>>
    users: User[]
    setSelectedUser: React.Dispatch<React.SetStateAction<User | undefined>>
    setInputs: React.Dispatch<React.SetStateAction<UserInputs | undefined>>
    setIsFormReadOnly: React.Dispatch<React.SetStateAction<boolean>>
    organisations: Organisation[]
}

export const UserTable = ({
    isMenuOpen,
    setIsMenuOpen,
    users,
    setSelectedUser,
    setInputs,
    setIsFormReadOnly,
    organisations,
}: UserTableProps) => {
    return (
        <table className={`table-auto my-8 mx-auto text-md`}>
            <thead>
                <tr>
                    <th className="px-4 py-2">First Name</th>
                    <th className="px-4 py-2">Last Name</th>
                    <th className="px-4 py-2">Email</th>
                    {!isMenuOpen && <th className="px-4 py-2">Org</th>}
                    {!isMenuOpen && <th className="px-4 py-2">Labels</th>}
                </tr>
            </thead>
            <tbody>
                {users &&
                    users.map((user: User) => (
                        <tr
                            key={user.id}
                            className=""
                            onClick={() => {
                                isMenuOpen && setSelectedUser(user)
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

                            <td className="border px-4 py-2">{user.email}</td>

                            {!isMenuOpen && (
                                <td className="border px-4 py-2">
                                    {organisations[0].name}
                                </td>
                            )}
                            {!isMenuOpen && (
                                <td className="border px-4 py-2">
                                    {user.labels.join(', ')}
                                </td>
                            )}
                            {!isMenuOpen && (
                                <td
                                    className="border px-4 py-2 cursor-pointer"
                                    onClick={() => {
                                        setIsMenuOpen(true)
                                        setSelectedUser(user)
                                        setInputs(undefined)
                                        setIsFormReadOnly(true)
                                    }}
                                >
                                    <button>
                                        <img
                                            src={'./open_in_new.svg'}
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
    )
}
