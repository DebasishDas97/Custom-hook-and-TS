import { useState } from 'react'
import { options } from './constants/options'
import { Select, SelectOptions } from './components/Select'

const App = () => {
  const [value1, setValue1] = useState<SelectOptions[]>([options[0]])
  const [value2, setValue2] = useState<SelectOptions | undefined>(options[0])
  return (
    <div>
      <Select multiple options={options} value={value1} onChange={o => setValue1(o)} />
      <Select options={options} value={value2} onChange={o => setValue2(o)} />
    </div>
  )
}

export default App