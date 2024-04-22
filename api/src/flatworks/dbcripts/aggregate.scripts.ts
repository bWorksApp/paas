const plutusDashboardScript = (fromDate: Date, toDate: Date) => {
  const script = [
    {
      $match: {
        $and: [
          { lockDate: { $gte: fromDate } },
          { lockDate: { $lte: toDate } },
        ],
      },
    },
    {
      $project: {
        _id: 1,
        lockDate: 1,
        unlockDate: 1,
        amount: 1,
        isUnlocked: {
          $cond: {
            if: {
              $and: [
                '$unlockedTxHash',
                { $ne: ['$unlockedTxHash', ''] },
                { $ne: ['$unlockedTxHash', null] },
                { $ne: ['$unlockedTxHash', undefined] },
              ],
            },
            then: true,
            else: false,
          },
        },
      },
    },

    {
      $group: {
        _id: {
          $concat: [
            { $toString: { $month: '$lockDate' } },
            '-',
            { $toString: { $year: '$lockDate' } },
          ],
        },
        date: { $first: '$lockDate' },
        sumLockedAmounts: { $sum: '$amount' },
        numberOfLockTxs: { $sum: 1 },
        sumUnlockedAmounts: {
          $sum: {
            $cond: {
              if: '$isUnlocked',
              then: '$amount',
              else: 0,
            },
          },
        },
        numberOfUnlockedTxs: {
          $sum: {
            $cond: {
              if: '$isUnlocked',
              then: 1,
              else: 0,
            },
          },
        },
      },
    },
  ];
  return script;
};

const plutusScript = (queryType, userId) => {
  const match =
    queryType === 'emp'
      ? { empId: userId }
      : queryType === 'jsk'
      ? { jskId: userId }
      : {};
  const script = [
    {
      $match: match,
    },
    {
      $project: {
        _id: 1,
        lockDate: 1,
        unlockDate: 1,
        amount: 1,
        isUnlocked: {
          $cond: {
            if: {
              $and: [
                '$unlockedTxHash',
                { $ne: ['$unlockedTxHash', ''] },
                { $ne: ['$unlockedTxHash', null] },
                { $ne: ['$unlockedTxHash', undefined] },
              ],
            },
            then: true,
            else: false,
          },
        },
      },
    },

    {
      $group: {
        _id: {
          $concat: [
            { $toString: { $month: '$lockDate' } },
            '-',
            { $toString: { $year: '$lockDate' } },
          ],
        },
        date: { $first: '$lockDate' },
        sumLockedAmounts: { $sum: '$amount' },
        numberOfLockTxs: { $sum: 1 },
        sumUnlockedAmounts: {
          $sum: {
            $cond: {
              if: '$isUnlocked',
              then: '$amount',
              else: 0,
            },
          },
        },
        numberOfUnlockedTxs: {
          $sum: {
            $cond: {
              if: '$isUnlocked',
              then: 1,
              else: 0,
            },
          },
        },
      },
    },
    {
      $group: {
        _id: 'plutusReports',
        sumLockedAmounts: { $sum: '$sumLockedAmounts' },
        numberOfLockTxs: { $sum: '$numberOfLockTxs' },
        sumUnlockedAmounts: { $sum: '$sumUnlockedAmounts' },
        numberOfUnlockedTxs: { $sum: '$numberOfUnlockedTxs' },
      },
    },
  ];
  return script;
};

const plutusMonthlyScript = (queryType, userId, fromDate, toDate) => {
  const match =
    queryType === 'emp'
      ? {
          empId: userId,
          $and: [
            { lockDate: { $gte: fromDate } },
            { lockDate: { $lte: toDate } },
          ],
        }
      : queryType === 'jsk'
      ? {
          jskId: userId,
          $and: [
            { lockDate: { $gte: fromDate } },
            { lockDate: { $lte: toDate } },
          ],
        }
      : {
          $and: [
            { lockDate: { $gte: fromDate } },
            { lockDate: { $lte: toDate } },
          ],
        };

  const script = [
    {
      $match: match,
    },
    {
      $project: {
        _id: 1,
        lockDate: 1,
        unlockDate: 1,
        amount: 1,
        isUnlocked: {
          $cond: {
            if: {
              $and: [
                '$unlockedTxHash',
                { $ne: ['$unlockedTxHash', ''] },
                { $ne: ['$unlockedTxHash', null] },
                { $ne: ['$unlockedTxHash', undefined] },
              ],
            },
            then: true,
            else: false,
          },
        },
      },
    },

    {
      $group: {
        _id: {
          $concat: [
            { $toString: { $month: '$lockDate' } },
            '-',
            { $toString: { $year: '$lockDate' } },
          ],
        },
        date: { $first: '$lockDate' },
        sumLockedAmounts: { $sum: '$amount' },
        numberOfLockTxs: { $sum: 1 },
        sumUnlockedAmounts: {
          $sum: {
            $cond: {
              if: '$isUnlocked',
              then: '$amount',
              else: 0,
            },
          },
        },
        numberOfUnlockedTxs: {
          $sum: {
            $cond: {
              if: '$isUnlocked',
              then: 1,
              else: 0,
            },
          },
        },
      },
    },
  ];
  return script;
};

