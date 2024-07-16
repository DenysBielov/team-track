import { auth } from "@/auth"
import { getUserPositionPayments } from "@/lib/requests/user";
import moment from "moment";
import Link from "next/link"

export default async function PaymentsPage() {
  const session = await auth()
  const user = session?.user;
  const positions = await getUserPositionPayments(user?.id!)

  return (<div>
    <div className="flex flex-col gap-4">
      {positions && positions.length > 0 ? positions.map(p => <div className="h-14 rounded-md bg-primary text-primary-content flex items-center p-4 justify-between" key={`${p.date}${p.eventId}`}>
        <div className="flex gap-4">
          <Link className="link" href={`/events/${p.eventId}`}>{moment(p.date).format("DD MMM YYYY")}</Link>
          <span className="font-bold">{p.position}</span>
        </div>
        {p.paid ?
          <span className="badge badge-success">Paid</span> :
          <span className="badge badge-error">Not paid</span>
        }
      </div>) :
        <span className="self-center font-bold">You have no pending payments</span>
      }
    </div>
  </div>)
}