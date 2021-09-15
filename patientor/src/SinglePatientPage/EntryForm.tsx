import { Field, Form, Formik } from 'formik';
import {
  DiagnosisSelection,
  NumberField,
  TextField,
} from '../AddPatientModal/FormField';
import { Entry } from '../types';
import { useStateValue } from '../state/state';
import {
  Button,
  Grid,
  Icon,
  Label,
  Form as SemanticForm,
} from 'semantic-ui-react';
import React, { useState } from 'react';

type DistributiveOmit<T, K extends keyof T> = T extends T
  ? Omit<T, K>
  : never;

export type EntryFormValues = DistributiveOmit<Entry, 'id'>;

interface Props {
  onSubmit: (values: EntryFormValues) => void;
  onCancel: () => void;
}

type typeOptionsType = {
  value: 'Hospital' | 'HealthCheck' | 'OccupationalHealthcare';
  label: 'Hospital' | 'HealthCheck' | 'OccupationalHealthcare';
};

const typeOptions: typeOptionsType[] = [
  { value: 'Hospital', label: 'Hospital' },
  { value: 'HealthCheck', label: 'HealthCheck' },
  {
    value: 'OccupationalHealthcare',
    label: 'OccupationalHealthcare',
  },
];

const baseValues = {
  date: '',
  specialist: '',
  description: '',
  diagnosisCodes: [],
};

const EntryForm = ({ onSubmit, onCancel }: Props) => {
  const [formType, setFormType] = useState<
    'Hospital' | 'HealthCheck' | 'OccupationalHealthcare'
  >('Hospital');
  const [{ diagnosis }] = useStateValue();

  const specialFormFields =
    formType === 'HealthCheck' ? (
      <Field
        label="healthCheckRating"
        name="healthCheckRating"
        component={NumberField}
        min={0}
        max={3}
      />
    ) : formType === 'Hospital' ? (
      <fieldset>
        <Label
          size="large"
          color="grey"
          style={{ margin: '10px 0px' }}
        >
          Discharge <Icon name="hospital outline" />
        </Label>
        <Field
          label="Date"
          placeholder="YYYY-MM-DD"
          component={TextField}
          name="discharge.date"
        />
        <Field
          label="Criteria"
          placeholder="Criteria"
          component={TextField}
          name="discharge.criteria"
        />
      </fieldset>
    ) : (
      <fieldset>
        <Label
          size="large"
          color="grey"
          style={{ margin: '10px 0px' }}
        >
          Occupational Healthcare <Icon name="briefcase" />
        </Label>
        <Field
          label="Employer Name"
          placeholder="Employer Name"
          component={TextField}
          name="employerName"
        />
        <Label style={{ fontSize: '15px', margin: '5px 0px' }}>
          Sick Leave
        </Label>
        <Field
          label="Start Date"
          placeholder="YYYY-MM-DD"
          component={TextField}
          name="sickLeave.startDate"
        />
        <Field
          label="End Date"
          placeholder="YYYY-MM-DD"
          component={TextField}
          name="sickLeave.endDate"
        />
      </fieldset>
    );
  let initialValues: EntryFormValues;

  if (formType === 'HealthCheck') {
    initialValues = {
      ...baseValues,
      type: 'HealthCheck',
      healthCheckRating: 0,
    };
  } else if (formType === 'Hospital') {
    initialValues = {
      ...baseValues,
      type: 'Hospital',
      discharge: { date: '', criteria: '' },
    };
  } else {
    initialValues = {
      ...baseValues,
      type: 'OccupationalHealthcare',
      employerName: '',
      sickLeave: { startDate: '', endDate: '' },
    };
  }
  const typeField = ({
    label,
    field,
  }: {
    label: string;
    field: any;
  }) => (
    <SemanticForm.Field>
      <label>{label}</label>
      <Field {...field} as="select" className="ui dropdown">
        {typeOptions.map((option) => (
          <option
            key={option.value}
            value={option.value}
            onClick={() => {
              setFormType(option.value);
            }}
          >
            {option.label || option.value}
          </option>
        ))}
      </Field>
    </SemanticForm.Field>
  );
  return (
    <Formik
      initialValues={initialValues}
      onSubmit={onSubmit}
      validate={(values) => {
        const requiredError = 'Field is required';
        const errors: {
          [field: string]: string;
        } = {};
        if (!values.date) {
          errors.date = requiredError;
        }
        if (!values.specialist) {
          errors.specialist = requiredError;
        }
        if (!values.description) {
          errors.description = requiredError;
        }
        if (values.type === 'HealthCheck') {
          if (
            !values.healthCheckRating &&
            values.healthCheckRating !== 0
          ) {
            errors.healthCheckRating = requiredError;
          }
          if (
            values?.healthCheckRating > 3 ||
            values?.healthCheckRating < 0
          ) {
            errors.healthCheckRating =
              'Health Rating needs to be between 0 and 3';
          }
        }
        if (values.type === 'Hospital') {
          if (!values?.discharge.date) {
            errors.discharge = requiredError;
          }
          if (!values?.discharge.criteria) {
            errors.discharge = requiredError;
          }
        }
        if (values.type === 'OccupationalHealthcare') {
          if (!values.employerName) {
            errors.employerName = requiredError;
          }
        }
        return errors;
      }}
    >
      {({ isValid, dirty, setFieldValue, setFieldTouched }) => {
        return (
          <Form className="form ui">
            <Field name="type" component={typeField} label="Type" />
            <Field
              label="Date"
              placeholder="YYYY-MM-DD"
              name="date"
              component={TextField}
            />
            <Field
              label="Specialist"
              placeholder="Specialist"
              name="specialist"
              component={TextField}
            />
            <Field
              label="Description"
              placeholder="Description"
              name="description"
              component={TextField}
            />
            <DiagnosisSelection
              setFieldValue={setFieldValue}
              setFieldTouched={setFieldTouched}
              diagnoses={Object.values(diagnosis)}
            />
            {specialFormFields}
            <Grid>
              <Grid.Column floated="left" width={5}>
                <Button type="button" onClick={onCancel} color="red">
                  Cancel
                </Button>
              </Grid.Column>
              <Grid.Column floated="right" width={5}>
                <Button
                  type="submit"
                  floated="right"
                  color="green"
                  disabled={!dirty || !isValid}
                >
                  Add
                </Button>
              </Grid.Column>
            </Grid>
          </Form>
        );
      }}
    </Formik>
  );
};

export default EntryForm;
