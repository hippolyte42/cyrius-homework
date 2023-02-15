import { User, UserInputs } from '../../types/types'

interface DeleteUserButtonProps {
    selectedUser: User
    setIsMenuOpen: React.Dispatch<React.SetStateAction<boolean>>
    setIsFormReadOnly: React.Dispatch<React.SetStateAction<boolean>>
    setInputs: React.Dispatch<React.SetStateAction<UserInputs | undefined>>
    users: User[]
    setUsers: React.Dispatch<React.SetStateAction<User[] | undefined>>
}

export const DeleteUserButton = ({
    selectedUser,
    setIsMenuOpen,
    setIsFormReadOnly,
    setInputs,
    users,
    setUsers,
}: DeleteUserButtonProps) => {
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
            .then(() => {
                setIsMenuOpen(false)
                setIsFormReadOnly(true)
                setInputs(undefined)
                if (users) {
                    const newUsers = users.filter(
                        (u: User) => u.id !== selectedUser?.id
                    )
                    setUsers(newUsers)
                }
            })
            .catch((err) => {
                console.error(err.message)
            })
    }

    return (
        <button
            id="deleteUserButton"
            className="bg-red-500 hover:bg-red-400 rounded text-white shadow font-bold py-2 px-4"
            onClick={() => {
                deleteUser()
            }}
        >
            Supprimer l'utilisateur
        </button>
    )
}
