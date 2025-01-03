const enTranslation = {
  login: {
    PageTitle: 'Regional Pandemic Analytics Tool | Login',
    KeycloakSignIn: 'Sign-In with KeyCloak',
    WelcomeMessage: 'Welcome back!',
    WelcomeText:
      'Simply login to access the IGAD regional pandemic analytics tool to collect, analyze, and report granular and aggregated data from multiple sources for informed decision-making.',
  },
  supersetcharts: {
    secondago: '1 second ago',
    secondsago: 'seconds ago',
    minuteago: '1 minute ago',
    minutesago: 'minutes ago',
    hourago: '1 hour ago',
    hoursago: 'hours ago',
    dayago: '1 day ago',
    daysago: 'days ago',
    weekago: '1 week ago',
    weeksago: 'weeks ago',
    monthago: '1 month ago',
    monthsago: 'months ago',
    yearago: '1 year ago',
    yearsago: 'years ago',
  },
  verified: 'Verified',
  unverified: 'Unverified',
  active: 'Active',
  disabled: 'Disabled',
  none: 'None',
  Thisuserwillbedeniedaccess: 'This user will be denied access',
  Thisuserwillbeenabled: 'This user will be enabled',
  confirm: 'Confirm',
  errorOccurred: 'An error occurred',
  userDisabledSuccess: 'User has been successfully disabled',
  userEnabledSuccess: 'User has been successfully enabled',

  checkStatus: 'Check Status',
  next: 'Next',
  prev: 'Prev',
  save: 'Save',
  cancel: 'Cancel',
  continue: 'Continue',
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
  UserDeniedAccessText: 'This user will be denied access, continue?',
  disableUser: 'Disable User',
  deleteUserConfirmation: 'This user will be denied access, continue?',
  UserEnabledText: 'This user will be enabled, continue?',
  enableUser: 'Enable User',
  enableUserConfirmation: 'This user will be enabled, continue?',
  myPipelines: 'My Pipelines',
  createYourPipeline: 'Create your hop pipeline.',
  name: 'Name',
  description: 'Description',
  createPipeline: 'Create Pipeline',
  uploadPipeline: 'Upload Pipeline',
  uploadExternalFiles: 'Upload External Files',
  pipelineCheckSuccessful: 'Pipeline check successful',
  pipelineCheckFailed: 'Pipeline check failed',
  addPipelineNote: 'Note: select a template and press continue',
  hopTemplate: 'HOP Template',
  addPipeline: 'Add Pipeline',
  addPipelineMessage: 'Please enter a pipeline name',
  pipelineSpaceMessage: 'Pipeline name cannot contain whitespaces',
  pipelineDownloadFailed: 'Failed to download the pipeline',
  enterName: 'Enter Name',
  template: 'Template',
  descPlaceholder: 'Enter Description',
  descMessage: 'Please enter your description',
  submit: 'Submit',
  validate_pipeline: 'Validate Pipeline',
  showing: 'Showing',
  of: 'of',
  // Pipeline validation check
  pipelineUpdateSuccess: 'Pipeline updated successfully',
  pipelineUpdateError: 'Unable to update pipeline',
  pipelineCancelSuccess: 'Pipeline update canceled successfully',
  pipelineCancelError: 'Unable to cancel pipeline update',
  MissingParquetTransform: 'One Parquet transform should be available',
  InvalidFilenameBase: 'Parquet File Output: Filename base cannot be empty',
  InvalidFilenameExtension:
    'Parquet File Output: Extension should be set to parquet',
  InvalidFilenameIncludeCopy:
    'Parquet File Output: Include transform copy number should not be checked',
  InvalidFilenameIncludeDate:
    'Parquet File Output: Include date should not be checked',
  InvalidFilenameIncludeDatetime:
    'Parquet File Output: Include date-time format should not be checked',
  InvalidFilenameIncludeSplit:
    'Parquet File Output:  Split into parts and include number should not be checked',
  InvalidFilenameIncludeTime:
    'Parquet File Output: Include time should not be checked',
  ValidPipeline: 'Pipeline is valid',
  pipelineInvalidName:
    'Invalid characters. Pipeline Name must consist exclusively of alphanumeric characters, dashes, dots and underscores.',
  fileInvalidName:
    'Invalid characters. File Name must consist exclusively of alphanumeric characters, dashes, dots and underscores.',
  view: 'View',
  delete: 'Delete',
  processChain: 'Process Chain',
  viewAndManageProcessChains: 'View and manage all process chains',
  addProcessChain: 'Add Process Chain',
  ShowDisabledProcessChain: 'Show Disabled Process Chains',
  searchForProcesscChains: 'Search for process chains..',
  searchForPipelines: 'Search for pipelines...',
  searchForTemplate: 'Search for template...',
  pipelineCreatedSuccessfully: 'Pipeline created successfully',
  fileUploadedSuccessfully: 'File added successfully',
  pipelineName: 'Pipeline Name *',
  fileName: 'File Name *',
  pipelineNameRequired: 'Pipeline name is required',
  fileNameRequired: 'File name is required',
  pipelineNamePatter: 'Pipeline name cannot contain whitespaces',
  enterPipelineName: 'Enter pipeline name',
  enterFileName: 'Enter file name',
  descRequired: 'Pipeline description is required',
  enterDesc: 'Enter pipeline description',
  uploadFile: 'Upload File *',
  fileUploadDesc:
    "Drag 'n' drop .hpl pipeline file here, or click to select a file",
  externalFileUploadDesc: "Drag 'n' drop or click to select a file",
  upload: 'Upload',
  selectedFiles: 'Selected File',

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
  saveUser: 'Save User',
  userRole: 'User role',
  selectUserRole: 'Select user role',
  verifyEmails: 'Verify Emails',

  editProfile: 'Edit Profile',
  credentialSettings: 'Credential Settings',
  changePassword: 'Change Password',
  newPass: 'New Password',
  confirmPass: 'Confirm Password',
  password: 'Password',
  saveChanges: 'Save Changes',
  country2: 'Country *',
  lastName2: 'Last name *',
  gender2: 'Gender *',
  givenNames: 'Given Names *',
  phoneNumber: 'Phone Number *',
  accessRoles: 'Access Roles',
  emailStatus: 'Email Status',
  enable: 'Enable',
  myStatus: 'My Status',
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
    invalidProcessName:
      'Pocess Chain Name must consist exclusively of alphanumeric characters, dashes, dots and underscores.',
    note: 'Note: Start Date is the day when scheduling process chains begin. It is not possible to manually run a process chain that has an upcoming start date.',
    selectDate: 'Select Date',
    descriptionPlaceholder: 'Add description',
    failed: 'Failed',
    success: 'Success',
    unknown: 'Unknown',
    running: 'running',
    latestDagRunStatus: 'Execution State',
  },
  schedule_intervals: {
    once: '@once',
    hourly: '@hourly',
    daily: '@daily',
    weekly: '@weekly',
    monthly: '@monthly',
    yearly: '@yearly',
  },
  home: {
    favorite_dashboard: 'Favorite Dashboards',
    no_fav_dashboards_msg:
      'No favorite dashboards currently exist. Kindly create a dashboard and add it to your favorites.',
  },

  months: {
    0: 'January',
    1: 'February',
    2: 'March',
    3: 'April',
    4: 'May',
    5: 'June',
    6: 'July',
    7: 'August',
    8: 'September',
    9: 'October',
    10: 'November',
    11: 'December',
  },
  days: {
    0: 'Sunday',
    1: 'Monday',
    2: 'Tuesday',
    3: 'Wednesday',
    4: 'Thursday',
    5: 'Friday',
    6: 'Saturday',
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
    nextScheduleExection: 'Next scheduled execution',
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
    createdAt: 'Created at',
    segmentCount: 'Segment Count',
    dimensions: 'Dimensions',
    totalSize: 'Total Size',
    nodimensionsavailable: 'No dimensions available',
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
  download: 'Download',
  createDashboardBtn: 'Create New Dashboard',
  createChartBtn: 'Create New Chart',
};

export default enTranslation;
