const enTranslation = {
  login: {
    PageTitle: 'Regional Pandemic Analytics Tool | Login',
    KeycloakSignIn: 'Sign-In with KeyCloak',
    WelcomeMessage: 'Welcome back!',
    WelcomeText:
      'Simply login to access the IGAD regional pandemic analytics tool to collect, analyze, and report granular and aggregated data from multiple sources for informed decision-making.',
  },

  next: 'Next',
  prev: 'Prev',

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
  processChain: 'Process Chain',
  viewAndManageProcessChains: 'View and manage all process chains',
  addProcessChain: 'Add Process Chain',
  ShowDisabledProcessChain: 'Show Disabled Process Chains',
  searchForProcesscChains: 'Search for process chains..',
  searchForPipelines: 'Search for pipelines...',
  unverified: 'Unverified',
  verified: 'Verified',
  pipelineName: 'Pipeline Name*',
  pipelineNameRequired: 'Pipeline name is required',
  pipelineNamePatter: 'Pipeline name cannot contain whitespaces',
  enterPipelineName: 'Enter pipeline name',
  descRequired: 'Pipeline description is required',
  enterDesc: 'Enter pipeline description',
  fileUploadDesc:
    "Drag 'n' drop .hpl pipeline file here, or click to select a file",
  upload: 'Upload',
  selectedFiles: 'Selected Files',

  supersetCharts: 'Superset Charts',
  chartListCreatedOnSuperset: 'Chart list created on Apache Superset.',
  chartTitle: 'Chart Title',
  processChainCharts: 'Process Chain Charts',
  visualizationType: 'Visualization Type',
  dataset: 'Dataset',
  createdBy: 'Created By',
  createdOn: 'Created On',
  modifiedBy: 'Modified By',
  lastModified: 'Last Modified',
  searchForCharts: 'Search for charts...',

  supersetDashboards: 'Superset Dashboards',
  dashboardListCreatedOnSuperset: 'Dashboard list created on Apache Superset',
  title: 'Title',
  created: 'Created',
  modified: 'Modified',
  published: 'Published',
  unpublished: 'Unpublished',
  preview: 'Preview',
  searchForDashboard: 'Search for dashboards...',

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
  selectRole: 'Select a role...',
  phonenumber: 'Phone Number',
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
    scheduleIntervalPlaceholder: 'Choose a schedule interval',
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
    note: 'Note: Start Date is the day when scheduling process chains begin. It is not possible to manually run a process chain that has an upcoming start date.',
    selectDate: 'Select Date',
    descriptionPlaceholder: 'Add description',
  },
  home: {
    favorite_dashboard: 'Favorite Dashboards',
    no_fav_dashboards_msg:
      'No favorite dashboards currently exist. Kindly create a dashboard and add it to your favorites.',
  },

  user: {
    userDetails: 'User Details',
    basicInformation: 'Basic Information',
    firstName: 'First Name',
    lastName: 'Last Name',
    gender: 'Gender',
    country: 'Country',
    contactNumber: 'Contact Number',
    userInformation: 'User Information',
    username: 'Username',
    email: 'Email',
    emailStatus: 'Email Status',
    enable: 'Enable',
    disable: 'Disable',
    userStatus: 'User Status',
    active: 'Active',
    inactive: 'Inactive',
    userRole: 'User Role',
  },

  hop: {
    firstMessage: 'Please make sure you are saving changes in Hop UI',
  },

  footer: {
    learnMore: 'Learn More',
    privacy: 'Privacy',
    termsOfService: 'Terms of Service',
    businessAgreement: 'Business Agreement',
    allRightsReserved: 'All Rights Reserved.',
  },

  processChains: {
    dataSourceSelection: 'Data Source Selection',
    orchestration: 'Orchestration',
    charts: 'Charts',
    analyticsDataModel: 'Analytics Data Model',
  },

  orchestration: {
    processchainSummary: 'Process Chain Summary',
    lastUpdate: 'Last update',
    nextScheduleExection: 'Prochaine exécution programmée',
    lastExecution: 'Last Execution',
    selectExecution: 'Please select an execution',
  },

  dataSourceSelection: {
    pipelineUsed: 'Used Pipeline',
    piplineTemplate: 'Pipeline Template',
    save: 'Save',
  },

  analyticsDataModel: {
    dataSourceInfo: 'Data Source Information',
    name: 'Name',
    createdAt: 'Create at',
    segmentCount: 'Segment Count',
    dimentions: 'Dimentions',
    totalSize: 'Total Size',
  },

  addChart: 'Add a Chart',

  passwordChangeSuccess: 'Your password has been successfully changed.',
  passwordChangeError: 'There was an error changing your password.',
  uploadMessages: {
    selectImage:
      'Please select an image to upload and click the "Upload Picture" button',
    uploadSuccess: 'Profile picture uploaded successfully',
    uploadError: 'An error occurred while uploading the profile picture',
  },
  changePicture: 'Change Picture',
  uploadPicture: 'Upload Picture',
  savePipelineAsTemplate: {
    errorMessage: 'Unable to save pipeline as template',
    successMessage: 'Pipeline saved successfully as template',
    saveButton: 'Save as Template',
  },
};

export default enTranslation;
