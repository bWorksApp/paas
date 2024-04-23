const cmsSearchConfig = () => [
  {
    subUrl: 'contracts',
    serviceName: 'postJobService',
    text: 'Found posted jobs',
  },

  {
    subUrl: 'users',
    serviceName: 'userService',
    text: 'Found users',
  },

  {
    subUrl: 'plutustxs',
    serviceName: 'plutusTxService',
    text: 'Found plutus payment transactions',
  },
];

const appSearchConfig = () => {
  return [
    {
      subUrl: 'contracts',
      serviceName: 'contractService',
      text: 'Found contracts',
    },

    {
      subUrl: 'users',
      serviceName: 'userService',
      text: 'Found users',
    },

    {
      subUrl: 'plutustxs',
      serviceName: 'plutusTxService',
      text: 'Found transactions',
    },
  ];
};

export { cmsSearchConfig, appSearchConfig };
