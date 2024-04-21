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
sum users statistics
{
  "_id": "sumUsers",
  "walletUsers": 3,
  "emailUsers": 2,
  "sContractDevs": 3,
  "dAppDevs": 3
}
*/
const sumUsers = [
  {
    $group: {
      _id: '',
      walletUsers: {
        $sum: { $cond: [{ $eq: ['$authType', 'wallet'] }, 1, 0] },
      },

      emailUsers: {
        $sum: { $cond: [{ $eq: ['$authType', 'email'] }, 1, 0] },
      },
      sContractDevs: {
        $sum: { $cond: [{ $eq: ['$isSmartContractDev', true] }, 1, 0] },
      },
      dAppDevs: {
        $sum: { $cond: [{ $eq: ['$isdAppDev', true] }, 1, 0] },
      },
    },
  },
];

export { plutusDashboardScript, plutusScript, plutusMonthlyScript, sumUsers };
