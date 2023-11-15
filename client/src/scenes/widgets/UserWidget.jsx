import {
    ManageAccountsOutlined,
    EditOutlined,
    LocationOnOutlined,
    WorkOutlineOutlined,
  } from "@mui/icons-material";
import { Box, Typography, Divider, useTheme } from "@mui/material";
/*With the Source Configuration in JS Config,we can grab the route via Components
Because we start from the Source,go to components and then go to UserImage
Instead of doing relative Imports like this- "../../components/UserImage" */
import UserImage from "components/UserImage";//Created by us
import FlexBetween from "components/FlexBetween";//Created by us
import WidgetWrapper from "components/WidgetWrapper";//Created by us

import { useSelector } from "react-redux";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

const UserWidget = ({ userId, picturePath }) => {
    const [user, setUser] = useState(null);//Grabbing the User from the Backend
    const { palette } = useTheme();
    const navigate = useNavigate();
    const token = useSelector((state) => state.token);//Grabbing the Token from the store
    //Grabbing colors from Themes Files
    const dark = palette.neutral.dark;
    const medium = palette.neutral.medium;
    const main = palette.neutral.main;

    const getUser = async () => {//Grabbing User Information to display on Left Side of Webpage by API Call
        //API Call
        const response = await fetch(`http://localhost:3001/users/${userId}`, {
            method: "GET",
            headers: { Authorization: `Bearer ${token}` },//In our Authorization header,we are writing Bearer-In Server code
        });
        const data = await response.json();
        setUser(data);//setUser as Data
    };

    /*When you enter this page and because there is an empty array,getUser will be called when you 
    render this component first time*/
    useEffect(() => {
        getUser();//Grabbing getUser,Invoking it and hitting it with an empty array
    }, []); //eslint-disable-line react-hooks/exhaustive-deps
    //Using eslint exhaustive-dependencies

    if (!user) {//User does not exists-So Nothing to return for User Widget
        return null;
    }

    //Destructure Items from the User
    const {//Grabbing Properties
        firstName,
        lastName,
        location,
        occupation,
        viewedProfile,
        impressions,
        friends,
    } = user;

    return (
        <WidgetWrapper>
        {/* First Row of User Widget */}
        <FlexBetween
            gap="0.5rem"
            pb="1.1rem"//Padding Bottom-Shorthand provided by Material UI
            onClick={() => navigate(`/profile/${userId}`)}//Navigating to Profile Page on Click
        >
            <FlexBetween gap="1rem">
            <UserImage image={picturePath} />
            <Box>
                <Typography
                variant="h4"
                color={dark}
                fontWeight="500"
                sx={{
                    "&:hover": {
                    color: palette.primary.light,
                    cursor: "pointer",
                    },
                }}
                >
                {firstName} {lastName} {/*Display Name of the person*/}
                </Typography>
                <Typography color={medium}>{friends.length} friends</Typography>{/*To show Number of Friends*/}
            </Box>
            </FlexBetween>
            <ManageAccountsOutlined />{/*Icon*/}
        </FlexBetween>

        <Divider />

        {/* Second Row of User Widget */}
        <Box p="1rem 0">{/*1rem-Top and Bottom While 0rem-Left and Right*/}
            <Box display="flex" alignItems="center" gap="1rem" mb="0.5rem">{/*Different from FlexBetween as justify-content is not present with space between*/}
            <LocationOnOutlined fontSize="large" sx={{ color: main }} />
            <Typography color={medium}>{location}</Typography>
            </Box>
            <Box display="flex" alignItems="center" gap="1rem">
            <WorkOutlineOutlined fontSize="large" sx={{ color: main }} />
            <Typography color={medium}>{occupation}</Typography>
            </Box>
        </Box>

        <Divider />

        {/* Third Row of User Widget */}
        <Box p="1rem 0">
            <FlexBetween mb="0.5rem">
            <Typography color={medium}>Who's viewed your profile</Typography>
            <Typography color={main} fontWeight="500">
                {viewedProfile}
            </Typography>
            </FlexBetween>
            <FlexBetween>
            <Typography color={medium}>Impressions of your post</Typography>
            <Typography color={main} fontWeight="500">
                {impressions}
            </Typography>
            </FlexBetween>
        </Box>

        <Divider />

        {/* Fourth Row of user Widget */}
        <Box p="1rem 0">
            <Typography fontSize="1rem" color={main} fontWeight="500" mb="1rem">
            Social Profiles
            </Typography>

            <FlexBetween gap="1rem" mb="0.5rem">
            <FlexBetween gap="1rem">
                <img src="../assets/twitter.png" alt="twitter" />{/*Sourcing the Image we have manually placed in the Frontend*/}
                <Box>
                <Typography color={main} fontWeight="500">
                    Twitter
                </Typography>
                <Typography color={medium}>Social Network</Typography>
                </Box>
            </FlexBetween>
            <EditOutlined sx={{ color: main }} />
            </FlexBetween>

            {/*Same code just as above but for LinkedIn*/}
            <FlexBetween gap="1rem">
            <FlexBetween gap="1rem">
                <img src="../assets/linkedin.png" alt="linkedin" />
                <Box>
                <Typography color={main} fontWeight="500">
                    Linkedin
                </Typography>
                <Typography color={medium}>Network Platform</Typography>
                </Box>
            </FlexBetween>
            <EditOutlined sx={{ color: main }} />
            </FlexBetween>
        </Box>
        </WidgetWrapper>
    );
};

export default UserWidget;