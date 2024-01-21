// Search.js

import React, { useState, useContext } from 'react';
import { collection, query, where, getDocs, getDoc, setDoc, doc, updateDoc, serverTimestamp } from 'firebase/firestore';
import { db } from '../firebase/Config';
import { AuthContext } from '../contexts/AuthContext';
import { ChatContext } from '../contexts/ChatContext';

const Search = () => {
  const { girisKullanici } = useContext(AuthContext);
  const [arananKullanici, setArananKullanici] = useState('');
  const [kullanici, setKullanici] = useState(null);
  const [hata, setHata] = useState(false);

  const {dispatch}=useContext(ChatContext);

  const handleAra = async () => {
    const sorgu = query(
      collection(db, 'kullanicilar'),
      where('kullaniciAd', '==', arananKullanici)
    );

    try {
      const querySnapshot = await getDocs(sorgu);
      querySnapshot.forEach((doc) => {
        setKullanici(doc.data());
      });
      setHata(false); // Kullanıcı bulunduğunda hata durumunu sıfırla
    } catch (err) {
      setHata(true);
      setKullanici(null);
    }
  };

  const handleSec = async () => {
    
    if (!girisKullanici || !girisKullanici.uid || !kullanici || !kullanici.uid) {
      console.error('Geçersiz kullanıcı nesnesi.');
      return;
    }

    const birlestirilmisId =
      girisKullanici.uid > kullanici.uid ? girisKullanici.uid + kullanici.uid : kullanici.uid + girisKullanici.uid;

    try {
      dispatch({type:"CHANGE_USER",payload:kullanici})
      const sonuc = await getDoc(doc(db, 'chatler', birlestirilmisId));

      if (!sonuc.exists()) {
        await setDoc(doc(db, 'chatler', birlestirilmisId), { mesajlar: [] });

        await updateDoc(doc(db, 'kullaniciChatler', girisKullanici.uid), {
          [`${birlestirilmisId}.kullaniciBilgi`]: {
            uid: kullanici.uid,
            kullaniciAd: kullanici.kullaniciAd,
            fotoURL: kullanici.fotoURL,
          },
          [`${birlestirilmisId}.tarih`]: serverTimestamp(),
        });

        await updateDoc(doc(db, 'kullaniciChatler', kullanici.uid), {
          [`${birlestirilmisId}.kullaniciBilgi`]: {
            uid: girisKullanici.uid,
            kullaniciAd: girisKullanici.displayName,
            fotoURL: girisKullanici.photoURL,
          },
          [`${birlestirilmisId}.tarih`]: serverTimestamp(),
        });
      }

        dispatch({type:"CHANGE_USER",payload:kullanici})

    }
    
    catch (error) {
      console.error('Hata oluştu:', error);
    }

    setKullanici(null);
    setArananKullanici('');
  };

  const handleKey = (e) => {
    e.code === 'Enter' && handleAra();
  };

  return (
    <div>
      <div className="searchForm">
        <input
          type="text"
          placeholder="Kullanıcı Ara"
          onKeyDown={handleKey}
          onChange={(e) => setArananKullanici(e.target.value)}
          value={arananKullanici}
        />
      </div>
      {hata && <span>Kullanıcı Bulunamadı</span>}
      {kullanici && (
        <div className="userChat" onClick={handleSec}>
          <img src={kullanici.fotoURL} alt="" />
          <div className="userChatInfo">
            <span>{kullanici.kullaniciAd}</span>
          </div>
        </div>
      )}
    </div>
  );
};

export default Search;
