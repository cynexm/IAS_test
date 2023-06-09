import React, { Children, cloneElement, isValidElement } from "react";
import PropTypes from "prop-types";
import Tooltip from "@material-ui/core/Tooltip";
import IconButton from "@material-ui/core/IconButton";
import Menu from "@material-ui/core/Menu";
import AccountCircle from "@material-ui/icons/AccountCircle";
import { translate } from "ra-core";
import storage, { Storage } from "../../core/Storage";
import { Button, MenuItem, Drawer, ListItemText } from "@material-ui/core";
import SetPasswordTrigger, { SetPasswordForm } from "../User/UserSetPassword";

class UserMenu extends React.Component<any> {
  static propTypes = {
    children: PropTypes.node,
    label: PropTypes.string.isRequired,
    logout: PropTypes.node,
    icon: PropTypes.node,
    translate: PropTypes.func.isRequired
  };

  static defaultProps = {
    label: "ra.auth.user_menu",
    icon: <AccountCircle />
  };

  state = {
    auth: true,
    anchorEl: null,
    showDrawer: false
  };

  handleChange = (event, checked) => {
    this.setState({ auth: checked });
  };

  handleMenu = event => {
    this.setState({ anchorEl: event.currentTarget });
  };

  handleClose = () => {
    this.setState({ anchorEl: null });
  };

  render() {
    const { children, label, icon, logout, translate } = this.props;
    if (!logout && !children) {
      return null;
    }
    const { anchorEl } = this.state;
    const open = Boolean(anchorEl);

    return (
      <div>
        <Tooltip title={label && translate(label, { _: label })}>
          <Button
            aria-label={label && translate(label, { _: label })}
            aria-owns={open ? "menu-appbar" : undefined}
            aria-haspopup={true}
            color="inherit"
            onClick={this.handleMenu}
          >
            {storage.get(Storage.Keys.AuthUser)}
          </Button>
        </Tooltip>
        <Menu
          id="menu-appbar"
          anchorEl={anchorEl}
          anchorOrigin={{
            vertical: "top",
            horizontal: "right"
          }}
          transformOrigin={{
            vertical: "top",
            horizontal: "right"
          }}
          open={open}
          onClose={this.handleClose}
        >
          {Children.map(children, menuItem =>
            isValidElement(menuItem)
              ? cloneElement(menuItem, {
                  onClick: this.handleClose
                })
              : null
          )}
          <MenuItem
            button
            onClick={() => {
              this.setState({ showDrawer: true });
              this.handleClose();
            }}
          >
            <ListItemText primary="设置密码" />
          </MenuItem>
          {logout}
        </Menu>
        <Drawer anchor="bottom" open={this.state.showDrawer}>
          <SetPasswordForm
            onUpdateSuccess={() => this.setState({ showDrawer: false })}
          />
        </Drawer>
      </div>
    );
  }
}

export default translate(UserMenu);
