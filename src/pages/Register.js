import { useState } from 'react';
import Add from '../img/addavatar.png';
import { createUserWithEmailAndPassword, updateProfile } from 'firebase/auth';
import { ref, uploadBytesResumable, getDownloadURL } from 'firebase/storage';
import { doc, setDoc } from 'firebase/firestore';
import { useNavigate, Link } from 'react-router-dom';
import { auth, storage, db } from '../firebase/Config'; // Yeni eklenen satır

export default function Register() {
  const [hata, setHata] = useState(false);
  const [yükleniyor, setYükleniyor] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setYükleniyor(true);
    setHata(false);

    const kullaniciAd = e.target[0].value;
    const email = e.target[1].value;
    const parola = e.target[2].value;
    const avatar = e.target[3].files[0];

    try {
      const res = await createUserWithEmailAndPassword(auth, email, parola);
      const date = new Date().getTime();
      const storageRef = ref(storage, `${kullaniciAd + date}`);

      await uploadBytesResumable(storageRef, avatar).then(() => {
        getDownloadURL(storageRef).then(async (downloadUrl) => {
          try {
            await updateProfile(res.user, {
              displayName: kullaniciAd,
              photoURL: downloadUrl,
            });

            await setDoc(doc(db, "kullanicilar", res.user.uid), {
              uid: res.user.uid,
              kullaniciAd,
              email,
              fotoURL:downloadUrl
            });

            await setDoc(doc(db, "kullaniciChatler", res.user.uid), {});

            navigate('/');
          } catch (error) {
            setHata(error.message);
            setYükleniyor(false);
          }
        });
      });

      setYükleniyor(false);
    } catch (error) {
      setHata(error.message);
      setYükleniyor(false);
    }
  };

  return (
    <div className='formContainer'>
      <div className='formWrapper'>
        <span className='logo'>TYA Chat</span>
        <span className='title'>Üye Ol Sayfası</span>

        <form onSubmit={handleSubmit}>
          <input required type="text" placeholder="Kullanıcı Adınız" />
          <input required type="email" placeholder="Email Adresiniz" />
          <input required type="password" placeholder="Parolanız" />
          <input required style={{ display: "none" }} type="file" id="file" />
          <label htmlFor='file'>
            <img src={Add} alt="" />
            <span>Avatar Ekle</span>
          </label>
          <button disabled={yükleniyor} >Üye Ol</button>
          {yükleniyor && <span>Üyelik Oluşturulurken Bekleyiniz...</span>}
          {hata && <p>{hata}</p>}
        </form>
        {!yükleniyor && <p>Üyeliğiniz bulunuyorsa <Link to="/login"> Giriş Yapınız</Link></p>}
      </div>
    </div>
  );
}
