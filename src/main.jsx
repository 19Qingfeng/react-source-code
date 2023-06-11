import { createRoot } from 'react-dom/client'

const element = <h1>Hello
  <span style={{color:'red'}}>World</span>
</h1>

const root = createRoot(document.getElementById('root'))
console.log(root,'root')

// .render(element)

// console.log(element)
