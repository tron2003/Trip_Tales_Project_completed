//Register and Login Functionality
import { useState } from "react";
import {
  Box,
  Button,
  TextField,
  useMediaQuery,
  Typography,
  useTheme,
} from "@mui/material";
import EditOutlinedIcon from "@mui/icons-material/EditOutlined";//Just for that Particular Icon
import { Formik } from "formik";//Will be used which is our Form Library
import * as yup from "yup";//Importing everything from yup which is our Validation Library
import { useNavigate } from "react-router-dom";//Be able to Navigate when registered to Login Page
import { useDispatch } from "react-redux";//Store User Information
import { setLogin } from "state";//Once the User sets the login Page
import Dropzone from "react-dropzone";//To Let user drop a file/image for their Profile Photo
import FlexBetween from "components/FlexBetween";//Will be using a lot

//Yup Validation Schema-Determines the Shape of how the Form Library is going to save the Information
const registerSchema = yup.object().shape({//Passing all the values of our Schema
  firstName: yup.string().required("required"),
  lastName: yup.string().required("required"),
  email: yup.string().email("invalid email").required("required"),
  password: yup.string().required("required"),
  location: yup.string().required("required"),
  occupation: yup.string().required("required"),
  picture: yup.string().required("required"),
  //Validating the credentials values used while Registering
});

const loginSchema = yup.object().shape({//Login Schema-Will be a Strip Down version of Register Schema
  email: yup.string().email("invalid email").required("required"),
  password: yup.string().required("required"),
});

//Initial Value Setup (As Schema for Values has been defined)
const initialValuesRegister = {
  firstName: "",
  lastName: "",
  email: "",
  password: "",
  location: "",
  occupation: "",
  picture: "",
};

const initialValuesLogin = {
  email: "",
  password: "",
};

