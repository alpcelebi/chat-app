import { useContext } from 'react';
import { auth } from '../firebase/Config';
import { signOut } from 'firebase/auth';
import { AuthContext } from '../contexts/AuthContext';

export default function Navbar() {
  const { girisKullanici } = useContext(AuthContext);

  // girisKullanici tanımlıysa photoURL'yi kullan, değilse varsayılan bir değer kullan
  const userPhotoURL = girisKullanici?.photoURL || 'varsayilan-foto-url';

  return (
    <div className='navbar'>
      <span className='logo'>TYA-Chat</span>
      <div className='user'>
        <img src={userPhotoURL} alt="" />
        <span>{girisKullanici?.displayName}</span>
        <button onDoubleClick={() => signOut(auth)}>Çıkış Yap</button>
      </div>
    </div>
  );
}
