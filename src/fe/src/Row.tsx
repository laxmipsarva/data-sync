import { useEffect, useState } from 'react'
import type { CsvRow } from './types'

type RowProps = {
  col: CsvRow
  saveData: boolean
}

export const Row = ({ col, saveData }: RowProps) => {
  const [isSaved, setIsSaved] = useState(false);
  const saveSubscription = async () => {
    try {
      const signupDate =
        typeof col.signup_date === 'string' || typeof col.signup_date === 'number'
          ? new Date(col.signup_date).toISOString()
          : new Date(0).toISOString();

      await fetch('/api/subscriptions/', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          user: {
            user_id: col.user_id,
            email: col.email
          },
          subscription: {
            signup_date: signupDate,
            plan_tier: col.plan_tier,
            mrr: col.mrr,
            user_id: col.user_id,
            is_active: col.is_active
          }
        })
      })
      setIsSaved(true);
    } catch (e) {
      console.log(e)
    }
  }
  useEffect(() => {
    if(saveData){
      saveSubscription()
    }
  }, [saveData])
  return (
    <tr>
      <td>{col.user_id}</td>
      <td>{col.email}</td>
      <td>{col.signup_date}</td>
      <td>{col.plan_tier}</td>
      <td>{col.mrr}</td>
      <td>{col.is_active}</td>
      <td>{!saveData ? 'Not Saved' : isSaved ? 'Saved' : 'Saving...'}</td>
    </tr>
  )
}