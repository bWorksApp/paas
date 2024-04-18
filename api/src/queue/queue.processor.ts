import {
  Process,
  Processor,
  OnQueueActive,
  OnQueueCompleted,
} from '@nestjs/bull';
import { Logger } from '@nestjs/common';
import { Job } from 'bull';
import { exec } from 'child_process';
import { PlutusTxService } from '../plutustx/service';
import { v4 as uuidv4 } from 'uuid';
import { ContractService } from '../contract/service';
import { fileToJson } from '../flatworks/utils/common';
import { ContractType } from '../flatworks/types/types';

@Processor('queue')
export class QueueProcessor {
  private readonly logger = new Logger(QueueProcessor.name);
  constructor(
    private readonly plutusTxService: PlutusTxService,
    private readonly contractService: ContractService,
  ) {}

  @OnQueueActive()
  onActive(job: Job) {
    console.log(
      `Processing job ${job.id} of type ${job.name} with data ${JSON.stringify(
        job.data,
      )}...`,
    );
  }

  @OnQueueCompleted()
  onComplete(job: Job) {
    console.log(
      `Completed job ${job.id} of type ${job.name} with data ${job.data}...`,
    );
  }

  @Process('execShell')
  execShell(job: Job) {
    const arg = '-1';
    exec(`ls ${arg}`, (err, stdout, stderr) => {
      if (err) {
        console.error(err, job);
      } else {
        console.log(`job: ${job}`);
        console.log(`stdout: ${stdout}`);
        console.log(`stderr: ${stderr}`);
      }
    });
  }

  /*
  sample contract plutus source code repo object: 
  {name: "always success",
   gitRepo: {
      gitRepo: 'https://github.com/IntersectMBO/plutus-apps',
     sourceCodeFolder: 'plutus-example',
     buildCommand: 'cabal run plutus-example',
     outputJsonFile: 'generated-plutus-scripts/v1/always-succeeds-spending.plutus'
  }
  ...
}
  */

  @Process('compileContract')
  compileContract(job: Job) {
    const folder = process.env.SHELL_SCRIPTS_PATH;
    const buildFolder = uuidv4();

    /*  if (!job.data.gitRepo || !job.data.gitRepo.gitRepo) {
      console.log('Invalid source code repo');
      return;

     

    } */
    if (
      job.data.contractType !== ContractType.Aiken &&
      job.data.contractType !== ContractType.Marlowe &&
      job.data.contractType !== ContractType.Plutus
    ) {
      console.log('Invalid contract type, must be aiken, plutus, marlowe');
      console.log(job.data.contractType);
      return;
    }

    if (job.data.contractType === ContractType.Plutus) {
      /*  const gitRepo = 'https://github.com/IntersectMBO/plutus-apps';
    const sourceCodeFolder = 'plutus-example';
    //pass string with space as single argument to shell script '"string with space"'
    const buildCommand = '"cabal run plutus-example"';
    const outputJsonFile =
      'generated-plutus-scripts/v1/always-succeeds-spending.plutus'; */

      //just to test
      job.data.gitRepo = {
        gitRepo: 'https://github.com/IntersectMBO/plutus-apps',
        sourceCodeFolder: 'plutus-example',
        buildCommand: 'cabal run plutus-example',
        outputJsonFile:
          'generated-plutus-scripts/v1/always-succeeds-spending.plutus',
      };
      const gitRepo = job.data.gitRepo.gitRepo;
      const sourceCodeFolder = job.data.gitRepo.sourceCodeFolder;
      //pass string with space as single argument to shell script '"string with space"'
      const buildCommand = "'" + job.data.gitRepo.buildCommand + "'";
      const outputJsonFile = job.data.gitRepo.outputJsonFile;
      exec(
        `zsh ${folder}/compilePlutus.sh ${gitRepo} ${buildFolder} ${sourceCodeFolder} ${buildCommand} ${outputJsonFile}`,
        (err, stdout, stderr) => {
          //if job fail
          if (err) {
            console.error('shell script error:', err, job);
          }
          //if shell script failed
          if (stderr) {
            console.log(`compile failed with stderr: ${stderr}`);
          } else {
            //if compiled succeed insert compiled object to contract
            console.log(`compiled succeed with stdout: ${stdout}`);
            const compiledContract = fileToJson(
              `/tmp/${buildFolder}/repo/${sourceCodeFolder}/${outputJsonFile}`,
            );
            if (compiledContract) {
              this.contractService.findByIdAndUpdate(job.data._id, {
                compiledContract: compiledContract,
                completedAt: new Date(),
              });
            }
          }
        },
      );
    }

    if (job.data.contractType === ContractType.Aiken) {
      //just to test
      job.data.gitRepo = {
        gitRepo: 'https://github.com/aiken-lang/aiken',
        sourceCodeFolder: 'examples/hello_world',
        buildCommand: 'aiken build',
        outputJsonFile: 'plutus.json',
      };
      const gitRepo = job.data.gitRepo.gitRepo;
      const sourceCodeFolder = job.data.gitRepo.sourceCodeFolder;
      //pass string with space as single argument to shell script '"string with space"'
      const buildCommand =
        "'" + job.data.gitRepo.buildCommand + "'" || '"aiken build"';
      const outputJsonFile = job.data.gitRepo.outputJsonFile || 'plutus.json';

      exec(
        `zsh ${folder}/compileAiken.sh ${gitRepo} ${sourceCodeFolder} ${buildFolder} ${buildCommand}`,
        (err, stdout, stderr) => {
          //if job fail
          if (err) {
            console.error('shell script error:', err, job);
          }
          //if shell script failed
          if (stderr) {
            console.log(`compile failed with stderr: ${stderr}`);
          } else {
            //if compiled succeed insert compiled object to contract
            console.log(`compiled succeed with stdout: ${stdout}`);
            const compiledContract = fileToJson(
              `/tmp/${buildFolder}/repo/${sourceCodeFolder}/${outputJsonFile}`,
            );
            if (compiledContract) {
              this.contractService.findByIdAndUpdate(job.data._id, {
                compiledContract: compiledContract,
                completedAt: new Date(),
              });
            }
          }
        },
      );
    }
    if (job.data.contractType === ContractType.Marlowe) {
      //just to test
      job.data.gitRepo = {
        gitRepo: 'https://github.com/jackchuong/test-smart-contract',
        sourceCodeFolder: 'contract.marlowe',
        buildCommand: '',
        outputJsonFile: '',
      };
      const gitRepo = job.data.gitRepo.gitRepo;
      const sourceCodeFolder = job.data.gitRepo.sourceCodeFolder || '.';

      exec(
        `zsh ${folder}/compileMarlowe.sh ${gitRepo} ${sourceCodeFolder} ${buildFolder}`,
        (err, stdout, stderr) => {
          //if job fail
          if (err) {
            console.error('shell script error:', err, job);
          }
          //if shell script failed
          if (stderr) {
            console.log(`compile failed with stderr: ${stderr}`);
          } else {
            //if compiled succeed insert compiled object to contract
            console.log(`compiled succeed with stdout: ${stdout}`);
            const compiledContract = fileToJson(
              `/tmp/${buildFolder}/repo/contract.json`,
            );
            if (compiledContract) {
              this.contractService.findByIdAndUpdate(job.data._id, {
                compiledContract: compiledContract,
                completedAt: new Date(),
              });
            }
          }
        },
      );
    }
  }

