'use client'

import { FiAlertCircle, FiXCircle } from "react-icons/fi"
import { FaRegHourglassHalf } from "react-icons/fa6";
import { checkUserApproval, requestApproval as requestApprovalRequest } from "@/lib/requests/approvals"
import { Approval } from '@/lib/models/Approval';
import { useState } from "react";
import Loader from "@/components/Loader";

function ApprovalSection({ defaultApproval, userId, eventId }: { defaultApproval: Approval, userId: string, eventId: string }) {
  const [approval, setApproval] = useState<Approval>(defaultApproval)
  const [isLoading, setIsLoading] = useState<Boolean>()

  const requestApproval = async () => {
    setIsLoading(true)
    requestApprovalRequest(userId, eventId).then(() => {
      checkUserApproval(eventId, userId).then(approval => {
        setApproval(approval);
        setIsLoading(false)
      })
    })
  }

  return <div>
    {isLoading && <Loader />}
    {!approval ?
      (<div className="flex flex-col items-center gap-4 text-center">
        <FiAlertCircle size={48} />
        <span>To access this event you need to ask orginizers for approval</span>
        <button className='btn' onClick={requestApproval}>Request approval</button>
      </div>) :
      approval.approved == null ?
        <div className="flex flex-col items-center gap-4 text-center">
          <FaRegHourglassHalf size={48} />
          <span>Your approval is pending</span>
        </div> :
        !approval.approved &&
        <div className="flex flex-col items-center gap-4 text-center">
          <FiXCircle size={48} />
          <span>This event is unavailable to you</span>
        </div>
    }
  </div>
}

export default ApprovalSection