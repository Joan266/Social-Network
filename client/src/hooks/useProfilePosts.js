import { userApi } from '../services/userApi';
import { useInfiniteQuery } from '@tanstack/react-query';

const fetchProfilePosts = async ({ pageParam, username, userToken }) => {
  const { cursor, lastTimestamp } = pageParam;

  const headers = {
    'Content-Type': 'application/json',
    'Authorization': `Bearer ${userToken}`,
  };
  // Fetch user posts
  const profilePostsResponse = await userApi.fetchUserPosts({
    username, 
    cursor, 
    lastTimestamp,
  }, headers);
  let nextCursor;
  let previousCursor;

  // Determine next and previous cursors based on the number of posts returned
  if (profilePostsResponse.posts.length === 10) {
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
    posts: profilePostsResponse.posts,
    nextCursor,
    previousCursor,
    lastTimestamp: profilePostsResponse.timestamp
  };
};

const useFetchUserPosts = ({username, userToken}) => { 
  const { isLoading, isError, data, fetchNextPage, hasNextPage, fetchPreviousPage, hasPreviousPage } = useInfiniteQuery({
    queryKey: ['profile_posts'],
    queryFn: async ({ pageParam }) => fetchProfilePosts({ username, userToken, pageParam }),
    initialPageParam: { cursor:1 },
    refetchOnWindowFocus: false,
    getNextPageParam: (lastPage) => lastPage?.nextCursor ? {cursor: lastPage.nextCursor,lastTimestamp: lastPage.lastTimestamp} :undefined,
    getPreviousPageParam: (firstPage) => firstPage.previousCursor ? { cursor: firstPage.previousCursor, lastTimestamp: firstPage.lastTimestamp } : undefined,
    maxPages:2,
  })
  
  const posts = data?.pages?.flatMap(page => page.posts) ?? [];
  return { isLoading, isError, fetchNextPage, hasNextPage, posts, fetchPreviousPage, hasPreviousPage };
};

export default useFetchUserPosts;
