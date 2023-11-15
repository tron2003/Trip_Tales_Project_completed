import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { setPosts } from "state";
import PostWidget from "./PostWidget";

const PostsWidget = ({ userId, isProfile = false }) => {
  const dispatch = useDispatch();//Using Redux
  const posts = useSelector((state) => state.posts);//Storing lists of Posts
  const token = useSelector((state) => state.token);//Grabbing the tokens as well

  //Two API Calls-As on HomePage,all posts will be fetched But on Profile Page,we are gonna get only the User Posts
  const getPosts = async () => {
    const response = await fetch("http://localhost:3001/posts", {//Grab all the posts
      method: "GET",
      headers: { Authorization: `Bearer ${token}` },//Validate by API Call
    });
    const data = await response.json();//Making it usable with reponse.json
    dispatch(setPosts({ posts: data }));//Dispatch and set Posts inside our store
  };

  //Almost same as getPosts with only difference in URL
  const getUserPosts = async () => {
    const response = await fetch(
      `http://localhost:3001/posts/${userId}/posts`,//Fetching the posts from a particular user
      {
        method: "GET",
        headers: { Authorization: `Bearer ${token}` },
      }
    );
    const data = await response.json();
    dispatch(setPosts({ posts: data }));
  };

  useEffect(() => {
    if (isProfile) {
      getUserPosts();
    } else {
      getPosts();
    }
  }, []); //eslint-disable-line react-hooks/exhaustive-deps
  //Giving an empty array so it only calls once-The eslint comment to get rid of the warning
  return (
    <>
      {/*Creating Component for each Post and Destructure number of item from it*/}
      {posts.map(
        ({
          _id,
          userId,
          firstName,
          lastName,
          description,
          location,
          picturePath,
          userPicturePath,
          likes,
          comments,
        }) => (
          <PostWidget
            //Return Post Widget
            key={_id}//Need a Key to remove React warnings
            postId={_id}
            postUserId={userId}
            name={`${firstName} ${lastName}`}
            description={description}
            location={location}
            picturePath={picturePath}
            userPicturePath={userPicturePath}
            likes={likes}
            comments={comments}
          />
        )
      )}
    </>
  );
};

export default PostsWidget;