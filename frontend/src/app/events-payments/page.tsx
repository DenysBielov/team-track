import { auth } from "@/auth"
import { getEventPayments } from "@/lib/requests/payments";
import moment from "moment";
import Link from "next/link"
import Image from "next/image"
import PaymentsList from "./_components/PaymentsList";

export default async function PaymentsPage() {
  const session = await auth()
  const user = session?.user;
  const payments = await getEventPayments(user?.id!)
  console.log(payments)
  return (<div>
    <div className="flex flex-col gap-4">
      {payments && payments.length > 0 ?
        payments.map(payment => {
          return <div key={payment.eventId} className="flex flex-col gap-4">
            <Link className="link font-bold text-xl" href={`/events/${payment.eventId}`}>{moment(payment.date).format("DD MMM YYYY")} at {payment.location}</Link>
            <div className="flex flex-col gap-4">
              <PaymentsList positions={payment.positions} />
            </div>
          </div>
        }) :
        <span className="self-center font-bold">There are no pending payments</span>
      }
    </div>
  </div>)
}