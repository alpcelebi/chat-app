import { useState, useContext } from 'react';
import Attachment from '../img/Attachment.png';
import { AuthContext } from '../contexts/AuthContext';
import { ChatContext } from '../contexts/ChatContext';
import { db, storage } from '../firebase/Config';
import { doc, updateDoc, arrayUnion, Timestamp, serverTimestamp } from 'firebase/firestore';
import { v4 as uuid } from 'uuid';
import { ref, uploadBytesResumable, getDownloadURL } from 'firebase/storage';

export default function Input() {
  const [text, setText] = useState('');
  const [img, setImg] = useState(null);
  const { girisKullanici } = useContext(AuthContext);
  const { data } = useContext(ChatContext);

  const handleGonder = async () => {
    try {
      if (img) {
        const storageRef = ref(storage, uuid());

        await uploadBytesResumable(storageRef, img).then(() => {
          getDownloadURL(storageRef).then(async (downloadURL) => {
            await updateDoc(doc(db, 'chatler', data.chatId), {
              mesajlar: arrayUnion({
                id: uuid(),
                text,
                gonderenId: girisKullanici.uid,
                date: Timestamp.now(),
                resim: downloadURL,
              }),
            });
          });
        });
      } else {
        // Resim yoksa sadece metni gönder
        await updateDoc(doc(db, 'chatler', data.chatId), {
          mesajlar: arrayUnion({
            id: uuid(),
            text,
            gonderenId: girisKullanici.uid,
            tarih: Timestamp.now(),
          }),
        });
      }

      await updateDoc(doc(db, 'kullaniciChatler', girisKullanici.uid), {
        [data.chatId + '.sonMesaj']: {
          text,
        },
        [data.chatId + '.tarih']: serverTimestamp(),
      });

      await updateDoc(doc(db, 'kullaniciChatler', data.user.uid), {
        [data.chatId + '.sonMesaj']: {
          text,
        },
        [data.chatId + '.tarih']: serverTimestamp(),
      });

      // Gönderme işleminden sonra state'leri sıfırla
      setText('');
      setImg(null);
    } catch (error) {
      console.error('Mesaj gönderirken bir hata oluştu:', error);
    }
  };

  return (
    <div className='input'>
      <input
        type='text'
        placeholder='Mesajınızı Yazınız'
        onChange={(e) => setText(e.target.value)}  value={text}
      />
      <div className='send'>
        <img src={Attachment} alt='' />
        <input
          type='file'
          style={{ display: 'none' }}
          id='file'
          onChange={(e) => setImg(e.target.files[0])}
        />
        <label htmlFor='file'>
          <img src={Attachment} alt='' />
        </label>
        <button onClick={handleGonder}>Gönder</button>
      </div>
    </div>
  );
}