  @Process('unlock')
  async unlock(job: Job) {
    const scriptName = 'bworksV2';
    const redeemerJsonFile = 'secret.json';
    const payCollatelWalletName = 'wallet01';
    //if job is complete pay to job seeker else return to employer
    const unlockType = job.data.unlockType; // 'paid' : 'return';
    const receiveWalletAddress = job.data.receiverAddress;
    const userId = job.data.userId;
    const scriptTxHash = job.data.scriptTxHash;
    const unlockScript = process.env.UNLOCK_SHELL_SCRIPT;
    exec(
      `zsh ./src/flatworks/shellscripts/${unlockScript} ${scriptName} ${redeemerJsonFile} ${payCollatelWalletName} ${receiveWalletAddress} ${scriptTxHash} `,
      (err, stdout, stderr) => {
        //if shell script exec fail
        if (err) {
          this.plutusTxService.findByScriptTxHashAndUpdate(scriptTxHash, {
            unlockMessage: 'unlock plutus job failed',
            completedAt: new Date(),
          });
          console.error('error:', err, job);
        }
        //if transaction sign failed
        if (stderr) {
          this.plutusTxService.findByScriptTxHashAndUpdate(scriptTxHash, {
            unlockMessage: 'unlock plutus transaction sign failed',
            completedAt: new Date(),
          });
          console.log(`stderr: ${stderr}`);
        } else {
          //remove null line then get transaction hash at last line of stdout
          const matches = stdout.split(/[\n\r]/g);
          const unlockedTxHash = matches
            .filter((item) => item !== '')
            .slice(-1)[0];

          this.plutusTxService.findByScriptTxHashAndUpdate(scriptTxHash, {
            receiverAddress: receiveWalletAddress,
            unlockUserId: userId,
            unlockedTxHash: unlockedTxHash,
            unlockType: unlockType,
            isUnlocked: true,
            unlockMessage: 'unlock plutus transaction is submitted',
            unlockDate: new Date(),
            completedAt: new Date(),
          });

          console.log(`stdout: ${stdout}`);
        }
      },
    );
  }
}
