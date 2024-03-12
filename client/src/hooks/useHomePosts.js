import { postApi } from '../services/postApi';
import { useAuthContext } from './useAuthContext';
import { useInfiniteQuery } from '@tanstack/react-query';

const fetchHomePosts = async ({ pageParam, userId, userToken }) => {
  const { cursor, lastTimestamp } = pageParam;
  
  const headers = {
    'Content-Type': 'application/json',
    'Authorization': `Bearer ${userToken}`,
  };

  const homePostsResponse = await postApi.fetchHomePosts({ 
    userId, 
    cursor, 
    lastTimestamp,
  }, headers);

  let nextCursor;
  let previousCursor;

  // Determine next and previous cursors based on the number of posts returned
  if (homePostsResponse.posts.length === 4) {
    nextCursor = cursor + 1;
    previousCursor = cursor - 1;
  } else {
    nextCursor = undefined;
    previousCursor = cursor - 1;
  }

  // Ensure the previous cursor doesn't go below 1
  if (cursor <= 1) {
    nextCursor = cursor + 1;
    previousCursor = undefined;
  }

  return {
    posts: homePostsResponse.posts,
    nextCursor,
    previousCursor,
    lastTimestamp: homePostsResponse.timestamp
  };
};


const useHomePosts = () => {
  const { user } = useAuthContext();
  const { isLoading, isError, data, refetch, fetchNextPage, hasNextPage, fetchPreviousPage, hasPreviousPage } = useInfiniteQuery({
    queryKey: ['home_posts'],
    queryFn: async ({ pageParam }) => fetchHomePosts({ userId: user._id, userToken: user.token, pageParam }),
    initialPageParam: { cursor:1 },
    refetchOnWindowFocus: false,
    getNextPageParam: (lastPage) => lastPage?.nextCursor ? {cursor: lastPage.nextCursor,lastTimestamp: lastPage.lastTimestamp} :undefined,
    getPreviousPageParam: (firstPage) => firstPage.previousCursor ? { cursor: firstPage.previousCursor, lastTimestamp: firstPage.lastTimestamp } : undefined,
    maxPages: 2,
  }
  );

  const posts = data?.pages?.flatMap(page => page.posts) ?? []
  
  return { isLoading, isError, refetch, fetchNextPage, hasNextPage, posts, fetchPreviousPage, hasPreviousPage };
};

export default useHomePosts;
