import { useEffect, useState } from "react"
import { api } from "../services/api"
import { useParams } from "react-router-dom"
import { formatDate } from "../hooks/formatDate"

export function UserDetails() {
    const [UserDetail, setUserDetail] = useState('')
    const [loading, setLoading] = useState(false)
    const id = useParams()
    console.log(id._id)

    useEffect(() => {
        async function fetchUserDetails() {
            setLoading(true)
            const response = await api.get(`/users/${id._id}`)
            setUserDetail(response.data)
            setLoading(false)
        }
        fetchUserDetails();
    }, [])

    return (
        <>
            <div className="container m-0 m-auto mt-10">
                <h1>Informações do Usuário</h1>
            </div>

            <div className="container m-0 m-auto mt-5">
                <ul>
                    {loading ? (
                        <h1>Carregando..</h1>
                    ) : (
                        <>
                            <li>Nome de usuário: {UserDetail.username}</li>
                            <li>Nome: {UserDetail.name}</li>
                            <li>Cidade: {UserDetail.city}</li>
                            <li>Idade: {UserDetail.age}</li>
                            <li>Data de Cadastro: {formatDate(new Date(UserDetail.createdAt))}</li>
                        </>
                    )}
                </ul>
            </div>
        </>
    )
}