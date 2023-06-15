import { useEffect, useState } from "react"
import { api } from "../services/api"
import { useGetUserID } from "../hooks/useGetUserID";
import { useCookies } from 'react-cookie'

export function Dashboard() {
    const [user, setUser] = useState('')
    const [userList, setUserList] = useState('')
    const [loading, setLoading] = useState(false)
    const userID = useGetUserID()
    const [cookie, setCookie, removeCookie] = useCookies(['access_token'])
    const token = cookie.access_token;

    useEffect(() => {
        async function fetchUserData() {
            setLoading(true)
            const response = await api.get(`/users/${userID}`)
            setUser(response.data)
            setLoading(false)
        }

        fetchUserData();

        async function fetchUserList() {
            try {
                setLoading(true)
                const response = await api.get('/users', {
                    headers: {
                        Authorization: `${token}`
                    }
                })
                setUserList(response.data)
                console.log('=====> user list ', userList)
                setLoading(false)
            } catch (err) {
                console.log('USER DEBUG MESSAGE ===>', err)
            }
        }

        fetchUserList();
    }, [])

    return (
        <>
            <div className="container m-0 m-auto pt-10">
                <h1 className="text-2xl">{loading ? 'Carregando..' : `Olá ${user?.name}`}</h1>
            </div>

            <div className="container m-0 m-auto pt-10">
                <h1>Lista de Usuários no Sistema</h1>
            </div>

            <div className="container m-0 m-auto pt-10">
                {loading ? (
                    <p>Carregando...</p>
                ) : (
                    Array.isArray(userList) ? (
                        userList.map((item) => (
                            <ul key={item._id}>
                                <li><a href={`/users/${item._id}`}>{item.name}</a></li>
                            </ul>
                        ))
                    ) : (
                        <p>Não foi possível carregar a lista de usuários.</p>
                    )
                )}
            </div>
        </>
    )
}