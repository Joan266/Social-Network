import { postApi } from '../services/postApi';
import { useAuthContext } from './useAuthContext';
import { useInfiniteQuery } from '@tanstack/react-query';

const fetchHomePosts = async ({ pageParam, userId, userToken }) => {
  const { cursor, lastTimestamp } = pageParam;
  
  await new Promise(resolve => setTimeout(resolve, 1250));
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
  if (homePostsResponse.posts.length === 20) {
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
  const { isFetchingNextPage, isLoading, isError, data, fetchNextPage, hasNextPage, fetchPreviousPage, hasPreviousPage } = useInfiniteQuery({
    queryKey: ['home_posts'],
    queryFn: async ({ pageParam }) => fetchHomePosts({ userId: user._id, userToken: user.token, pageParam }),
    initialPageParam: { cursor:1 },
    refetchOnWindowFocus: false,
    getNextPageParam: (lastPage) => lastPage?.nextCursor ? {cursor: lastPage.nextCursor,lastTimestamp: lastPage.lastTimestamp} :undefined,
    getPreviousPageParam: (firstPage) => firstPage.previousCursor ? { cursor: firstPage.previousCursor, lastTimestamp: firstPage.lastTimestamp } : undefined,
  }
  );

  const posts = data?.pages?.flatMap(page => page.posts) ?? []
  return { isFetchingNextPage,isLoading, isError, fetchNextPage, hasNextPage, posts, fetchPreviousPage, hasPreviousPage };
};

export default useHomePosts;
