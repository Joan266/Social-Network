import { createContext, useReducer } from 'react'

export const PostsContext = createContext()

export const PostsReducer = (state, action) => {
  switch (action.type) {
    case 'SET_POST': 
      return {
        Post: action.payload
      }
    case 'CREATE_POST':
      return {
        Post: [action.payload, ...state.Post]
      }
    case 'DELETE_POST':
      return {
        Post: state.Post.filter((w) => w._id !== action.payload._id)
      }
    default:
      return state
  }
}

export const PostsContextProvider = ({ children }) => {
  const [state, dispatch] = useReducer(PostsReducer, {
    Post: null
  })

  return (
    <PostsContext.Provider value={{...state, dispatch}}>
      { children }
    </PostsContext.Provider>
  )
}