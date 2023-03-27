import {
  Grid,
  InputAdornment,
  Typography,
  withStyles,
} from "@material-ui/core";
import BigNumber from "bignumber.js";
import React from "react";
import {
  BooleanInput,
  Button,
  CardActions,
  DisabledInput,
  Edit,
  FormDataConsumer,
  ListButton,
  LongTextInput,
  maxLength,
  maxValue,
  minLength,
  // tslint:disable-next-line: ordered-imports
  // Validators
  minValue,
  number,
  NumberInput,
  ReferenceInput,
  regex,
  required,
  SelectInput,
  SimpleForm,
  TextInput,
} from "react-admin";
const CreateActions = ({ fromPos, basePath, data, resource, history }) => (
  <Grid container alignItems="center" justify="space-between">
    <CreateTitle />
    <CardActions>
      {fromPos ? (
        <Button label="Back" onClick={() => history.goBack()}></Button>
      ) : (
        <ListButton basePath={basePath} />
      )}
    </CardActions>
  </Grid>
);
const CreateTitle = () => (
  <Typography component="h2">Edit order reason</Typography>
);
const styles = {
  field: {
    display: "inline-block",
    minWidth: "31%",
    paddingLeft: "4px",
    paddingRight: "4px",
    whiteSpace: "nowrap",
  },
} as any;
export const OrderEdit = withStyles(styles)((props) => {
  const { classes } = props;
  return (
    <Edit {...props}>
      <SimpleForm>
        <ReferenceInput
          label="Security"
          source="security"
          reference="securities"
          validate={[required()]}
          formClassName={classes.field}
        >
          <DisabledInput label="Security" source="security" />
        </ReferenceInput>
        <ReferenceInput
          source="portfolio"
          reference="portfolio"
          options={{
            disabled: true,
          }}
          formClassName={classes.field}
          validate={[required()]}
        >
          <DisabledInput label="Portfolio" source="portfolio" />
          {/* <SelectInput optionText="name" /> */}
        </ReferenceInput>
        <BooleanInput
          source="is_buy"
          options={{
            disabled: true,
          }}
          formClassName={classes.field}
          validate={[required()]}
        />
        <NumberInput
          source="notional_unit"
          options={{
            disabled: true,
          }}
          format={(v) =>
            v ? new BigNumber(v).div(Math.pow(10, 6)).toNumber() : v
          }
          InputProps={{
            endAdornment: (
              <span style={{ lineHeight: "32px" }}>Million(s)</span>
            ),
          }}
          parse={(v) => new BigNumber(v).times(Math.pow(10, 6)).toNumber()}
          formClassName={classes.field}
          validate={[required(), minValue(1)]}
        />
        <LongTextInput source="reason_txt" options={{ autoFocus: true }} />
      </SimpleForm>
    </Edit>
  );
});
