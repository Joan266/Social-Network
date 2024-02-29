import { userApi } from '../services/api';
import { useAuthContext } from './useAuthContext';
import { useInfiniteQuery } from '@tanstack/react-query';

const fetchProfilePosts = async ({ username, userToken, pageParam }) => {
  const { nextCursor, lastTimestamp } = pageParam
  const headers = {
    'Content-Type': 'application/json',
    'Authorization': `Bearer ${userToken}`,
  };
  // Fetch user posts
  const profilePostsResponse = await userApi.fetchUserPosts({
    username,
    nextCursor,
    lastTimestamp,
  }, headers);
  return {
    posts: profilePostsResponse.posts,
    nextCursor: profilePostsResponse.posts.length === 5 && pageParam.nextCursor < 4 ? pageParam.nextCursor + 1 : undefined,
    lastTimestamp: profilePostsResponse.timestamp
  };
};

const useFetchUserPosts = (username) => { 
  const { user } = useAuthContext();
  const { isLoading, isError, data, refetch, fetchNextPage, hasNextPage } = useInfiniteQuery({
    queryKey: ['profile_posts'],
    queryFn: async ({ pageParam }) => fetchProfilePosts({ username, userToken: user.token, pageParam }),
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
  })
  
  const posts = data?.pages?.flatMap(page => page.posts) ?? [];
  return { isLoading, isError, posts, refetch, fetchNextPage, hasNextPage };
};

export default useFetchUserPosts;
