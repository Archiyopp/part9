import React from 'react';
import axios from 'axios';
import {
  BrowserRouter as Router,
  Route,
  Link,
  Switch,
} from 'react-router-dom';
import {
  Button,
  Divider,
  Header,
  Container,
} from 'semantic-ui-react';

import { apiBaseUrl } from './constants';
import {
  useStateValue,
  setPatientList,
  setDiagnosisList,
} from './state';
import { Patient } from './types';

import PatientListPage from './PatientListPage';
import SinglePatient from './SinglePatientPage';
import { getAllDiagnosis } from './services/diagnosisServices';

const App = () => {
  const [, dispatch] = useStateValue();
  React.useEffect(() => {
    void axios.get<void>(`${apiBaseUrl}/ping`);

    const fetchPatientList = async () => {
      try {
        const { data: patientListFromApi } = await axios.get<
          Patient[]
        >(`${apiBaseUrl}/patients`);
        dispatch(setPatientList(patientListFromApi));
      } catch (e) {
        console.error(e);
      }
    };
    const fetchDiagnosisList = async () => {
      try {
        const diagnosisList = await getAllDiagnosis();
        dispatch(setDiagnosisList(diagnosisList));
      } catch (e) {
        if (e instanceof Error) {
          console.error(e.message);
        } else {
          console.log('Unknown catch', e);
        }
      }
    };
    void fetchPatientList();
    void fetchDiagnosisList();
  }, [dispatch]);

  return (
    <div className="App">
      <Router>
        <Container>
          <Header as="h1">Patientor</Header>
          <Button as={Link} to="/" primary>
            Home
          </Button>
          <Divider hidden />
          <Switch>
            <Route path="/" exact>
              <PatientListPage />
            </Route>
            <Route path="/patients/:id">
              <SinglePatient />
            </Route>
          </Switch>
        </Container>
      </Router>
    </div>
  );
};

export default App;
