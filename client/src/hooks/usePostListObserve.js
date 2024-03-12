import { useEffect } from "react";
import useHomePosts from "./useHomePosts";
import { debounce } from "lodash"; // Import debounce function from lodash

export const usePostListObserve = ({topRef, bottomRef}) => {
  const { fetchNextPage, hasNextPage, fetchPreviousPage, hasPreviousPage } = useHomePosts();

  useEffect(() => {

    const element = topRef ? topRef.current : null

    if (!element) {
      console.log("Missing top reference.");
      return;
    }

    if (!hasPreviousPage) {
      console.log("No previous page.");
      return;
    }

    console.log("Observing top postList...");

    const observer = new IntersectionObserver(
      debounce(([entry]) => {
        // Ensure that the entry is intersecting and is the target element
        if (entry.isIntersecting) {
          console.log("top entry is intersecting");
          // Call fetchNextPage or fetchPreviousPage based on index after debounce
          fetchPreviousPage();
        }
      }, 100), // Debounce the function with 1 second delay
      {
        root: null,
        threshold: 0.1,
      }
    );

    observer.observe(element);

    // Cleanup function
    return () => {
      if (observer && element) {
        observer.unobserve(element);
      }
    };
  }, [topRef, fetchPreviousPage, hasPreviousPage]);

  useEffect(() => {

    const element = bottomRef ? bottomRef.current : null

    if (!element) {
      console.log("Missing bottom reference.");
      return;
    }

    if (!hasNextPage) {
      console.log("No next page.");
      return;
    }

    console.log("Observing bottom postList...");

    const observer = new IntersectionObserver(
      debounce(([entry]) => {
        // Ensure that the entry is intersecting and is the target element
        if (entry.isIntersecting) {
          console.log("entry is intersecting");
          // Call fetchNextPage or fetchPreviousPage based on index after debounce
          fetchNextPage();
        }
      }, 100), // Debounce the function with 1 second delay
      {
        root: null,
        threshold: 0.1,
      }
    );

    observer.observe(element);
    // Cleanup function
    return () => {
      if (observer && element) {
        observer.unobserve(element);
      }
    };
  }, [bottomRef, fetchNextPage, hasNextPage]);

};
