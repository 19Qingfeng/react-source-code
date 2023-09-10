import { createRoot } from 'react-dom/client'

const element = <h1>Hello
  <span style={{color:'red'}}>World</span>
</h1>

const root = createRoot(document.getElementById('root'))

root.render(element)

// .render(element)

// console.log(element)
