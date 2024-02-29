import { postApi } from '../services/api';
import { useAuthContext } from './useAuthContext';
import { useInfiniteQuery } from '@tanstack/react-query';

const fetchHomePosts = async ({ pageParam, userId, userToken}) => {
  const { nextCursor, lastTimestamp } = pageParam
  const headers = {
    'Content-Type': 'application/json',
    'Authorization': `Bearer ${userToken}`,
  };
  const homePostsResponse = await postApi.fetchHomePosts({ 
    userId, 
    nextCursor, 
    lastTimestamp,
  }
    , headers);
  return {
    posts: homePostsResponse.posts,
    nextCursor: homePostsResponse.posts.length === 5 && pageParam.nextCursor < 4 ? pageParam.nextCursor + 1 : undefined,
    lastTimestamp: homePostsResponse.timestamp
  };
};

const useHomePosts = () => {
  const { user } = useAuthContext();
  const { isLoading, isError, data, refetch, fetchNextPage, hasNextPage } = useInfiniteQuery({
    queryKey: ['home_posts'],
    queryFn: async ({ pageParam }) => fetchHomePosts({ userId: user._id, userToken: user.token, pageParam }),
    initialPageParam: { nextCursor:1 },
    refetchOnWindowFocus: false,
    getNextPageParam: (lastPage) => {
      if (lastPage.posts.length > 0) {
        if(!lastPage.nextCursor) return undefined
        return { nextCursor: lastPage.nextCursor, lastTimestamp: lastPage.lastTimestamp };
      } else {
        return null; // Return null if there are no more pages
      }
    }
  }
  );

  const posts = data?.pages?.flatMap(page => page.posts) ?? []
  
  return { isLoading, isError, refetch, fetchNextPage, hasNextPage, posts };
};

export default useHomePosts;
