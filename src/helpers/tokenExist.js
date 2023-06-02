import Cookies from 'universal-cookie'
export const tokenExist = ()=>{
    const cookies = new Cookies();
    const token = cookies.get("token")
    if(token){
        
        window.location.href = "./dashboard"
    }
}

// TODO: TENGO QUE CREAR EL LOGOUT DE MODO QUE CUANDO SE ACCEDA A LA RUTA "/" (LOGIN) Y YA ESTE CON TOKEN, SE DEBE REDIRECCIONAR AL HOME