/*
db.users.aggregate(sumUsers) output:
{
    "_id": "sumUsers",
    "walletUsers": 3,
    "emailUsers": 2,
    "sContractDevUsers": 3,
    "dAppDevUsers": 3,
    "hasPublishedContractUsers": 1,
    "hasSubmittedDappUsers": 1
}
*/
const sumUsers = [
  {
    $project: {
      idAsString: { $toString: '$_id' },
      _id: 1,
      authType: 1,
      isdAppDev: 1,
      isSmartContractDev: 1,
    },
  },
  {
    $lookup: {
      from: 'contracts',
      localField: 'idAsString',
      foreignField: 'author',
      as: 'publishedContracts',
    },
  },
  {
    $unwind: { path: '$publishedContracts', preserveNullAndEmptyArrays: true },
  },
  {
    $lookup: {
      from: 'plutustxes',
      localField: 'idAsString',
      foreignField: 'lockUserId',
      as: 'dAppTxs',
    },
  },
  {
    $unwind: { path: '$dAppTxs', preserveNullAndEmptyArrays: true },
  },
  {
    $group: {
      _id: '$_id',
      authType: { $first: '$authType' },
      isdAppDev: { $first: '$isdAppDev' },
      isSmartContractDev: { $first: '$isSmartContractDev' },
      publishedContracts: {
        $sum: {
          $cond: [{ $eq: [{ $type: '$publishedContracts' }, 'missing'] }, 0, 1],
        },
      },
      dAppTxs: {
        $sum: {
          $cond: [{ $eq: [{ $type: '$dAppTxs' }, 'missing'] }, 0, 1],
        },
      },
    },
  },

  {
    $group: {
      _id: 'sumUsers',
      walletUsers: {
        $sum: { $cond: [{ $eq: ['$authType', 'wallet'] }, 1, 0] },
      },

      emailUsers: {
        $sum: { $cond: [{ $eq: ['$authType', 'email'] }, 1, 0] },
      },
      sContractDevUsers: {
        $sum: { $cond: [{ $eq: ['$isSmartContractDev', true] }, 1, 0] },
      },
      dAppDevUsers: {
        $sum: { $cond: [{ $eq: ['$isdAppDev', true] }, 1, 0] },
      },

      hasPublishedContractUsers: {
        $sum: { $cond: [{ $gt: ['$publishedContracts', 0] }, 1, 0] },
      },
      hasSubmittedDappUsers: {
        $sum: { $cond: [{ $gt: ['$dAppTxs', 0] }, 1, 0] },
      },
    },
  },
];

/*
db.contracts.aggregate(sumContracts) output:
{
  "_id": "sumContracts",
  "plutusContracts": 2,
  "aikenContracts": 4,
  "marloweContracts": 2,
  "isSourceCodeVerified": 12,
  "isFunctionVerified": 12,
  "isApproved": 12,
  "hasSubmittedDappUsers": 1
}
*/
const sumContracts = [
  {
    $project: {
      idAsString: { $toString: '$_id' },
      _id: 1,
      contractType: 1,
      isSourceCodeVerified: 1,
      isFunctionVerified: 1,
      isApproved: 1,
    },
  },
  {
    $lookup: {
      from: 'plutustxes',
      localField: 'idAsString',
      foreignField: 'smartContractId',
      as: 'dAppTxs',
    },
  },
  {
    $unwind: { path: '$dAppTxs', preserveNullAndEmptyArrays: true },
  },
  {
    $group: {
      _id: '$_id',

      contractType: { $first: '$contractType' },
      isApproved: { $first: '$isApproved' },

      isSourceCodeVerified: { $first: '$isSourceCodeVerified' },
      isFunctionVerified: { $first: '$isFunctionVerified' },

      dAppTxs: {
        $sum: {
          $cond: [{ $eq: [{ $type: '$dAppTxs' }, 'missing'] }, 0, 1],
        },
      },
    },
  },

  {
    $group: {
      _id: 'sumContracts',
      plutusContracts: {
        $sum: { $cond: [{ $eq: ['$contractType', 'plutus'] }, 1, 0] },
      },
      aikenContracts: {
        $sum: { $cond: [{ $eq: ['$contractType', 'aiken'] }, 1, 0] },
      },

      marloweContracts: {
        $sum: { $cond: [{ $eq: ['$contractType', 'marlowe'] }, 1, 0] },
      },

      isSourceCodeVerified: {
        $sum: { $cond: [{ $eq: ['$isSourceCodeVerified', true] }, 1, 0] },
      },
      isFunctionVerified: {
        $sum: { $cond: [{ $eq: ['$isFunctionVerified', true] }, 1, 0] },
      },
      isApproved: {
        $sum: { $cond: [{ $eq: ['$isApproved', true] }, 1, 0] },
      },
      hasSubmittedDappUsers: {
        $sum: { $cond: [{ $gt: ['$dAppTxs', 0] }, 1, 0] },
      },
    },
  },
];

export {
  plutusDashboardScript,
  plutusScript,
  plutusMonthlyScript,
  sumUsers,
  sumContracts,
};
