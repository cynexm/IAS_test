import { Divider, Drawer, Typography } from "@material-ui/core";
import { withStyles } from "@material-ui/core/styles";
import React from "react";
import {
  CardActions,
  DateField,
  Labeled,
  ListButton,
  NumberField,
  FunctionField,
  ReferenceField,
  RichTextField,
  Show,
  Tab,
  TabbedShowLayout,
  TextField,
} from "react-admin";
import { VirtualOrder } from "../../core/model";
import { TransField, LinkedField } from "../common/";
import { ApproveForm, ApproveTrigger } from "./OrderApprove";
import { ConfirmButton } from "./OrderConfirm";
import { FillForm, FillTrigger } from "./OrderFill";
import { ReasonUpdateForm, ReasonUpdateTrigger } from "./OrderReasonUpdate";
import AudioField from "../common/AudioField";
import { TradingRules } from "../../pages/TradingRules";
import { CancelButton } from "./OrderCancel";

const useStyles = {
  field: {
    display: "inline-block",
    width: "20%",
    whiteSpace: "nowrap",
  },
  clearBoth: {
    clear: "both",
  },
  fieldFloatLeft: {
    display: "inline-block",
    width: "20%",
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
  forReason,
  permissions,
  ...props
}: any) => {
  data = data || record;

  const [showReasonDrawer, switchReasonDrawer] = useState(false);
  const [showFillDrawer, switchFillDrawer] = useState(false);
  const [showApproveDrawer, switchApproveDrawer] = useState(false);
  const [reasonCanUpdate, setReasonCanUpdate] = useState(
    data && data.status !== 2 && !data.confirmed
  );
  // const reasonCanUpdate = data && data.status !==2 && !data.confirmed;

  return forReason ? (
    <CardActions style={cardActionStyle}>
      {reasonCanUpdate && permissions !== "vpm" && (
        <ConfirmButton
          record={data}
          disabled={!data.reason || data.reason.length === 0}
          onUpdateSuccess={() => setReasonCanUpdate(false)}
        ></ConfirmButton>
      )}
      {reasonCanUpdate && (
        <ReasonUpdateTrigger
          onClick={() => switchReasonDrawer(!showReasonDrawer)}
          record={data}
        ></ReasonUpdateTrigger>
      )}
      {/* <EditButton basePath={basePath} record={data} /> */}

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
      {data && (data as VirtualOrder).status === 1 && permissions !== "vpm" && (
        <FillTrigger
          onClick={() => switchFillDrawer(!showFillDrawer)}
          record={data}
        />
      )}

      {data && (data as VirtualOrder).status === 0 && permissions !== "vpm" && (
        <ApproveTrigger
          onClick={() => switchApproveDrawer(!showReasonDrawer)}
          record={data}
        ></ApproveTrigger>
      )}

      {data && (data as VirtualOrder).status !== 2 && permissions !== "vpm" && (
        <CancelButton record={data}></CancelButton>
      )}

      <Drawer
        anchor="bottom"
        open={showApproveDrawer}
        onClose={() => switchApproveDrawer(false)}
      >
        <ApproveForm
          permissions={permissions}
          onUpdateSuccess={() => switchApproveDrawer(false)}
          record={data}
          {...props}
        />
      </Drawer>

      <Drawer
        anchor="bottom"
        open={showFillDrawer}
        onClose={() => switchFillDrawer(false)}
      >
        <FillForm
          permissions={permissions}
          onUpdateSuccess={() => switchFillDrawer(false)}
          record={data}
          {...props}
        />
      </Drawer>
      <ListButton basePath={basePath} />
      {/* <EditButton basePath={basePath} record={data} /> */}
    </CardActions>
  );
};

const ConditionalRichTextField = ({ record, permissions, ...rest }) => {
  const show =
    permissions === "vpm"
      ? true
      : record.reason_txt && record.reason_txt !== record.reason;
  return show ? (
    <Labeled label="resources.order.fields.reason_txt">
      <RichTextField
        source="reason_txt"
        record={record}
        addLabel={true}
        {...rest}
      />
    </Labeled>
  ) : null;
};

const ConditionalTransField = ({ ...props }) => {
  const { record } = props;
  const style =
    record && !record.is_buy
      ? { color: "red", textDecoration: "underline" }
      : null;
  return (
    <Labeled label="resources.order.fields.is_buy">
      <TransField
        source="is_buy"
        transKey="valueTrans.isBuy"
        style={style}
        record={record}
        addTxt={
          record && !record.is_buy && record.trx_purpose === "open"
            ? "short"
            : null
        }
        {...props}
      />
    </Labeled>
  );
};

