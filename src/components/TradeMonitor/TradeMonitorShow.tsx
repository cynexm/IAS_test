import { Divider, Drawer, Typography, Grid } from "@material-ui/core";
import { withStyles } from "@material-ui/core/styles";
import React from "react";
import {
  BooleanField,
  CardActions,
  DateField,
  EditButton,
  ListButton,
  NumberField,
  ReferenceField,
  RichTextField,
  Show,
  SimpleShowLayout,
  Tab,
  TabbedShowLayout,
  TextField,
} from "react-admin";
import { VirtualOrder } from "../../core/model";
import { EnvConfig } from "../../environment";
import { TransField } from "../common/TransField";
import { ApproveForm, ApproveTrigger } from "./../Order/OrderApprove";
import { ConfirmButton } from "./../Order/OrderConfirm";
import { FillForm, FillTrigger } from "./../Order/OrderFill";
import {
  ReasonUpdateForm,
  ReasonUpdateTrigger,
} from "./../Order/OrderReasonUpdate";
import AudioField from "../common/AudioField";
import { TradingRules } from "../../pages/TradingRules";
import { CancelButton } from "./../Order/OrderCancel";

const useStyles = {
  field: {
    display: "inline-block",
    width: "25%",
    whiteSpace: "nowrap",
  },
  clearBoth: {
    clear: "both",
  },
  fieldFloatLeft: {
    display: "inline-block",
    width: "25%",
    float: "left",
    whiteSpace: "nowrap",
  },
} as any;

const cardActionStyle = {
  zIndex: 2,
  display: "inline-block",
  float: "right",
};

const ShowActions = ({
  onFillClick,
  onReasonUpdateClick,
  basePath,
  data,
  record,
  resource,
  permissions,
  forReason,
  ...props
}: any) => {
  const [showReasonDrawer, switchReasonDrawer] = useState(false);
  const [showApproveDrawer, switchApproveDrawer] = useState(false);
  data = data || record;
  return forReason ? (
    <CardActions style={cardActionStyle}>
      {data && !(data as VirtualOrder).confirmed && permissions !== "vpm" && (
        <ConfirmButton record={data}></ConfirmButton>
      )}
      {data && !(data as VirtualOrder).confirmed && (
        <ReasonUpdateTrigger
          onClick={() => switchReasonDrawer(!showReasonDrawer)}
          record={data}
        ></ReasonUpdateTrigger>
      )}
      <Drawer
        anchor="bottom"
        open={showReasonDrawer}
        onClose={() => switchReasonDrawer(false)}
      >
        <ReasonUpdateForm
          permissions={permissions}
          onUpdateSuccess={() => switchReasonDrawer(false)}
          record={data}
          {...props}
        />
      </Drawer>
    </CardActions>
  ) : (
    <CardActions style={cardActionStyle}>
      {data &&
        ((data as VirtualOrder).status === 0 ||
          (data as VirtualOrder).verbose_status === "pending approval") &&
        permissions !== "vpm" && (
          <ApproveTrigger
            onClick={() => switchApproveDrawer(!showReasonDrawer)}
            record={data}
          ></ApproveTrigger>
        )}
      {data &&
        ((data as VirtualOrder).status === 0 ||
          (data as VirtualOrder).verbose_status === "pending approval") &&
        permissions !== "vpm" && <CancelButton record={data}></CancelButton>}

      {data &&
        (data as VirtualOrder).verbose_status === "pending fill" &&
        permissions !== "vpm" && (
          <FillTrigger onClick={onFillClick}></FillTrigger>
        )}
      <ListButton basePath={basePath} />
      <Drawer
        anchor="bottom"
        open={showApproveDrawer}
        onClose={() => switchApproveDrawer(false)}
      >
        <ApproveForm
          onUpdateSuccess={() => switchApproveDrawer(false)}
          record={data}
          {...props}
        />
      </Drawer>
    </CardActions>
  );
};

