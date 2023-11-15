import { Box, useMediaQuery } from "@mui/material";
import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { useParams } from "react-router-dom";
import Navbar from "scenes/navbar";
import FriendListWidget from "scenes/widgets/FriendListWidget";
import MyPostWidget from "scenes/widgets/MyPostWidget";
import PostsWidget from "scenes/widgets/PostsWidget";
import UserWidget from "scenes/widgets/UserWidget";

const ProfilePage = () => {
  const [user, setUser] = useState(null);//Setting User specific to this Page-So Keep it as Local State
  const { userId } = useParams();//Grabbing User ID from the URL
  const token = useSelector((state) => state.token);
  const isNonMobileScreens = useMediaQuery("(min-width:1000px)");

  //API Call
  const getUser = async () => {
    const response = await fetch(`http://localhost:3001/users/${userId}`, {//Getting User Information
      method: "GET",
      headers: { Authorization: `Bearer ${token}` },
    });
    const data = await response.json();//Formatting the Response
    setUser(data);
  };

  useEffect(() => {//API Call using useEffect and passing an empty array
    getUser();
  }, []); // eslint-disable-line react-hooks/exhaustive-deps
  //Comment above to disable the linting

  //If User does not exists-Return Null
  if (!user) return null;

  return (
    <Box>
      <Navbar />
      <Box
        //Copied from Homepage
        width="100%"
        padding="2rem 6%"
        display={isNonMobileScreens ? "flex" : "block"}
        gap="2rem"//Changed
        justifyContent="center"//Changed
      >
        <Box flexBasis={isNonMobileScreens ? "26%" : undefined}>
          <UserWidget userId={userId} picturePath={user.picturePath} />{/*Changed as User.picture Path instead of just Picture Path*/}
          <Box m="2rem 0" />{/*Added*/}
          <FriendListWidget userId={userId} />{/*Added*/}
        </Box>
        <Box
          flexBasis={isNonMobileScreens ? "42%" : undefined}
          mt={isNonMobileScreens ? undefined : "2rem"}
        >
          <MyPostWidget picturePath={user.picturePath} />{/*Changed as User.picture Path instead of just Picture Path*/}
          <Box m="2rem 0" />
          <PostsWidget userId={userId} isProfile />{/*isProfile-Just grabbing this Person ID*/}
        </Box>
      </Box>
    </Box>
  );
};

export default ProfilePage;