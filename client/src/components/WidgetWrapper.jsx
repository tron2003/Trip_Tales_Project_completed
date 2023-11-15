/*Widget Wrapper will be a style component*/
import { Box } from "@mui/material";
import { styled } from "@mui/system";

const WidgetWrapper = styled(Box)(({ theme }) => ({//Passing in an Object
  padding: "1.5rem 1.5rem 0.75rem 1.5rem",//Top Right Bottom Left-Clockwise Direction
  backgroundColor: theme.palette.background.alt,//Passing theme to grab the value
  borderRadius: "0.75rem",//Border-Radius
}));

export default WidgetWrapper;
//Will give us Base Styling for every Single Widget