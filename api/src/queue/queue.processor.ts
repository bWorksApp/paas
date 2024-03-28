import {
  Process,
  Processor,
  OnQueueActive,
  OnQueueCompleted,
} from '@nestjs/bull';
import { Logger } from '@nestjs/common';
import { Job } from 'bull';
import { exec } from 'child_process';
import { AccountLanguagesForUser } from '../flatworks/utils/github';
import { ScamFilter } from '../flatworks/utils/filter.scammer';
import { PlutusTxService } from '../plutustx/service';

@Processor('queue')
export class QueueProcessor {
  private readonly logger = new Logger(QueueProcessor.name);
  constructor(private readonly plutusTxService: PlutusTxService) {}

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

  @Process('scamFilter')
  scamFilter(job: Job) {
    ScamFilter(job.data.userId);
  }

  @Process('analyzeGit')
  analyzeGit(job: Job) {
    AccountLanguagesForUser(job.data.key, job.data.userId);
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

  @Process('compileMarlowe')
  compileMarlowe(job: Job) {
    const arg = `Compiling marlowe smart contractId ${job.data.contractId} ...`;
    exec(`echo ${arg}`, (err, stdout, stderr) => {
      if (err) {
        console.error(err, job);
      } else {
        console.log(`job: ${job.data.contractId}`);
        console.log(`stdout: ${stdout}`);
      }
    });
  }

  @Process('compileAiken')
  compileAiken(job: Job) {
    const arg = `Compiling Aiken smart contractId ${job.data.contractId} ...`;
    exec(`echo ${arg}`, (err, stdout, stderr) => {
      if (err) {
        console.error(err, job);
      } else {
        console.log(`stdout: ${stdout}`);
        console.log(`stderr: ${stderr}`);
      }
    });
  }

  @Process('compilePlutus')
  compilePlutus(job: Job) {
    const arg = `Compiling plutus smart contractId ${job.data.contractId} ...`;
    exec(`echo ${arg}`, (err, stdout, stderr) => {
      if (err) {
        console.error(err, job);
      } else {
        console.log(`stdout: ${stdout}`);
        console.log(`stderr: ${stderr}`);
      }
    });
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
