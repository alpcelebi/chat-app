import { useState } from "react"
import { auth } from "../firebase/Config"
import { signInWithEmailAndPassword } from "firebase/auth"
import { useNavigate,Link } from "react-router-dom"


export default function Login() {

  const [hata,setHata]=useState(false);
  const navigate=useNavigate();

  const handleSubmit =async (e)=>{
    e.preventDefault();

    const email=e.target[0].value;
    const parola=e.target[1].value;


    try{
      await signInWithEmailAndPassword(auth,email,parola);

      navigate ('/')
    }

    catch(error){
        setHata(true);
    }
  }


  return (
    <div className='formContainer'>
        <div className='formWrapper'>
            <span className='logo'>TYA Chat</span>
            <span className='title'>Giriş Sayfası </span>

            <form onSubmit={handleSubmit}>
                
                <input required type="email" placeholder="Email Adresiniz" />
                <input required type="password" placeholder="Parolanız" />
            
                <button >Giriş Yap</button>
                {hata && <span>Bir Hata Oluştu</span>}

            </form>
            <p>Üyeliğiniz bulunmuyorsa <Link to="/register"> Üye Olunuz</Link></p>
        </div>
    </div>
  )
}
