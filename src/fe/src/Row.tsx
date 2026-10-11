import { useEffect } from 'react'

type RowData = {
  user_id: string | number
  email: string
  signup_date: string
  plan_tier: string
  mrr: number | string
}

type RowProps = {
  col: RowData
  saveData: boolean
}

export const Row = ({ col, saveData }: RowProps) => {
  const saveSubscription = async () => {
    try {
      await fetch('/api', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(col)
      })
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
      <td>{!saveData ? 'Not Saved' : 'Saved'}</td>
    </tr>
  )
}