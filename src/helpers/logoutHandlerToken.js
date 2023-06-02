import Cookies from 'universal-cookie'

export const logoutHandler = ()=>{
    const cookies = new Cookies();

    cookies.remove("nombre")
    cookies.remove("token")
    cookies.remove("email")

    window.location.href = "./"

}