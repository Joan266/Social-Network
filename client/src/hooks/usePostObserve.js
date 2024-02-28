import { useEffect  } from "react";
import useHomePosts from "./useHomePosts";
export const usePostObserve = ({isPostObserve, currentPostRef}) => {
  
  const { fetchNextPage, hasNextPage } = useHomePosts();

  useEffect(() => {
    // Early return with logging
    if (!isPostObserve) {
      console.log("Not observing post.");
      return;
    }

    if (!currentPostRef ) {
      console.log("Cannot observe post. Missing reference.");
      return;
    }

    if ( !hasNextPage) {
      console.log("Cannot observe post. No next page.");
      return;
    }
    console.log("Observing post...");

    const observer = new IntersectionObserver(
      ([entry]) => {
        // Ensure that the entry is intersecting and is the target element
        if (entry.isIntersecting) {
          fetchNextPage();
          console.log("entry is intersecting")
        }
      },
      {
        root: null, // Use the viewport as the root
        threshold: 0.5, // Trigger when 50% of the component is visible
      }
    );
    
    // Start observing the PostDetails component
    observer.observe(currentPostRef);
    
    // Cleanup function
    return () => {
      if(observer && currentPostRef) {
        observer.unobserve(currentPostRef);
      }
    };
  }, [currentPostRef, isPostObserve, fetchNextPage, hasNextPage]); 
}
