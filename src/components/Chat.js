import {useContext} from 'react'
import Messages from './Messages'
import Input from './Input'
import { ChatContext } from '../contexts/ChatContext'


export default function Chat() {

  const {data}=useContext(ChatContext)


  return (
    <div className='chat'>
    <div className='chatInfo'>
	<span>{data.user?.kullaniciAd}</span>
</div>

          <Messages />
          <Input />
    </div>
  )
}
