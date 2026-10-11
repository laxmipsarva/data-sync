import { useState, type ChangeEvent } from 'react'
import Papa from 'papaparse'
import { Row } from './Row'

interface CsvRow {
  user_id?: string | number | boolean | null
  email?: string | number | boolean | null
  signup_date?: string | number | boolean | null
  plan_tier?: string | number | boolean | null
  mrr?: string | number | boolean | null
  [key: string]: string | number | boolean | null | undefined
}

function App() {
  const [csvData, setCsvData] = useState<CsvRow[]>([])

  const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e?.target?.files?.[0] ?? null
    if (file) {
      Papa.parse<CsvRow>(file, {
        header: true,
        dynamicTyping: true,
        skipEmptyLines: true,
        complete: (results: Papa.ParseResult<CsvRow>) => {
          setCsvData(results.data)
        }
      })
    }
  }

  const styles = {
    main: {
      padding: '20px',
    },
    title: {
      color: '#5C6AC4'
    },
  }

  return (
    <div style={styles.main}>
      <input
        type="file"
        accept=".csv"
        onChange={handleFileChange}
      />
      {csvData.length > 0 && (
        <>
          <table border={1} style={{ marginTop: '20px', width: '100%', borderCollapse: 'collapse' }}>
            <thead>
              <tr>
                {Object.keys(csvData[0]).map((key) => (
                  <th key={key} style={{ padding: '8px' }}>{key}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {csvData.map((row, index) => (
                <Row key={index} col={row as any} saveData={false} />
              ))}
            </tbody>
          </table>
          <button onClick={() => ''}>Upload</button>
        </>
      )}
    </div>
  )
}

export default App
