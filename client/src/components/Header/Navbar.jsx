import { Link } from "react-router-dom"
import { useNavigate } from "react-router-dom"
import { useCookies } from "react-cookie"

export function Navbar() {
    const [cookies, , removeCookie] = useCookies(['access_token']);
    const navigate = useNavigate()

    async function handleLogout() {
        try {
            await new Promise((resolve) => {
                removeCookie('access_token');
                resolve();
            });

            navigate('/');
        } catch (error) {
            console.log('Erro ao realizar logout:', error);
        }
    }

    return (
        <>
            <header className="container m-0 m-auto p-8 bg-slate-600">
                <nav className="flex justify-end justify-between">
                    <Link className="p-2" to={'/dashboard'}>DashBoard</Link>
                    {!cookies.access_token ? '' : <button onClick={handleLogout} className="p-2 bg-gray-800 rounded-sm" to={'/'}>Logout</button>}
                </nav>
            </header>
        </>
    )
}