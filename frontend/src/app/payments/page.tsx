import { auth } from '@/auth';
import UserPaymentsList from '@/components/Payment/UserPaymentsList'
import { getUserPayments } from '@/lib/requests/payments';
import React from 'react'

async function PaymentsPage() {
  const session = await auth();
  const user = session?.user;
  const payments = await getUserPayments(user?.id!);
  
  return (
    <div>
      <div className='flex flex-col gap-2'>
        <h2>Owed By You</h2>
        <UserPaymentsList payments={payments} />
      </div>
    </div>
  )
}

export default PaymentsPage