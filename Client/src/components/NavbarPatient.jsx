import React, { useState } from 'react';
import { Link, NavLink } from 'react-router-dom';
import Logo from './Logo';
import * as Icons from '@mui/icons-material';
import AccountMenu from './AccountMenu';
import {
  Divider,
  Drawer,
  IconButton,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
} from '@mui/material';
import { links } from '../constants';

export const getIconComponent = (iconName) => {
  const IconComponent = Icons[iconName];
  return IconComponent ? <IconComponent /> : null;
};

function Navbar() {
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);

  const toggleDrawer = (open) => (event) => {
    if (event.type === 'keydown' && (event.key === 'Tab' || event.key === 'Shift')) {
      return;
    }
    setIsDrawerOpen(open);
  };

  return (
    <nav className="p-4">
      <div className="container mx-auto flex items-center justify-between">
        <div className="flex items-center">
          <Link to="/" className=" text-2xl font-bold">
            <Logo />
          </Link>
        </div>
        <div className="flex items-center md:hidden">
          <IconButton onClick={toggleDrawer(true)} className="">
            <Icons.Menu />
          </IconButton>
          <AccountMenu />
        </div>
        <div className="hidden md:flex md:items-center md:ml-6 md:space-x-6">
          {links.map((link, index) => (
            <NavLink
              key={index}
              to={link.to}
              className={({ isActive }) =>
                isActive
                  ? 'py-2 px-4 text-secondary'
                  : 'block py-2 px-4 hover:text-primary hover:scale-105 rounded md:bg-transparent'
              }
            >
              <div className="flex items-center gap-2">
                {getIconComponent(link.icon)}
                {link.label}
              </div>
            </NavLink>
          ))}
        </div>
        <div className="hidden md:block">
          <AccountMenu />
        </div>
      </div>
      <Drawer anchor="left" open={isDrawerOpen} onClose={toggleDrawer(false)}>
        <div
          className="w-64"
          role="presentation"
          onClick={toggleDrawer(false)}
          onKeyDown={toggleDrawer(false)}
        >
          <List>
            {links.map((link, index) => (
              <NavLink
                key={index}
                to={link.to}
                className={({ isActive }) =>
                  isActive
                    ? 'block py-2 px-4 text-blue-800'
                    : 'block py-2 px-4 text-gray-800 hover:bg-gray-200'
                }
              >
                <ListItem>
                  <ListItemIcon>{getIconComponent(link.icon)}</ListItemIcon>
                  <ListItemText primary={link.label} />
                </ListItem>
              </NavLink>
            ))}
          </List>
          <Divider />
        </div>
      </Drawer>
    </nav>
  );
}

export default Navbar;