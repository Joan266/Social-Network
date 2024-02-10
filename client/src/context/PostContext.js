import { createContext, useReducer } from 'react'

export const PostsContext = createContext()

export const PostsReducer = (state, action) => {
  switch (action.type) {
    case 'SET_POST': 
      return {
        posts: action.payload
      }
    case 'ADD_POSTS':
      return {
        posts: action.payload
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
    homePosts: [],
    profliePosts:[],
  })

  return (
    <PostsContext.Provider value={{...state, dispatch}}>
      { children }
    </PostsContext.Provider>
  )
}