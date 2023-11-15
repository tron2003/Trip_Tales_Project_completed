import { PersonAddOutlined, PersonRemoveOutlined } from "@mui/icons-material";
import { Box, IconButton, Typography, useTheme } from "@mui/material";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { setFriends } from "state";
import FlexBetween from "./FlexBetween";
import UserImage from "./UserImage";

//Friend Component-Takes in friendId,name,subtitle and userPicturePath
const Friend = ({ friendId, name, subtitle, userPicturePath }) => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { _id } = useSelector((state) => state.user);//Grab the state.user
  const token = useSelector((state) => state.token);//Grab the token of current user
  const friends = useSelector((state) => state.user.friends);//Grabbing Friends from useSelector-No need of API Call
  //User will have friends array attached

  const { palette } = useTheme();//Grab the Colours
  const primaryLight = palette.primary.light;
  const primaryDark = palette.primary.dark;
  const main = palette.neutral.main;
  const medium = palette.neutral.medium;

  const isFriend = friends.find((friend) => friend._id === friendId);//If the User is a friend-Show Icon to remove friend
  //And vice versa-Done by checking if the Friend exists and Friend ID is equivalent to Friend ID being passed in from the parent component

  //Function to make API Call to check whether we will be able to add a Friend or not-Depending on whether they are already a friend
  const patchFriend = async () => {
    const response = await fetch(
      `http://localhost:3001/users/${_id}/${friendId}`,//Passing ID of current user and Friend ID to add/remove a friend
      {
        method: "PATCH",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      }
    );
    const data = await response.json();
    dispatch(setFriends({ friends: data }));
  };

  return (
    <FlexBetween>
      <FlexBetween gap="1rem">
        <UserImage image={userPicturePath} size="55px" />
        <Box
          onClick={() => {
            navigate(`/profile/${friendId}`);//There is a Bug when we are user and go to Certain person's profile page
            //Then we click on someone's else profile page and go to that user-The URL does update with the React Router
            //But the Components do not re-render
            navigate(0);//Basically we go to next user page and refresh the page to solve the Bug
          }}
        >
          <Typography
            color={main}
            variant="h5"
            fontWeight="500"
            sx={{
              "&:hover": {
                color: palette.primary.light,
                cursor: "pointer",
              },
            }}
          >
            {name}
          </Typography>
          <Typography color={medium} fontSize="0.75rem">
            {subtitle}
          </Typography>
        </Box>
      </FlexBetween>
      <IconButton
        //To remove or add Friend Icon
        onClick={() => patchFriend()}
        sx={{ backgroundColor: primaryLight, p: "0.6rem" }}
      >
        {isFriend ? (
          <PersonRemoveOutlined sx={{ color: primaryDark }} />//Remove Friend Icon
        ) : (
          <PersonAddOutlined sx={{ color: primaryDark }} />//Add Friend Icon
        )}
      </IconButton>
    </FlexBetween>
  );
};

export default Friend;