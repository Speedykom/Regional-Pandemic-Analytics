const enTranslation = {
  appAccounts: 'App Accounts',
  viewAndManage: 'View and manage settings related to app users.',
  newUser: 'New User',
  fullName: 'Full Name',
  username: 'Username',
  email: 'Email',
  phone: 'Phone',
  gender: 'Gender',
  country: 'Country',
  emailVerified: 'Email Verified',
  status: 'Status',
  viewDetails: 'View Details',
  disableUser: 'Disable User',
  deleteUserConfirmation: 'This user will be denied access, continue?',
  myPipelines: 'My Pipelines',
  createYourPipeline: 'Create your hop pipeline.',
  name: 'Name',
  description: 'Description',
  createPipeline: 'Create Pipeline',
  uploadPipeline: 'Upload Pipeline',
  pipelineCheckSuccessful: 'Pipeline check successful',
  pipelineCheckFailed: 'Pipeline check failed',

  // Pipeline validation check
  MissingParquetTransform: 'One Parquet transform should be available',
  InvalidFilenameBase:
    'Filename base should be set to ftp://${minio_ftp}/parquets/${user_id}/${dag_id}',
  InvalidFilenameExtension: 'Filename extension should be set to parquet',
  InvalidFilenameIncludeCopy: 'Filename include copy should be set to N',
  InvalidFilenameIncludeDate: 'Filename include date should be set to N',
  InvalidFilenameIncludeDatetime:
    'Filename include datetime should be set to N',
  InvalidFilenameIncludeSplit: 'Filename include split should be set to N',
  InvalidFilenameIncludeTime: 'Filename include time should be set to N',
  ValidPipeline: 'Pipeline is valid',
  view: 'View',
  delete: 'Delete',
  processChain: 'Process Chain',
  viewAndManageProcessChains: 'View and manage all process chains',
  addProcessChain: 'Add Process Chain',
  ShowDisabledProcessChain: 'Show Disabled Process Chains',

  supersetCharts: 'Superset Charts',
  chartListCreatedOnSuperset: 'Chart list created on Apache Superset.',
  chartTitle: 'Chart Title',
  visualizationType: 'Visualization Type',
  dataset: 'Dataset',
  createdBy: 'Created By',
  createdOn: 'Created On',
  modifiedBy: 'Modified By',
  lastModified: 'Last Modified',

  supersetDashboards: 'Superset Dashboards',
  dashboardListCreatedOnSuperset: 'Dashboard list created on Apache Superset',
  title: 'Title',
  created: 'Created',
  modified: 'Modified',
  published: 'Published',
  unpublished: 'Unpublished',
  preview: 'Preview',

  from: 'from',

  createUser: 'Create User',
  basicInformation: 'Basic Information',
  firstName: 'First Name',
  givenNamesRequired: 'Given names required',
  lastName: 'Last Name',
  lastNameRequired: 'Last name is required',
  male: 'Male',
  female: 'Female',
  genderSelected: 'Gender has to be selected',
  selectCountry: 'Select country...',
  contactNumber: 'Contact Number',
  provideContactNumber: 'Provide contact number please',
  userInformation: 'User Information',
  username_Required: 'Username is required, min length 4 chars',
  emailAddress: 'Email Address',
  validEmail: 'Valid email is required',
  isEmailVerified: 'Is Email Verified',
  enableUser: 'Enable User',
  saveUser: 'Save User',
  userRole: 'User role',
  selectUserRole: 'Select user role',
  verifyEmails: 'Verufy Emails',

  editProfile: 'Edit Profile',
  credentialSettings: 'Credential Settings',
  changePassword: 'Change Password',
  newPass: 'New Password',
  confirmPass: 'Confirm Password',
  saveChanges: 'Save Changes',
  cancel: 'Cancel',
  country2: 'Country *',
  lastName2: 'Last name *',
  gender2: 'Gender *',
  givenNames: 'Given Names *',
  phoneNumber: 'Phone Number*',
  accessRoles: 'Access Roles',
  emailStatus: 'Email Status',
  enable: 'Enable',
  disabled: 'Disabled',
  myStatus: 'My Status',
  active: 'Active',
  inactive: 'Inactive',

  provideRoleDescrip: 'provide role description',
  noChangesMade: 'No changes made to the profile.',
  profileUpdateSuccess: 'Profile updated successfully',
  profileUpdateError: 'An error occurred while updating the profile',
  yourProfile: 'Your Profile',
  logOut: 'Log Out',
  somethingWentWrong: 'Something went wrong!',
  menu: {
    dashboard: 'Dashboard',
    home: 'Home',
    dashboards: 'Dashboards',
    charts: 'Charts',
    manage: 'Manage',
    processChains: 'Process Chains',
    settings: 'Settings',
    accounts: 'Accounts',
    pipelines: 'My pipelines',
  },
  addProcess: {
    title: 'Add Process Chain',
    processChainLabel: 'Process Chain',
    pipelineTemplateLabel: 'Pipeline Template',
    startDateLabel: 'Start Date',
    scheduleIntervalLabel: 'Schedule Interval',
    descriptionLabel: 'Description',
    submitButton: 'Submit',
    cancelButton: 'Cancel',
    successMessage: 'A new Process Chain is created!',
    errorMessage: 'An error has occurred.',
    active: 'active',
    inactive: 'inactive',
    name: 'Name',
    status: 'Status',
    run: 'run',
    enable: 'enable',
    disable: 'disable',
  },
  passwordChangeSuccess: 'Your password has been successfully changed.',
  passwordChangeError: 'There was an error changing your password.',
  savePipelineAsTemplate: {
    errorMessage: 'Unable to save pipeline as template',
    successMessage: 'Pipeline saved successfully as template',
    saveButton: 'Save as Template',
  },
  deletePipeline: {
    title: 'Delete Pipeline: ',
    confirmDeletionMessage: 'Are you sure you want to delete this pipeline?',
    disableProcessErrorMessage: 'Unable to disable Process Chain: ',
    warningMessage:
      'Warning! After deleting the pipeline, the following process chains will be disabled:',
    deletionErrorMessage: 'Unable to delete pipeline',
    successMessage: 'Pipeline deleted successfully',
    deleteButton: 'Delete',
    cancelButton: 'Cancel',
    deleteCommand: 'DELETE',
    active: 'active',
    inactive: 'inactive',
    processName: 'Name',
    processScheduleIntervalLabel: 'Schedule Interval',
    processStatus: 'Status',
    confirmationMessage: 'Type "DELETE" to confirm the pipeline deletion:',
    confirmationPlaceholder: 'Type...',
  },
};

export default enTranslation;
