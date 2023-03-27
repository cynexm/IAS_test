import { Divider, Grid, Typography } from "@material-ui/core";
import { withStyles } from "@material-ui/core/styles";

import BigNumber from "bignumber.js";
import React from "react";
import {
  Button,
  CardActions,
  choices,
  Create,
  ListButton,
  LongTextInput,
  // tslint:disable-next-line: ordered-imports
  // Validators
  minValue,
  NumberInput,
  required,
  SelectInput,
  SimpleForm,
  TextInput,
  translate,
} from "react-admin";
import { ManagerSelector } from "../common/ManagerSelector";

const CreateActions = translate(
  ({ fromPos, basePath, data, resource, history, translate }: any) => (
    <Grid container alignItems="center" justify="space-between">
      <Typography component="h2">
        {translate("common.create") + translate("common.portfolio")}
      </Typography>
      <CardActions>
        {fromPos ? (
          <Button label="Back" onClick={() => history.goBack()}></Button>
        ) : (
          <ListButton basePath={basePath} />
        )}
      </CardActions>
    </Grid>
  )
);

const useStyles = {
  field: {
    display: "inline-block",
    minWidth: "31%",
    whiteSpace: "nowrap",
  },
} as any;

const FORM_NAME = "portfolio-create";

export const PortfolioCreate = withStyles(useStyles)(
  ({ classes, ...props }: any) => {
    // const [security, setSecurity] = useState<Security | undefined>(undefined);
    return (
      <Create
        // defaultTitle={<CreateTitle />}
        actions={<CreateActions {...props} />}
        {...props}
      >
        <SimpleForm form={FORM_NAME} defaultValue={{ book_size: 200000000 }}>
          <TextInput
            source="name"
            label="resources.portfolio.fields.name"
            formClassName={classes.field}
          />
          <NumberInput
            source="book_size"
            disabled={
              props.location.state && props.location.state.notional_unit
            }
            format={(v) =>
              v ? new BigNumber(v).div(Math.pow(10, 6)).toNumber() : v
            }
            parse={(v) => new BigNumber(v).times(Math.pow(10, 6)).toNumber()}
            InputProps={{
              endAdornment: (
                <span style={{ lineHeight: "32px" }}>Million(s)</span>
              ),
            }}
            formClassName={classes.field}
            validate={[required(), minValue(1)]}
          />
          <ManagerSelector
            label="resources.portfolio.fields.managers"
            formClassName={classes.field}
          />
          <LongTextInput source="description" />
        </SimpleForm>
      </Create>
    );
  }
);
