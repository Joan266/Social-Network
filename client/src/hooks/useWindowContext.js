import { WindowContext } from "../context/WindowContext.js"
import { useContext } from "react"

export const useWindowContext = () => {
  const context = useContext(WindowContext)

  if(!context) {
    throw Error('useWindowContext must be used inside an WindowContextProvider')
  }

  return context
}