const { useState } = React;
export const TradeMonitorShow = withStyles(useStyles)(
  ({ classes, permissions, ...props }: any) => {
    console.debug("TradeMonitorShow: ", permissions, props);
    const [showFillDrawer, switchFillDrawer] = useState(false);
    return (
      <>
        <Show
          title="交易监控"
          actions={
            <ShowActions
              permissions={permissions}
              {...props}
              onFillClick={() => switchFillDrawer(!showFillDrawer)}
              // onReasonUpdateClick={() => switchReasonDrawer(!showReasonDrawer)}
            />
          }
          {...props}
        >
          <TabbedShowLayout>
            <Tab label="Summary">
              <TextField
                source="id"
                className={classes.field}
                label="Order ID"
              />
              <TransField
                className={classes.field}
                source="trx_purpose"
                align="center"
                transKey="valueTrans.purpose"
              />
              <ReferenceField
                linkType="show"
                source="security"
                reference="securities"
                className={classes.field}
              >
                <TextField source="name" />
              </ReferenceField>
              <ReferenceField
                linkType="show"
                source="portfolio"
                reference="portfolio"
                className={classes.field}
              >
                <TextField source="name" />
              </ReferenceField>
              {/*<ReferenceField*/}
              {/*linkType="show"*/}
              {/*source="security"*/}
              {/*reference="securities"*/}
              {/*className={classes.field}*/}
              {/*>*/}
              {/*<TextField source="name" />*/}
              {/*</ReferenceField>*/}
              {/*<ReferenceField*/}
              {/*linkType="show"*/}
              {/*source="portfolio"*/}
              {/*reference="portfolio"*/}
              {/*className={classes.field}*/}
              {/*>*/}
              {/*<TextField source="name" />*/}
              {/*</ReferenceField>*/}
              {/* <TransField
            style={{ textTransform: "capitalize" }}
            source="status"
            transKey="valueTrans.orderStatus"
          /> */}
              {/*<TextField*/}
              {/*className={classes.field}*/}
              {/*label="status"*/}
              {/*source="verbose_status"*/}
              {/*style={{ textTransform: "capitalize" }}*/}
              {/*/>*/}
              {/*<Divider />*/}
              {/* <BooleanField source="is_buy" className={classes.field} /> */}
              {/*<TransField*/}
              {/*label="Side"*/}
              {/*className={classes.field}*/}
              {/*source="is_buy"*/}
              {/*transKey="valueTrans.isBuy"*/}
              {/*keyInter={isBuy => (isBuy ? "buy" : "sell")}*/}
              {/*></TransField>*/}
              <Divider />
              <TransField
                className={classes.field}
                source="is_buy"
                transKey="valueTrans.isBuy"
                keyInter={(isBuy) => (isBuy ? "buy" : "sell")}
              ></TransField>
              {/* <BooleanField source="is_increase" className={classes.field} /> */}
              <TextField source="currency" className={classes.field} />

              <NumberField source="notional_unit" className={classes.field} />
              <ReferenceField
                className={classes.field}
                source="user"
                reference="users"
              >
                <TextField source="username" />
              </ReferenceField>
              <Divider />
              <DateField source="created" showTime className={classes.field} />
              <DateField
                source="last_modified"
                showTime
                className={classes.field}
              />
              <Divider />
              <div style={{ marginTop: "12px" }}></div>
              <Typography
                component="span"
                variant="subheading"
                className={classes.fieldFloatLeft}
              >
                Order Reason
              </Typography>
              <ShowActions
                permissions={permissions}
                {...props}
                forReason
                // onReasonUpdateClick={() => switchReasonDrawer(!showReasonDrawer)}
              />

              <AudioField source="reason_audio" className={classes.clearBoth} />
              <RichTextField source="reason_txt" />
              {/* </Tab> */}
              {/* <Tab labe/,,,l="Execution Details"> */}
              {/* <TransField
            style={{ textTransform: "capitalize" }}
            source="execution.status"
            transKey="valueTrans.executionStatus"
            className={classes.field}
          />
          <NumberField source="execution.fill_qty" label="Fill Qty" /> */}
            </Tab>
            {permissions !== "vpm" && (
              <Tab label="Trade Rules">
                <TradingRules {...props}></TradingRules>
              </Tab>
            )}
            <Drawer
              anchor="bottom"
              open={showFillDrawer}
              onClose={() => switchFillDrawer(false)}
            >
              <FillForm
                onUpdateSuccess={() => switchFillDrawer(false)}
                {...props}
              />
            </Drawer>
          </TabbedShowLayout>
          {/* </SimpleShowLayout> */}
        </Show>
      </>
    );
  }
);