//Creating our Form Component
const Form = () => {
  //Creating Number of States
  const [pageType, setPageType] = useState("login");//Display form depending on PageType-Initial value set to login
  const { palette } = useTheme();//Grabbing Palette from UseTheme
  const dispatch = useDispatch();//Setting up Dispatch
  const navigate = useNavigate();//useNavigate so that we can Navigate to different Pages
  const isNonMobile = useMediaQuery("(min-width:600px)");
  const isLogin = pageType === "login";//Variables just for our Convenience
  const isRegister = pageType === "register";//Variables just for our Convenience
  //As they are booleans-So they are starting with prefix 'is'

  const register = async (values, onSubmitProps) => {
    /*Every value that we have created inside the TextField will show up in the value Parameter
    Typically/Normally we could just use that values and then pass it into our request body itself
    But as we have picture Image,we are going to use this thing called FormData from our Javascript API
    This allows us to send form Info with Image-It essentially will be an Object*/
    const formData = new FormData();
    for (let value in values) {//Looping through every Key value in this values Object
      formData.append(value, values[value]);//Appending-One way to send the image through the request body
    }//This will cycle through all the values added to Form Data
    formData.append("picturePath", values.picture.name);//Appending Picture Path that will essentially be an Image
    //So Say Image is name as P1.jpg-Then that will be name of our file and that's going to be the path
    //We need to append this manually as that's how for the Images,it is going to work

    //Saving User response
    const savedUserResponse = await fetch(//Fetch Call to call an API to fetch whatever is returned
      "http://localhost:3001/auth/register",
      {//Sending form data to "http://localhost:3001/auth/register" API Call
        method: "POST",
        body: formData,
      }
    );
    const savedUser = await savedUserResponse.json();//Converting it into parsable form by JSON and saving it
    onSubmitProps.resetForm();//Resetting the Form-So That's why we are passing onSubmitProps from Formik

    if (savedUser) {
      setPageType("login");//If Registration is successful,re-navigate to login page
    }
  };

  const login = async (values, onSubmitProps) => {//Same Arguments as Register function
    const loggedInResponse = await fetch("http://localhost:3001/auth/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },//headers being Content-type as we are not doing Form Data now
      body: JSON.stringify(values),//Jsonify the values as they are formatted in correct way already
    });
    const loggedIn = await loggedInResponse.json();
    onSubmitProps.resetForm();//Reset the Form
    if (loggedIn) {//API Call succeeded-User Successfully Authenticated Then dispatch setLogin Function
      dispatch(
        setLogin({
          user: loggedIn.user,//Parameters coming from Redux state
          token: loggedIn.token,//To be passed as an Object-A Thing about Redux Toolkit
        })
      );
      navigate("/home");//Navigate to Home as we have successfully authenticated
    }
  };

  const handleFormSubmit = async (values, onSubmitProps) => {//Asynchronous Function to Handle Form Submission
    //The arguments-values and onSubmitProps is coming from Formic
    if (isLogin) await login(values, onSubmitProps);
    if (isRegister) await register(values, onSubmitProps);
  };

  return (
    /*Returning the Formik Component*/
    <Formik
      onSubmit={handleFormSubmit}
      initialValues={isLogin ? initialValuesLogin : initialValuesRegister}
      /*So When we are on LoginPage-We will initialize the values with our Login Component
      Otherwise we use our Register Object */
      validationSchema={isLogin ? loginSchema : registerSchema}//Doing Same thing for Validation Schema
    >
      {/*Having values to use in our Components and Form*/}
      {({
        values,
        errors,
        touched,
        handleBlur,
        handleChange,
        handleSubmit,
        setFieldValue,
        resetForm,
      }) => (
        <form onSubmit={handleSubmit}>{/*Formik is grabbing the HandleFormSubmit and passing it into
        our Formik values and then to onSubmit function*/}
          <Box
            display="grid"//Using Grid for this Section
            gap="30px"//Gap of 30pixels between items
            gridTemplateColumns="repeat(4, minmax(0, 1fr))"//fr-Fractional Unit And we are creating our Grid Template Columns
            //So We are splitting our grid into 4 sections-And it's going to be a minimum of 0 if it's too small it will shrink all the way to 0
            //Otherwise We are gonna split it in equal fractions of Four
            sx={{
              "& > div": { gridColumn: isNonMobile ? undefined : "span 4" },//Targeting any Div's of our Box as a Child Component/Child Class
            }}//If NonMobile-grid Columns of Text will be what we have defined earlier
            //But If It is a Mobile-gridColumns span will be 4-That is each Text field will have it's own entire Width
          >
            {isRegister && (//If On Register Page
              <>
                <TextField 
                  /*Textfield is an Input Component from Material UI*/
                  label="First Name"
                  onBlur={handleBlur}//handleBlur-Will handle the situation when we click out of a Input
                  onChange={handleChange}//Handle the situation when we are typing
                  value={values.firstName}
                  name="firstName"//Syncing it to the correct value in initialValuesRegister
                  //name has to align with the value we are setting in initialValuesRegister
                  error={
                    Boolean(touched.firstName) && Boolean(errors.firstName)
                  }//If First Name has been touched or There is an error=Will show Error in the Textfield
                  helperText={touched.firstName && errors.firstName}
                  sx={{ gridColumn: "span 2" }}//In Larger Screens we will have span of 2
                  //But In Smaller Screen-span 4 will overwrite span 2
                />
                <TextField
                  //Rest all field are same-Just change the variables
                  label="Last Name"
                  onBlur={handleBlur}
                  onChange={handleChange}
                  value={values.lastName}
                  name="lastName"
                  error={Boolean(touched.lastName) && Boolean(errors.lastName)}
                  helperText={touched.lastName && errors.lastName}
                  sx={{ gridColumn: "span 2" }}
                />
                <TextField
                  //Everything Same-Just make them Span of 4
                  label="Location"
                  onBlur={handleBlur}
                  onChange={handleChange}
                  value={values.location}
                  name="location"
                  error={Boolean(touched.location) && Boolean(errors.location)}
                  helperText={touched.location && errors.location}
                  sx={{ gridColumn: "span 4" }}
                />
                <TextField
                  label="Occupation"
                  onBlur={handleBlur}
                  onChange={handleChange}
                  value={values.occupation}
                  name="occupation"
                  error={
                    Boolean(touched.occupation) && Boolean(errors.occupation)
                  }
                  helperText={touched.occupation && errors.occupation}
                  sx={{ gridColumn: "span 4" }}
                />
                <Box
                  //Box of Inputting Profile Image
                  gridColumn="span 4"
                  border={`1px solid ${palette.neutral.medium}`}
                  borderRadius="5px"
                  p="1rem"
                >
                  <Dropzone
                    //Inside Box-Using Component Dropzone
                    acceptedFiles=".jpg,.jpeg,.png"//Passing Configurations for Files format to accept
                    multiple={false}//You can set only one file-Can't upload multiple files
                    onDrop={(acceptedFiles) =>
                      //onDrop-Callback function of what we do with the Files once the User Drops it in
                      setFieldValue("picture", acceptedFiles[0])//Since we are using Dropzone,we have to set this value manually
                      //setFieldValue for a specific Formic Field called Picture
                    }
                  >
                    {({ getRootProps, getInputProps }) => (//Callback Function from DropZone-Using Props to pass in JSX
                      <Box
                        {...getRootProps()}//Pass and to get Root Props-Something we have to do with the Dropzone
                        border={`2px dashed ${palette.primary.main}`}
                        p="1rem"
                        sx={{ "&:hover": { cursor: "pointer" } }}//Targetting the Hover
                      >
                        <input {...getInputProps()} />{/*Invoking getInputProps() function*/}
                        {!values.picture ? (//If Value does not exists for the picture-Display the Paragraph tag
                          <p>Add Picture Here</p>
                        ) : (
                          <FlexBetween>
                            <Typography>{values.picture.name}</Typography>{/*Otherwise show the name of the Image that has been added
                            If value exists for picture*/}
                            <EditOutlinedIcon />
                          </FlexBetween>
                        )}
                      </Box>
                    )}
                  </Dropzone>
                </Box>
              </>
            )}

            {/*This Section Email and Password will be for both Login and Register Page*/}
            <TextField
              label="Email"
              onBlur={handleBlur}
              onChange={handleChange}
              value={values.email}
              name="email"
              error={Boolean(touched.email) && Boolean(errors.email)}
              helperText={touched.email && errors.email}
              sx={{ gridColumn: "span 4" }}
            />
            <TextField
              label="Password"
              type="password"//Only thing added-As we want the Password to be hidden when typing it
              onBlur={handleBlur}
              onChange={handleChange}
              value={values.password}
              name="password"
              error={Boolean(touched.password) && Boolean(errors.password)}
              helperText={touched.password && errors.password}
              sx={{ gridColumn: "span 4" }}
            />
          </Box>

          {/* Buttons */}
          <Box>{/*Creating Button-Which will switch between being a Register button/Login Button */}
            <Button
              fullWidth
              type="submit"
              sx={{
                m: "2rem 0",
                p: "1rem",
                backgroundColor: palette.primary.main,
                color: palette.background.alt,
                "&:hover": { color: palette.primary.main },
              }}
            >
              {isLogin ? "LOGIN" : "REGISTER"} {/*Switching the text for the Button as Login or Register
              According to the Page it is present on*/}
            </Button>
            <Typography
              onClick={() => {
                setPageType(isLogin ? "register" : "login");
                resetForm();//When Switching between register and login,we are cleaning the inputs we already have
              }}
              sx={{
                textDecoration: "underline",
                color: palette.primary.main,
                "&:hover": {
                  cursor: "pointer",
                  color: palette.primary.light,
                },
              }}
            >
              {isLogin
                ? "Don't have an account? Sign Up here"
                : "Already have an account? Login here"}
                {/*If on Login Page- isLogin will be true so text "Don't have an account? Sign Up here"
                will be shown But if it is False-The text "Already have an account? Login here" will be shown*/}
            </Typography>
          </Box>
        </form>
      )}
    </Formik>
  );
};

export default Form;
/*Logic when we click on Register or Login is handled by button type Submit and anytime we have Button type
submit-This Function will run and it will handle the stuff-
<form onSubmit={handleSubmit}>
And handleSubmit is actually-
const handleFormSubmit = async (values, onSubmitProps)
if (isLogin) await login(values, onSubmitProps);->If we are on isLogin Page,we call our functionality
which uses Backend to let us log in
if (isRegister) await register(values, onSubmitProps);*/