const cmsSearchConfig = () => [
  {
    subUrl: 'contracts',
    serviceName: 'contractService',
    text: 'Found contracts:',
  },

  {
    subUrl: 'users',
    serviceName: 'userService',
    text: 'Found users:',
  },

  {
    subUrl: 'plutustxs',
    serviceName: 'plutusTxService',
    text: 'Found transactions:',
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
