import Cookies from 'universal-cookie'
export const tokenValidatior = ()=>{
    const cookies = new Cookies();
    const token = cookies.get("token")
    if(!token){
        alert('No tienes acceso al dashboard de administracion, inicia sesión')
        window.location.href = "./"
    }
}