//Sidebar component present of every page; located AppNav
import React from 'react';
import clsx from 'clsx';
import { createStyles, makeStyles, useTheme, Theme } from '@material-ui/core/styles';
import Drawer from '@material-ui/core/Drawer';
import List from '@material-ui/core/List';
import Divider from '@material-ui/core/Divider';
import IconButton from '@material-ui/core/IconButton';
import MenuIcon from '@material-ui/icons/Menu';
import ChevronLeftIcon from '@material-ui/icons/ChevronLeft';
import ChevronRightIcon from '@material-ui/icons/ChevronRight';
import ListItem from '@material-ui/core/ListItem';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import ListItemText from '@material-ui/core/ListItemText';


//imports from material ui example

import '../scss/Sidebar.css'; 
import { ScreenWidthMaxMedium, ScreenWidthMaxLarge } from 'office-ui-fabric-react';
import { kMaxLength } from 'buffer';
//we overwrote the style for mui-drawer-paper to have the sidebar below OUR navbar
const drawerWidth = 220;

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    root: {
      display: 'flex',
      position: 'absolute',
    },
    
    center: {
      display: 'flex',
      justifyContent: 'center',
      alignContent: 'center'
    },
    appBar: {
      zIndex: theme.zIndex.drawer + 1,
      transition: theme.transitions.create(['width', 'margin'], {
        easing: theme.transitions.easing.sharp,
        duration: theme.transitions.duration.leavingScreen,
      }),
    },
    appBarShift: {
      marginLeft: drawerWidth,
      width: `calc(100% - ${drawerWidth}px)`,
      transition: theme.transitions.create(['width', 'margin'], {
        easing: theme.transitions.easing.sharp,
        duration: theme.transitions.duration.enteringScreen,
      }),
    },
    menuButton: {
    //   marginRight: 36,
      display: 'flex',
      justifyContent: 'center',
      
      
    },
    
    hide: {
      display: 'none',
    },
    drawer: {
      width: drawerWidth,
      flexShrink: 0,
      whiteSpace: 'nowrap',
      height: ScreenWidthMaxLarge
      
    },
    drawerPaper: {
      width: drawerWidth,
      
    },
    drawerOpen: {
      width: drawerWidth,
      transition: theme.transitions.create('width', {
        easing: theme.transitions.easing.sharp,
        duration: theme.transitions.duration.enteringScreen,
      }),
    },
    drawerClose: {
      transition: theme.transitions.create('width', {
        easing: theme.transitions.easing.sharp,
        duration: theme.transitions.duration.leavingScreen,
      }),
      overflowX: "hidden",
      width: theme.spacing(7) + 1,
      [theme.breakpoints.up('sm')]: {
        width: theme.spacing(9) + 1,
      },
    },
    toolbar: {
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'flex-end',
      padding: theme.spacing(0, 1),
      // necessary for content to be below app bar
      ...theme.mixins.toolbar,
    },
    content: {
      flexGrow: 1,
      padding: theme.spacing(3),
      

    },
  }),
);

const extraStyles = {

}

export default function Sidebar() {
  const classes = useStyles();
  const theme = useTheme();
  const [open, setOpen] = React.useState(true);

  const handleDrawerOpen = () => {
    setOpen(true);
  };

  const handleDrawerClose = () => {
    setOpen(false);
  };

  return (
    <div id = "sidebar">
      <div className={classes.root}>
      {/* <AppBar
        position="relative"
        className={clsx(classes.appBar, {
          [classes.appBarShift]: open,
        })} 
    >
        <Toolbar>
          
        </Toolbar>
       </AppBar>  */}
      <Drawer 
        variant="permanent"
        className={clsx(classes.drawer, {
          [classes.drawerOpen]: open,
          [classes.drawerClose]: !open,
        })}
        classes={{
          paper: clsx({
            [classes.drawerOpen]: open,
            [classes.drawerClose]: !open,
          }),
        }}
      >
        <div className={classes.toolbar}>            
          <IconButton onClick={handleDrawerClose}>
            {theme.direction === 'rtl' ? <ChevronRightIcon /> : <ChevronLeftIcon />}
          </IconButton>
          <IconButton
            color="inherit"
            aria-label="open drawer"
            onClick={handleDrawerOpen}
            edge="start"
            className={clsx(classes.menuButton, {
              [classes.hide]: open,
            })}
          >
            <MenuIcon/>
          </IconButton>
        </div>

        <Divider/>
        <List>
          {['My Feed','Pop Your Bubble!', 'LGBTQ+', 'Race', 'Education', 'Environment'].map((text, index) => (
            [
            <ListItem button key={text} onClick={handleDrawerClose}>
              <ListItemIcon></ListItemIcon> {/* Blank to have no icons shown when closed */}
              <ListItemText id="listText" primary={text} />
            </ListItem>,
            <Divider/>
           
            ]))}
            

        </List>
        
        <ListItem className="bottom">
                <ListItemIcon></ListItemIcon>
                <ListItemText primary="Add Topic +" id="addTopic"/>
            </ListItem>
      </Drawer>
      
    </div>
    </div>
  );
}