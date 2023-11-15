import { Box, useMediaQuery } from "@mui/material";
import { useSelector } from "react-redux";
import Navbar from "scenes/navbar";
import UserWidget from "scenes/widgets/UserWidget";
import MyPostWidget from "scenes/widgets/MyPostWidget";
import PostsWidget from "scenes/widgets/PostsWidget";
import AdvertWidget from "scenes/widgets/AdvertWidget";
import FriendListWidget from "scenes/widgets/FriendListWidget";

const HomePage = () => {
  const isNonMobileScreens = useMediaQuery("(min-width:1000px)");//To keep Responsiveness
  const { _id, picturePath } = useSelector((state) => state.user);//Grab User Information using Reducer by useSelector

  return (
    <Box>
      <Navbar />{/*Importing NavBar- So we made the import { Box } from "@mui/material";*/}
      <Box
        width="100%"//Layout stuff
        padding="2rem 6%"
        display={isNonMobileScreens ? "flex" : "block"}/*So for Big Screens,widgets will be flex and so 
        Will be three in a row,but in Mobile Screens they will be one after the other as display:block */
        gap="0.5rem"
        justifyContent="space-between"
      >
        <Box flexBasis={isNonMobileScreens ? "26%" : undefined}>{/*Arbitrarily decided values*/}
          <UserWidget userId={_id} picturePath={picturePath} />{/*Parameters to use UserWidget-userId and picturePath*/}
        </Box>
        <Box
          flexBasis={isNonMobileScreens ? "42%" : undefined}
          mt={isNonMobileScreens ? undefined : "2rem"}//Margin-Top undefined for Desktops-So Desktops haven't set the margin top property
          //But for Mobiles,they are stacked on each other so we need margin
        >
          <MyPostWidget picturePath={picturePath} />{/*Post Widget*/}
          <PostsWidget userId={_id} />
        </Box>
        {isNonMobileScreens && (//Display Friends list only for Desktop
          <Box flexBasis="26%">
            <AdvertWidget />{/*Adding an Advert Widget*/}
            <Box m="2rem 0" />
            <FriendListWidget userId={_id} />{/*Adding Friend List Widget by adding user ID property*/}
          </Box>
        )}
      </Box>
    </Box>
  );
};

export default HomePage;