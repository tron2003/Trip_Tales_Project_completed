import { Box } from "@mui/material";

const UserImage = ({ image, size = "60px" }) => {//Will be Profile Image that we see for each User
  return (
    <Box width={size} height={size}>{/*Default height and width of 60px*/}
      <img 
        //style objectFit:cover-Takes up the entire space as necessary and then crop the sides if needed to fit the dimensions
        style={{ objectFit: "cover", borderRadius: "50%" }}//borderRadius:50% means it is a Circle
        width={size}
        height={size}
        alt="user"
        src={`http://localhost:3001/assets/${image}`}//Grab Profile Image as needed for each of the Profile Users
      />
    </Box>
  );
};

export default UserImage;