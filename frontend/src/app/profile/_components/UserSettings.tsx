'use client'

import { createNotificationSubscription } from '@/lib/requests/subscriptions';
import React, { useState } from 'react'
import Image from "next/image"
import { FiEdit2 as EditIcon } from "react-icons/fi"
import ImageCropper, { readFile } from '../../../components/ImageCropper';
import Avatar from '@/components/Common/Avatar';
import { User } from '@/lib/models/User';

function UserSettings({ user }: { user: User }) {
  const [changeImageModalOpen, setChangeImageModalOpen] = useState<boolean>(false);

  const enableNotifications = () => {
    if ('serviceWorker' in navigator && 'PushManager' in window) {
      navigator.serviceWorker.register('/scripts/notifications_worker.js').then(function (swReg) {
        console.log('Service Worker is registered', swReg);

        swReg.pushManager.subscribe({
          userVisibleOnly: true,
          applicationServerKey: 'BDoqxWXp2K97_Wuk4s2On7aeqBus_ZvJuGLrOn_moB3LCElqnweRINPhgwL0byp8ktqCSCorTxPJSGpcZR7y02o'
        }).then(async function (subscription) {
          await createNotificationSubscription(user?.id!, subscription);
        });
      }).catch(function (error) {
        console.error('Service Worker Error', error);
      });
    }
  }

  return (
    <div>
      <div className='flex justify-center'>
        <div className='relative'>
          <Avatar profile={user} size='large' />
          <button className='btn bg-primary text-primary-content absolute bottom-2 right-2' onClick={() => setChangeImageModalOpen(true)}><EditIcon /></button>
        </div>
      </div>
      <div>
        <span className='font-bold'>Name: </span>
        <span>{user.name}</span>
      </div>
      <div>
        <span className='font-bold'>Notifications: </span>
        <input type="checkbox" className='checkbox' />
        <button onClick={enableNotifications} className='btn btn-success text-neutral-100'>Enable notifications</button>
      </div>
    </div>
  )
}

export default UserSettings