import AppBar from "@mui/material/AppBar";
import Box from "@mui/material/Box";
import Toolbar from "@mui/material/Toolbar";
import IconButton from "@mui/material/IconButton";
import Typography from "@mui/material/Typography";
import Menu from "@mui/material/Menu";
import Container from "@mui/material/Container";
import Avatar from "@mui/material/Avatar";
import Button from "@mui/material/Button";
import Tooltip from "@mui/material/Tooltip";
import MenuItem from "@mui/material/MenuItem";
import React, {useState} from 'react';
import 'react-date-range/dist/styles.css';
import 'react-date-range/dist/theme/default.css';
import { DateRange } from 'react-date-range';
// import { spacing } from "@mui/system";
// import ReactSearchBox from "react-search-box";
import CalendarMonthIcon from '@mui/icons-material/CalendarMonth';
import TuneIcon from '@mui/icons-material/Tune';
import TextField from "@mui/material/TextField";



const pages = [""];
const settings = [
  {text: "Home", key: "home"}, 
  {text: "Search by Inventory", key: "searchbyinventory"}, 
  //{text: "Search By Date", key: "searchbydate"}, 
  {text: "Logout", key: "logout"}
];

 
function ResponsiveAppBar({setState1,state1,filterFn}) {
  const [anchorElNav, setAnchorElNav] = React.useState(null);
  const [anchorElUser, setAnchorElUser] = React.useState(null);
  const [calendarAnchorEl,setCalendarAnchorEl] = useState(null);
  const [anchorEl,setAnchorEl] = useState(null);
  const [searchInput, setSearchInput] = useState(null);
  const [inputText, setInputText] = useState("");


  const isMenuOpen = Boolean(anchorEl);

  const handleOpenNavMenu = (event) => {
    setAnchorElNav(event.currentTarget);
  };
  const handleOpenUserMenu = (event) => {
    setAnchorElUser(event.currentTarget);
  };

  const handleCloseNavMenu = (event) => {
     setCalendarAnchorEl(event.currentTarget)
    
    setAnchorElNav(null);
     setCalendarAnchorEl(null);
  };

  const handleCloseUserMenu = (e, data) => {
    if(data.toLowerCase() === "home"){
      console.log("Home clicked")
    }
    else if(data.toLowerCase() === "searchbyinventory"){
      console.log("searchbyinventory clicked")
    }
    else if(data.toLowerCase() === "searchbydate"){
      console.log("searchbydate clicked")
      setAnchorEl(e.currentTarget)
    }
    else if(data.toLowerCase() === "logout"){
      console.log("logout clicked")
    }
    setAnchorElUser(null);
  };

  const handleCalendarClose = () => {
    // setAnchorEl(null)
     //setAnchorElUser(null);
     setCalendarAnchorEl(null)
  }

  const handleDateOnchange = (item) =>{
    setState1([item.selection])
    filterFn(item)
  }

  const navMenuId = "calendar-1";
  const renderCalendar = (
      <Menu
        anchorEl={calendarAnchorEl}
        anchorOrigin={{
          vertical: 'top',
          horizontal: 'right',
        }}
        id={navMenuId}
        keepMounted
        transformOrigin={{
          vertical: 'top',
          horizontal: 'right',
        }}
        open={Boolean(calendarAnchorEl)}
        onClose={handleCalendarClose}
      >
        <DateRange onChange={(item) => handleDateOnchange(item)}
  ranges={state1}
/>
      </Menu>
    );


  return (
    <AppBar position="relative" color="primary">
      <Container maxWidth='xl' className="Appbar">
        <Toolbar disableGutters>
          <Typography>
            <img
              src="https://sandbox.lemmatechnologies.com/publisher/assets/img/insidelogo.png"
              width={160}
              height={30}
            />
          
          </Typography>
          
          <Box sx={{ flexGrow: 1, display: { xs: "none", md: "flex" } }}>
            {pages.map((page) => (
              <Button
                key={page}
                onClick={() => handleCloseNavMenu(page)}
                sx={{ my: 0,mx: 1, color: "white", display: "block" }}
              >
                {page}
              </Button>
            ))}
          </Box>
          <Box>
          <Typography>
        <TextField
          id="outlined-basic"
          //onChange={}
          variant="outlined"
          fullWidth
          label="Search"
        />
      </Typography>
          </Box>

          <Box sx={{ flexGrow: 0 }}>
            <Tooltip title="Select Date">
              <IconButton onClick={(event) => setCalendarAnchorEl(event.currentTarget)}>
                <CalendarMonthIcon />
              </IconButton>
            </Tooltip>
            <Tooltip title="Option Menu">
              <IconButton onClick={handleOpenUserMenu} sx={{ p: 2}}>
                <TuneIcon/>
              </IconButton>
             
            </Tooltip>
            <Menu
              sx={{ mt: "45px" }}
              id="menu-appbar"
              anchorEl={anchorElUser}
              anchorOrigin={{
                vertical: "top",
                horizontal: "right",
              }}
              keepMounted
              transformOrigin={{
                vertical: "top",
                horizontal: "right",
              }}
              open={Boolean(anchorElUser)}
              onClose={handleCloseUserMenu}
            >
              {settings.map((setting) => (
                <MenuItem key={setting.key} onClick={(e) => handleCloseUserMenu(e,setting.key)}>
                  <Typography textAlign="center">{setting.text}</Typography>
                </MenuItem>
              ))}
            </Menu>
          </Box>
        </Toolbar>
      </Container>
      {renderCalendar}
    </AppBar>
  );
}
export default ResponsiveAppBar;
