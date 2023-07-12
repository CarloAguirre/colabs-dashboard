import Cookies from 'universal-cookie'
export const tokenExist = ()=>{
    const cookies = new Cookies();
    const token = cookies.get("token")
    if(token){
        
        window.location.href = "./dashboard"
    }
}

