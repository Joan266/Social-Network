import { createContext, useReducer } from 'react'

export const PostsContext = createContext()

export const PostsReducer = (state, action) => {
  switch (action.type) {
    case 'SET_POST': 
      return {
        posts: action.payload
      }
    case 'CREATE_POST':
      console.log(action.payload)
      return {
        posts: [action.payload, ...state.posts]
      }
    case 'DELETE_POST':
      return {
        posts: state.posts.filter((w) => w !== action.payload._id)
      }
    default:
      return state
  }
}

export const PostsContextProvider = ({ children }) => {
  const [state, dispatch] = useReducer(PostsReducer, {
    posts: []
  })

  return (
    <PostsContext.Provider value={{...state, dispatch}}>
      { children }
    </PostsContext.Provider>
  )
}