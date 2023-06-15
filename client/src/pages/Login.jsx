import { useState } from "react"
import { api } from "../services/api"
import { useCookies } from 'react-cookie'
import { useNavigate } from "react-router-dom"

export function Login() {
    const [username, setUsername] = useState('')
    const [password, setPassword] = useState('')
    const [errorMessage, setErrorMessage] = useState(false)
    const [_, setCookies] = useCookies(["access_token"])

    const navigate = useNavigate()

    const handleSubmit = async (e) => {
        e.preventDefault()
        try {
            const response = await api.post('/login', {
                username,
                password
            })
            if (response.status === 200) {
                setCookies("access_token", response.data.token)
                window.localStorage.setItem('userID', response.data.userID)
                navigate('/dashboard')
            }
        } catch (err) {
            if (err.response && err.response.status === 401 || err.response && err.response.status === 404) {
                console.log('Erro de login: usuário ou senha inválidos')
                setErrorMessage(true)
                setTimeout(() => setErrorMessage(false), 3000)
            }
        }
    }

    return (
        <>
            <div className="container flex justify-center h-alt items-center m-0 m-auto h-screen">
                <div className="formlogin w-[400px]">
                    <form onSubmit={handleSubmit}>
                        <h1 className="text-center text-[35px] m-[10px]">Login</h1>
                        <div className="flex flex-col">
                            <input
                                required
                                type="text"
                                placeholder="Nome de usuário"
                                name="username"
                                autoComplete="off"
                                value={username}
                                onChange={(e) => setUsername(e.target.value)}
                                className="py-[0.30rem] mt-[1.10rem]"
                            />
                            <input
                                type="password"
                                placeholder="Senha"
                                name="username"
                                autoComplete="off"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                className="py-[0.30rem] mt-[1.10rem]"
                            />
                            <button className="rounded bg-white text-black mt-[30px] p-[8px]">
                                Entrar
                            </button>
                            {errorMessage && <span className="text-center bg-[red] mt-4 text-sm">Usuário ou senha inválidos</span>}
                        </div>
                    </form>
                </div>
            </div>
        </>
    )
}