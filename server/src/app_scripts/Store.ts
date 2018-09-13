import emailactions from './hooks/emailactions';
import projecttaskdetails from './hooks/projecttaskdetails';
import projectbfadetails from './hooks/projectbfadetails';
import projectcnndetails from './hooks/projectcnndetails';
import projectrfidetails from './hooks/projectrfidetails';
import projectcontractdrawings from './hooks/projectcontractdrawings';
import projects from './hooks/projects';
import miscinclusions from './hooks/miscinclusions';
import miscexclusions from './hooks/miscexclusions';
import maininclusions from './hooks/maininclusions';
import mainexclusions from './hooks/mainexclusions';
import exclusionsinclusions from './hooks/exclusionsinclusions';
import countries from './hooks/countries';
import userfunctions from './hooks/userfunctions';
import users from './hooks/users';
import userroles from './hooks/userroles';
import sales from './hooks/sales';
import roles from './hooks/roles';
import rolecategory from './hooks/rolecategory';
import functions from './hooks/functions';
import estimations from './hooks/estimations';
import clients from './hooks/clients';
export const Store: any = {
  clients,
  estimations,
  functions,
  rolecategory,
  roles,
  sales,
  userroles,
  users,
  userfunctions,
  countries,
  exclusionsinclusions,
  mainexclusions,
  maininclusions,
  miscexclusions,
  miscinclusions,
  projects,
  projectcontractdrawings,
  projectrfidetails,
  projectcnndetails,
  projectbfadetails,
  projecttaskdetails,
  emailactions
};
