import React, { useState, useEffect } from 'react'
import torchLight from './torch-light.svg'
import torchDark from './torch-dark.svg'
import { Helmet, HelmetProvider } from 'react-helmet-async'

const useLocalStorageState = (key, defaultValue) => {
  const [value, setValue] = useState(() => {
      const storedValue = localStorage.getItem(key)
      return storedValue === null ? defaultValue : JSON.parse(storedValue)
    })

    useEffect(() => {
      const listener = (e) => {
        if (e.storageArea === localStorage && e.key === key) {
          setValue(JSON.parse(e.newValue))
        }
      }

      window.addEventListener("storage", listener)

      return () => {
        window.removeEventListener("storage", listener)
      }
    }, [key])

  const setValueInLocalStorage = (newValue) => {
    setValue((currentValue) => {
      const result = typeof newValue === "function" ? newValue(currentValue) : newValue

      localStorage.setItem(key, JSON.stringify(result))
      return result
    })
  }

  return [value, setValueInLocalStorage]
}

const App = () => {
  const [username, setUsername] = useLocalStorageState("username", "")
  const [theme, setTheme] = useLocalStorageState("theme", "light")

  return (
    <HelmetProvider>
      <Helmet>
        <body data-theme={theme} />
      </Helmet>

      <button className="toggle-theme" onClick={() => setTheme(cur => cur === "light" ? "dark" : "light")}>
        <img src={theme === "light" ? torchDark : torchLight} alt="toggle theme" />
      </button>
      <h1>{theme}</h1>


      <input type="text" value={username} onChange={(e) => setUsername(e.target.value)} />
    </HelmetProvider>
  );
}

export default App;
