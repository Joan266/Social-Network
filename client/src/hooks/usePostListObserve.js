import { useEffect } from "react";
import useHomePosts from "./useHomePosts";
import _ from "lodash";

export const usePostListObserve = ({ topRef, bottomRef }) => {
  const {
    fetchNextPage,
    hasNextPage,
    fetchPreviousPage,
    hasPreviousPage,
  } = useHomePosts();

  useEffect(() => {
    // let newTopPageMarkRef = null;

    // const debouncedHandleTopIntersection = _.debounce(handleTopIntersection, 700);
    const debouncedHandleBottomIntersection = _.debounce(handleBottomIntersection, 1000);

    const bottomObserver = createObserver(debouncedHandleBottomIntersection, 0.1);
    // const topObserver = createObserver(debouncedHandleTopIntersection, 0.1);

    // const topElement = topRef ? topRef.current : null;
    const bottomElement = bottomRef ? bottomRef.current : null;

    // if (topElement) {
    //   if (hasPreviousPage) {
    //     topObserver.observe(topElement);
    //   } else {
    //     topObserver.disconnect();
    //   }
    // }

    if (bottomElement) {
      if (hasNextPage) {
        bottomObserver.observe(bottomElement);
      } else {
        bottomObserver.disconnect();
      }
    }

    return () => {
      // topObserver.disconnect();
      bottomObserver.disconnect();
    };

    // function handleTopIntersection(entry) {
    //   if (entry.isIntersecting && hasPreviousPage) {
    //     console.log("top entry is intersecting");
    //     fetchPreviousPage();
    //     newTopPageMarkRef = document.querySelector("#newTopPageMark");
    //     if (newTopPageMarkRef) {
    //       newTopPageMarkRef.scrollIntoView({ behavior: "smooth" });
    //     }
    //   }
    // }

    function handleBottomIntersection(entry) {
      if (entry.isIntersecting && hasNextPage) {
        console.log("bottom entry is intersecting");
        fetchNextPage();
      }
    }

    function createObserver(callback, threshold) {
      return new IntersectionObserver(
        (entries) => {
          entries.forEach(callback);
        },
        {
          root: null,
          threshold,
        }
      );
    }
  }, [topRef, bottomRef, fetchPreviousPage, fetchNextPage, hasPreviousPage, hasNextPage]);
};