const { useState } = React;
export const OrderShow = withStyles(useStyles)(
  ({ classes, permissions, ...props }: any) => {
    const [showFillDrawer, switchFillDrawer] = useState(false);
    return (
      <>
        <Show
          title="resources.order.detail"
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
              <TextField source="sn" className={classes.field} />

              <TextField
                label="resources.order.fields.security"
                source="security_name"
                className={classes.field}
              />
              <TextField
                label="resources.order.fields.ticker"
                source="ticker"
                className={classes.field}
              />

              <LinkedField
                source="portfolio"
                resourceName="portfolio"
                displayText="portfolio_name"
                className={classes.field}
                addLabel={true}
              />

              <LinkedField
                source="user"
                displayText="user_name"
                resourceName="users"
                className={classes.field}
                addLabel={true}
              />

              <Divider />
              {/* <BooleanField source="is_buy" className={classes.field} /> */}
              <TransField
                className={classes.field}
                source="trx_purpose"
                align="center"
                transKey="valueTrans.purpose"
              />
              <ConditionalTransField
                className={classes.field}
                source="is_buy"
                transKey="valueTrans.isBuy"
                keyInter={(isBuy) => (isBuy ? "buy" : "sell")}
              />
              <NumberField
                source="position_notional"
                className={classes.field}
              />

              {/* <BooleanField source="is_increase" className={classes.field} /> */}

              <NumberField source="notional_unit" className={classes.field} />
              <NumberField
                source="execution.approved_unit"
                className={classes.field}
              />
              <Divider />

              <TransField
                style={{ textTransform: "capitalize" }}
                source="execution_type"
                transKey="valueTrans.executionType"
                className={classes.field}
              />

              <NumberField
                source="execution.avg_fill_price"
                className={classes.field}
                options={{ minimumFractionDigits: 2, maximumFractionDigits: 2 }}
              />
              <NumberField
                source="execution.moment_px"
                className={classes.field}
                options={{ minimumFractionDigits: 2, maximumFractionDigits: 2 }}
              />

              <FunctionField
                source="security_adv"
                className={classes.field}
                render={(record) =>
                  `${Math.round(
                    parseFloat(record.security_adv) > 1000000
                      ? parseFloat(record.security_adv) / 1000000
                      : parseFloat(record.security_adv)
                  )}`
                }
              />

              <FunctionField
                label="resources.order.fields.notional_limit"
                className={classes.field}
                render={(record) => {
                  const rawAdv = parseFloat(record.security_adv);
                  const adv = rawAdv > 1000000 ? rawAdv / 1000000 : rawAdv;
                  const factor = record.execution_type === 1 ? 0.02 : 0.1;
                  return `${Math.round(adv * factor)}`;
                }}
              />

              {/*<BooleanField source="confirmed" className={classes.field} />*/}
              <Divider />
              <TextField source="currency" className={classes.field} />
              <TransField
                transKey="valueTrans.orderStatus"
                headerClassName={classes.centerHeader}
                className={classes.field}
                align="center"
                source="status"
                style={{ textTransform: "capitalize" }}
                defaultValue="0"
              />
              <NumberField
                source="execution.cost"
                className={classes.field}
                options={{ maximumFractionDigits: 0 }}
              />

              <NumberField
                source="execution.cost_bps"
                className={classes.field}
                options={{ maximumFractionDigits: 0 }}
              />
              <Divider />
              <DateField source="created" showTime className={classes.field} />

              <DateField
                source="last_modified"
                showTime
                className={classes.field}
              />

              {permissions === "apm" && (
                <DateField
                  source="execution.filled_time"
                  showTime
                  className={classes.field}
                />
              )}

              {permissions === "apm" && (
                <DateField
                  source="execution.created"
                  showTime
                  className={classes.field}
                />
              )}

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
                onFillClick={() => switchFillDrawer(!showFillDrawer)}
                forReason
                // onReasonUpdateClick={() => switchReasonDrawer(!showReasonDrawer)}
              />
              <AudioField source="reason_audio" className={classes.clearBoth} />
              {/*<RichTextField source="reason_txt" />*/}
              <ConditionalRichTextField
                source="reason_txt"
                permissions={permissions}
                className="richText"
                {...props}
              />

              {permissions === "apm" && (
                <RichTextField source="reason" className="richText" />
              )}
              {permissions === "apm" && (
                <RichTextField source="admin_note" className="richText" />
              )}
            </Tab>
            {permissions !== "vpm" && (
              <Tab label="Trade Rules">
                <TradingRules {...props}></TradingRules>
              </Tab>
            )}
          </TabbedShowLayout>
        </Show>
      </>
    );
  }
);
