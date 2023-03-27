import { Description } from "@material-ui/icons";
import React, { useEffect, useState } from "react";
import { getResources, MenuItemLink, translate } from "react-admin";
import { connect } from "react-redux";
import { withRouter } from "react-router-dom";
import storage, { Storage } from "../../core/Storage";

const mapStateToProps = state => ({
  resources: getResources(state)
});
type ISAMenuProps = {
  resources;
  onMenuClick;
  logout;
  translate;
  hasDashboard: boolean;
};

export const ISAMenu = withRouter(connect(mapStateToProps)(
  ({ resources, onMenuClick, logout, translate, ...props }: ISAMenuProps) => {
    const [reduceStockCount, setReduceStockCount] = useState(0);
    useEffect(() => {
      let rsList: any = storage.get(Storage.Keys.ReduceStockList);
      if (rsList) {
        rsList = JSON.parse(rsList);
        if (rsList.length) {
          setReduceStockCount(rsList.length);
        }
      }
    }, []);

    return (
      <div>
        {resources
          .filter(resource => !(resource.options && resource.options.hidden))
          .map(resource => (
            <MenuItemLink
              key={resource.name}
              to={`/${resource.name}`}
              primaryText={
                ((resource.options && translate(resource.options.label)) ||
                  translate(resource.name)) +
                (resource.name === "portfolio" && reduceStockCount > 0
                  ? `(${reduceStockCount})`
                  : "")
              }
              leftIcon={React.createElement(resource.icon)}
              onClick={onMenuClick}
            />
          ))}
        <MenuItemLink
          to="/trade-rules"
          primaryText={translate("common.guide")}
          leftIcon={<Description />}
          onClick={onMenuClick}
        />
        {/* 退出登录） */}
        {/*<Responsive
            small={logout}
            // medium={null} // Pass null to render nothing on larger devices
          />*/}
      </div>
    );
  }
) as any);

export default translate(ISAMenu);
