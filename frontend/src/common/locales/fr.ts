const frTranslation = {
  login: {
    PageTitle: "Outil d'analyse des pandémies régionales  | Connexion",
    KeycloakSignIn: 'Connexion avec KeyCloak',
    WelcomeMessage: 'Bienvenue!',
    WelcomeText:
      "Connectez-vous simplement pour accéder à l'outil d'analyse des pandémies régionales de l'IGAD afin de collecter, d'analyser et de rapporter des données granulaires et agrégées de plusieurs sources pour une prise de décision éclairée.",
  },
  supersetcharts: {
    secondago: 'il y a une seconde',
    secondsago: 'il y a quelques secondes',
    minuteago: 'il y a une minute',
    minutesago: 'il y a quelques minutes',
    hourago: 'il y a une heure',
    hoursago: 'il y a quelques heures',
    dayago: 'il y a un jour',
    daysago: 'il y a quelques jours',
    weekago: 'il y a une semaine',
    weeksago: 'il y a quelques semaines',
    monthago: 'il y a un mois',
    monthsago: 'il y a quelques mois',
    yearago: 'il y a un an',
    yearsago: 'il y a quelques années',
  },
  verified: 'Vérifié',
  unverified: 'Non vérifié',
  active: 'Actif',
  disabled: 'Désactivé',
  none: 'Aucun',
  Thisuserwillbedeniedaccess: "Cet utilisateur se verra refuser l'accès",
  Thisuserwillbeenabled: 'Cet utilisateur sera activé',
  confirm: 'Confirmer',
  errorOccurred: "Une erreur s'est produite",
  userDisabledSuccess: "L'utilisateur a été désactivé avec succès",
  userEnabledSuccess: "L'utilisateur a été activé avec succès",

  next: 'Suivant',
  prev: 'Précédent',

  checkStatus: 'Statut du pipeline',
  ValidPipeline: 'Pipeline est valide',

  validate_pipeline: 'Valider le pipeline',
  cancel: 'Annuler',
  continue: 'Continuer',
  appAccounts: "Comptes de l'application",
  viewAndManage:
    "Afficher et gérer les paramètres liés aux utilisateurs de l'application.",
  newUser: 'Nouvel utilisateur',
  fullName: 'Nom complet',
  username: "Nom d'utilisateur",
  email: 'E-mail',
  phone: 'Téléphone',
  gender: 'Genre',
  country: 'Pays',
  emailVerified: 'E-mail vérifié',
  status: 'Statut',
  viewDetails: 'Voir les détails',
  UserDeniedAccessText:
    "Cet utilisateur se verra restreindre l'accès, continuer ?",
  disableUser: "Désactiver l'utilisateur",
  deleteUserConfirmation:
    "Cet utilisateur se verra refuser l'accès, continuer ?",
  UserEnabledText: 'Cet utilisateur sera activé, continuer ?',
  enableUser: "Activer l'utilisateur",
  enableUserConfirmation: 'Cet utilisateur sera activé, continuer ?',
  myPipelines: 'Mes pipelines',
  addPipelineMessage: 'Veuillez saisir un nom de pipeline',
  pipelineSpaceMessage: "Le nom du pipeline ne peut pas contenir d'espaces",
  pipelineDownloadFailed: 'Échec du téléchargement du pipeline',
  enterName: 'Entrer le nom',
  template: 'Modèle',
  descPlaceholder: 'Entrer une description',
  descMessage: 'Veuillez entrer votre description',
  submit: 'Soumettre',
  createYourPipeline: 'Créez votre pipeline hop.',
  name: 'Nom',
  description: 'Description',
  createPipeline: 'Créer un pipeline',
  uploadPipeline: 'Charger un pipeline',
  uploadExternalFiles: 'Charger des fichiers externes',
  pipelineCheckSuccessful: 'Vérification du pipeline réussie',
  pipelineCheckFailed: 'Échec de la vérification du pipeline',
  addPipeline: 'Ajouter un Pipeline',
  MissingParquetTransform: 'Une Transformation Parquet doit figurer',
  InvalidFilenameBase:
    'Sortie Fichier Parquet: Filename base ne peut pas être vide',
  InvalidFilenameExtension:
    "Sortie Fichier Parquet: l'extension doit être specifiée à parquet",
  InvalidFilenameIncludeCopy:
    'Sortie Fichier Parquet: Include transform copy number ne doit pas être cochée',
  InvalidFilenameIncludeDate:
    'Sortie Fichier Parquet: Include date ne doit pas être cochée',
  InvalidFilenameIncludeDatetime:
    'Sortie Fichier Parquet: Include date-time format ne doit pas être cochée',
  InvalidFilenameIncludeSplit:
    'Sortie Fichier Parquet:  Split into parts and include number ne doit pas être cochée',
  InvalidFilenameIncludeTime:
    'Sortie Fichier Parquet: Include time ne doit pas être cochée',
  pipelineInvalidName:
    'Caractères invalides. Le nom du pipeline doit être composé exclusivement de caractères alphanumériques, de tirets, de points et de tirets bas.',
  fileInvalidName:
    'Caractères invalides. Le nom du fichier doit être composé exclusivement de caractères alphanumériques, de tirets, de points et de tirets bas.',
  view: 'Voir',
  delete: 'Supprimer',
  addPipelineNote: 'Remarque : sélectionnez un modèle et appuyez sur Continuer',
  hopTemplate: 'Modèle HOP',
  searchForPipelines: 'Rechercher des pipelines...',
  processChain: 'Chaîne de processus',
  viewAndManageProcessChains:
    'Afficher et gérer toutes les chaînes de processus',
  addProcessChain: 'Ajouter une chaîne de processus',
  ShowDisabledProcessChain: 'Afficher les chaînes de processus inactives',
  searchForProcesscChains: 'Rechercher des chaînes de processus..',
  pipelineName: 'Nom du pipeline *',
  fileName: 'Nom du fichier *',
  pipelineNameRequired: 'Le nom du pipeline est requis',
  fileNameRequired: 'Le nom du fichier est requis',
  pipelineNamePatter: "Le nom du pipeline ne peut pas contenir d'espaces",
  enterPipelineName: 'Saisir le nom du pipeline',
  enterFileName: 'Saisir le nom du fichier',
  descRequired: 'La description est requise',
  enterDesc: 'Saisir la description',
  uploadFile: 'Upload File *',
  fileUploadDesc:
    'Faites glisser et déposez le fichier de pipeline .hpl ici, ou cliquez pour sélectionner un fichier',
  externalFileUploadDesc:
    'Faites glisser et déposez, ou cliquez pour sélectionner un fichier',
  upload: 'Charger',
  selectedFiles: 'Fichier sélectionné',
  searchForTemplate: 'Rechercher un modèle...',
  pipelineCreatedSuccessfully: 'Pipeline créé avec succès',
  fileAddedSuccessfully: 'Fichier ajouté avec succès',
  pipelineUpdateSuccess: 'Pipeline mis à jour avec succès',
  pipelineUpdateError: 'Impossible de mettre à jour le Pipeline',
  pipelineCancelSuccess: 'Mise à jour du Pipeline annulée avec succès',
  pipelineCancelError: "Impossible d'annuler la mise à jour du Pipeline",
  supersetCharts: 'Graphiques Superset',
  chartListCreatedOnSuperset:
    'Liste des graphiques créés avec Apache Superset.',
  chartTitle: 'Titre du Graphique',
  visualizationType: 'Type de Visualisation',
  processChainCharts: 'Les graphiques du chaîne de processus',
  noChartsForDagId: 'Pas de graphiques créés pour cette chaine de processus',
  noChartsAvailable: 'Pas de graphique(s) disponible(s)',
  dataset: 'Ensemble de Données',
  createdBy: 'Créé par',
  createdOn: 'Créé le',
  modifiedBy: 'Modifié par',
  lastModified: 'Dernière Modification',
  searchForCharts: 'Rechercher des graphiques...',
  showing: 'Montrant',
  of: 'de',
  supersetDashboards: 'Tableaux de bord Superset',
  dashboardListCreatedOnSuperset:
    'Liste des tableaux de bord créés sur Apache Superset',
  title: 'Titre',
  created: 'Créé',
  modified: 'Modifié',
  published: 'Publié',
  unpublished: 'Non publié',
  preview: 'Aperçu',
  searchForDashboard: 'Rechercher des tableaux de bord...',
  from: 'de',

  createUser: 'Créer un utilisateur',
  basicInformation: 'Informations de base',
  firstName: 'Prénom',
  givenNamesRequired: 'Les prénoms sont obligatoires',
  lastName: 'Nom de famille',
  lastNameRequired: 'Le nom de famille est obligatoire',
  male: 'Homme',
  female: 'Femme',
  genderSelected: 'Le genre doit être sélectionné',
  selectCountry: 'Sélectionner un pays',
  contactNumber: 'Numéro de contact',
  provideContactNumber: 'Veuillez fournir un numéro de contact',
  userInformation: 'Informations utilisateur',
  username_Required:
    "Le nom d'utilisateur est requis et la longueur minimale est de 4 caractères",
  selectRole: 'Sélectionner un rôle...',
  emailAddress: 'Adresse e-mail',
  phonenumber: 'Numero de téléphone',
  validEmail: 'Une adresse e-mail valide est requise',
  isEmailVerified: "L'e-mail est-il vérifié",
  saveUser: "Enregistrer l'utilisateur",
  userRole: 'Role utilisateur',
  selectUserRole: 'Sélectionner role utilisateur',
  verifyEmails: 'Vérifie Emails',

  editProfile: 'Modifier le profil',
  credentialSettings: "Paramètres d'identification",
  changePassword: 'Changer le mot de passe',
  newPass: 'Nouveau mot de passe',
  confirmPass: 'Confirmer le mot de passe',
  password: 'Mot de passe',
  saveChanges: 'Enregistrer les modifications',
  givenNames: 'Prénom *',
  lastName2: 'Nom de famille *',

  gender2: 'Genre *',
  country2: 'Pays *',
  phoneNumber: 'Numéro de téléphone *',
  accessRoles: "Rôles d'accès",
  emailStatus: "Statut de l'e-mail",
  enable: 'Activer',
  myStatus: 'Mon statut',
  inactive: 'Inactif',
  provideRoleDescrip: 'Veuillez fournir une description du rôle',
  noChangesMade: 'Aucun changement apporté au profil.',
  profileUpdateSuccess: 'Profil mis à jour avec succès.',
  profileUpdateError:
    "Une erreur s'est produite lors de la mise à jour du profil.",
  yourProfile: 'Votre Profil',
  logOut: 'Déconnexion',
  somethingWentWrong: "Quelque chose s'est mal passé !",
  menu: {
    dashboard: 'Tableau de bord',
    home: 'Accueil',
    dashboards: 'Tableaux de bord',
    charts: 'Graphiques',
    manage: 'Gérer',
    processChains: 'Chaînes de processus',
    settings: 'Paramètres',
    accounts: 'Comptes',
    pipelines: 'Mes pipelines',
  },
  addProcess: {
    title: 'Ajouter une chaîne de processus',
    processChainLabel: 'Chaîne de processus',
    pipelineTemplateLabel: 'Modèle de pipeline',
    startDateLabel: 'Date de début',
    scheduleIntervalLabel: 'Intervalle de planification',
    scheduleIntervalPlaceholder: 'Choisir un intervalle de planification',
    descriptionLabel: 'Description',
    submitButton: 'Soumettre',
    cancelButton: 'Annuler',
    successMessage: 'Une nouvelle chaîne de processus a été créée !',
    errorMessage: "Une erreur s'est produite.",
    active: 'active',
    inactive: 'inactive',
    name: 'Nom',
    status: 'Statut',
    run: 'Exécuter',
    enable: 'Activer',
    disable: 'Désactiver',
    invalidProcessName:
      'Le nom de la chaîne de processus doit être composé exclusivement de caractères alphanumériques, de tirets, de points et de tirets bas.',
    note: "Remarque: La date de début est le jour où les chaînes de processus de planification commencent. Il n'est pas possible d'exécuter manuellement une chaîne de processus dont la date de début est proche.",
    selectDate: 'Choisir une date',
    descriptionPlaceholder: 'Ajouter une description',
    failed: 'Échoué',
    success: 'Succès',
    unknown: 'Inconnu',
    running: 'En cours',
    latestDagRunStatus: "Etat d'exécution",
  },
  schedule_intervals: {
    once: '@une fois',
    hourly: '@une fois par heure',
    daily: '@quotidien',
    weekly: '@hebdomadaire',
    monthly: '@mensuel',
    yearly: '@annuel',
  },
  home: {
    favorite_dashboard: 'Tableaux de bord favoris',
    no_fav_dashboards_msg:
      "Aucun tableau de bord favori n'existe actuellement. Veuillez créer un tableau de bord et l'ajouter à vos favoris.",
  },
  passwordChangeSuccess: 'Votre mot de passe a été changé avec succès.',
  passwordChangeError:
    'Une erreur est survenue lors du changement de votre mot de passe.',
  uploadMessages: {
    selectImage:
      'Veuillez sélectionner une image et cliquer sur "Télécharger une photo".',
    uploadSuccess: 'La photo de profil a été actualisée avec succès',
    uploadError:
      "Une erreur s'est produite lors du chargement de l'image de profil",
  },
  changePicture: 'Changer la photo',
  uploadPicture: 'Télécharger une photo',
  savePipelineAsTemplate: {
    errorMessage: 'Impossible de sauvegarder le pipeline en tant que modèle',
    successMessage: 'Pipeline enregistré avec succès en tant que modèle',
    saveButton: 'Enregistrer comme modèle',
  },
  deletePipeline: {
    title: 'Supprimer le pipeline: ',
    confirmDeletionMessage: 'Êtes-vous sûr de vouloir supprimer ce pipeline ?',
    disableProcessErrorMessage:
      'Impossible de désactiver la chaîne du processus: ',
    warningMessage:
      'Attention! Après la suppression du pipeline, les chaînes de processus suivantes seront désactivées :',
    deletionErrorMessage: 'Impossible de supprimer le pipeline',
    successMessage: 'Le pipeline a été supprimé avec succès.',
    deleteButton: 'Supprimer',
    cancelButton: 'Annuler',
    deleteCommand: 'SUPPRIMER',
    active: 'actif',
    inactive: 'inactif',
    processName: 'Nom',
    processScheduleIntervalLabel: 'Intervalle de planification',
    processStatus: 'Statut',
    confirmationMessage:
      'Veuillez taper "SUPPRIMER" pour confirmer la suppression du pipeline:',
    confirmationPlaceholder: 'Tapez...',
  },

  months: {
    0: 'Janvier',
    1: 'Février',
    2: 'Mars',
    3: 'Avril',
    4: 'Mai',
    5: 'Juin',
    6: 'Juillet',
    7: 'Août',
    8: 'Septembre',
    9: 'Octobre',
    10: 'Novembre',
    11: 'Décembre',
  },

  days: {
    0: 'Dimanche',
    1: 'Lundi',
    2: 'Mardi',
    3: 'Mercredi',
    4: 'Jeudi',
    5: 'Vendredi',
    6: 'Samedi',
  },
  user: {
    userDetails: "Détails de l'utilisateur",
    basicInformation: 'Simples informations',
    firstName: 'Prénom',
    lastName: 'Nom',
    gender: 'Genre',
    country: 'Pays',
    contactNumber: 'Numéro de contact',
    userInformation: "Informations de l'utilisateur",
    username: "Nom d'utilisateur",
    email: 'Email',
    emailStatus: "Statut de l'email",
    enable: 'Activé',
    disable: 'Désactivé',
    userStatus: "Statut de l'utilisateur",
    active: 'Actif',
    inactive: 'Inactif',
    userRole: "Rôle de l'utilisateur",
  },

  hop: {
    firstMessage:
      "Veuillez vous assurer que vous enregistrez les modifications dans l'interface de Hop",
  },

  processChains: {
    dataSourceSelection: 'Sélection de la source de données',
    orchestration: 'Orchestration',
    charts: 'Graphiques',
    analyticsDataModel: "Modèle d'analyse des données",
  },

  dataSourceSelection: {
    pipelineUsed: 'Pipeline utilisé',
    piplineTemplate: 'Modèle de pipeline',
    save: 'Enregistrer',
  },

  orchestration: {
    processchainSummary: 'Résumé de la chaîne de processus',
    lastUpdate: 'Dernière mise à jour',
    nextScheduleExection: 'Prochaine exécution programmée',
    lastExecution: 'Dernière exécution',
    selectExecution: 'Veuillez sélectionner une exécution',
  },

  analyticsDataModel: {
    dataSourceInfo: 'Informations sur la source de données',
    name: 'Nom',
    createdAt: 'Créé à',
    segmentCount: 'Nombre de segments',
    dimensions: 'Dimensions',
    totalSize: 'Taille totale',
    nodimensionsavailable: 'Aucune dimension disponible',
  },

  addChart: 'Ajouter un graphique',

  footer: {
    learnMore: 'Savoir plus',
    privacy: 'Confidentialité',
    termsOfService: "Conditions d'utilisation",
    businessAgreement: 'Accords de business',
    allRightsReserved: 'Tous droits réservés.',
  },
  download: 'Télécharger',
  createDashboardBtn: 'Créer un nouveau tableau de bord',
  createChartBtn: 'Créer un nouveau graphique',
  processChainDialog: {
    processChainText: 'Chaîne de Processus : ',
    orchestration: 'Orchestration',
    details: 'Détails',
    relatedCharts: 'Graphiques Associés',
    lastExec: 'Dernières Exécutions',
    dataModelInfo: 'Informations sur le Modèle de Données',
    chartTitle: 'Titre du Graphique',
    visualType: 'Type de Visualisation',
    dataset: 'Ensemble de Données',
    createdBy: 'Créé Par',
    modifiedBy: 'Modifié Par',
    lastModified: 'Dernière Modification',
    addChart: 'Ajouter un Graphique',
    ProcessChainName: 'Nom de la Chaîne de Processus',
    dataPip: 'Pipeline de Données',
    period: 'Périodicité',
    processStatus: 'Statut du Processus',
    execState: 'État d’Exécution',
    actions: 'Actions',
    activeStatus: 'Actif',
    inactiveStatus: 'Désactivé',
    success: 'Succès',
    failed: 'Échec',
    modelName: 'Nom',
    modelCreatedAt: 'Créé le',
    modelSegmentCount: 'Nombre de segments',
    modelDimensions: 'Dimensions',
    modelTotalSize: 'Taille totale',
    modelDescription: 'Description',
    modelLastUpdate: 'Dernière mise à jour',
    modelStatus: 'Statut',
    modelLastDagRun: 'Dernière exécution de DAG',
  },
};

export default frTranslation;
