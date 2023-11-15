import {
    ChatBubbleOutlineOutlined,
    FavoriteBorderOutlined,
    FavoriteOutlined,
    ShareOutlined,
  } from "@mui/icons-material";//Icons for liking
  import { Box, Divider, IconButton, Typography, useTheme } from "@mui/material";
  import FlexBetween from "components/FlexBetween";
  import Friend from "components/Friend";
  import WidgetWrapper from "components/WidgetWrapper";
  import { useState } from "react";
  import { useDispatch, useSelector } from "react-redux";
  import { setPost } from "state";
  
  const PostWidget = ({
    postId,
    postUserId,
    name,
    description,
    location,
    picturePath,
    userPicturePath,
    likes,
    comments,
  }) => {//Return so
    //Adding Number of states-Copied from Friend.jsx
    const [isComments, setIsComments] = useState(false);//Open the Comments list
    const dispatch = useDispatch();
    const token = useSelector((state) => state.token);
    const loggedInUserId = useSelector((state) => state.user._id);//New part added
    const isLiked = Boolean(likes[loggedInUserId]);//New part added-likes is an Map Object-So here has the current user,liked it or not
    //To keep track of who has liked the Post
    const likeCount = Object.keys(likes).length;//New part added-Number of likes=Number of keys in the map
  
    const { palette } = useTheme();
    const main = palette.neutral.main;
    const primary = palette.primary.main;
  
    //Function to change Numbers of likes
    const patchLike = async () => {
      const response = await fetch(`http://localhost:3001/posts/${postId}/like`, {
        method: "PATCH",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ userId: loggedInUserId }),//Passing in User ID-To keep track whether current user has liked it or not
      });
      const updatedPost = await response.json();//Returning the updated Post
      dispatch(setPost({ post: updatedPost }));//state-index.js setPost will go through list of Posts to try to find the Post we hve just updated
      //And if so we are gonna replace it-And this is basically replacing that Single Post-Else return the original post if we did not find it
    };
  
    return (
      <WidgetWrapper m="2rem 0">
        <Friend
          //Creating Friend Component in Post Widget
          friendId={postUserId}//User who posted it
          name={name}
          subtitle={location}
          userPicturePath={userPicturePath}
        />
        <Typography color={main} sx={{ mt: "1rem" }}>
          {description}
        </Typography>
        {picturePath && (
          <img
            width="100%"
            height="auto"
            alt="post"
            style={{ borderRadius: "0.75rem", marginTop: "0.75rem" }}
            src={`http://localhost:3001/assets/${picturePath}`}
          />//Picture used in the Post
        )}
        <FlexBetween mt="0.25rem">
          <FlexBetween gap="1rem">
            <FlexBetween gap="0.3rem">
              <IconButton onClick={patchLike}>
                {isLiked ? (
                  <FavoriteOutlined sx={{ color: primary }} />
                ) : (
                  <FavoriteBorderOutlined />
                )}{/*Determining whether someone has liked that Icon or not*/}
              </IconButton>
              <Typography>{likeCount}</Typography>{/*Display like Counts*/}
            </FlexBetween>
  
            <FlexBetween gap="0.3rem">
              <IconButton onClick={() => setIsComments(!isComments)}>{/*!isComments-Revert the Comment Section-That is Open it*/}
                <ChatBubbleOutlineOutlined />
              </IconButton>
              <Typography>{comments.length}</Typography>{/*Determining Number of Comments*/}
            </FlexBetween>
          </FlexBetween>
  
          <IconButton>
            <ShareOutlined />
          </IconButton>
        </FlexBetween>
        {isComments && (//Displaying the comments
          <Box mt="0.5rem">
            {comments.map((comment, i) => (//Iterating through the comment Section
              <Box key={`${name}-${i}`}>{/*Giving Unique ID to the comments*/}
                <Divider />
                <Typography sx={{ color: main, m: "0.5rem 0", pl: "1rem" }}>
                  {comment}
                </Typography>
              </Box>
            ))}
            <Divider />
          </Box>
        )}
      </WidgetWrapper>
    );
  };
  
  export default PostWidget;