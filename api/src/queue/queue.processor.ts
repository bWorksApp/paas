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
import {
  fileToJson,
  aikenSourceCodeValidate,
  plutusSourceCodeValidate,
  marloweSourceCodeValidate,
} from '../flatworks/utils/common';
import { ContractType } from '../flatworks/types/types';
import * as lodash from 'lodash';
import { TestService } from '../test/service';

@Processor('queue')
export class QueueProcessor {
  private readonly logger = new Logger(QueueProcessor.name);
  constructor(
    private readonly plutusTxService: PlutusTxService,
    private readonly contractService: ContractService,
    private readonly testService: TestService,
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
  sample contract source code gitRepo object: 
  {name: "plutus",
  contractType: "plutus",
   gitRepo: {
      gitRepo: 'https://github.com/IntersectMBO/plutus-apps',
     sourceCodeFolder: 'plutus-example',
     buildCommand: 'cabal run plutus-example',
     outputJsonFile: 'generated-plutus-scripts/v1/always-succeeds-spending.plutus'
  }

  {name: "aiken",
  contractType: "aiken",
   gitRepo: {
        gitRepo: 'https://github.com/aiken-lang/aiken',
        sourceCodeFolder: 'examples/hello_world',
        buildCommand: 'aiken build',
        outputJsonFile: 'plutus.json',
      };

  {name: "marlowe",
  contractType: "marlowe",
   gitRepo: {
        gitRepo: 'https://github.com/jackchuong/test-smart-contract',
        sourceCodeFolder: 'contract.marlowe',
        buildCommand: '',
        outputJsonFile: '',
      };
}
  */

  @Process('compileContract')
  compileContract(job: Job) {
    const folder = process.env.SHELL_SCRIPTS_PATH;
    const buildFolder = uuidv4();

    if (!job.data.gitRepo || !job.data.gitRepo.gitRepo) {
      console.log('Invalid source code repo');
      return;
    }

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
      //just to test
      /*   job.data.gitRepo = {
        gitRepo: 'https://github.com/IntersectMBO/plutus-apps',
        sourceCodeFolder: 'plutus-example',
        buildCommand: 'cabal run plutus-example',
        outputJsonFile:
          'generated-plutus-scripts/v1/always-succeeds-spending.plutus',
      }; */
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
              const isSourceCodeVerified = plutusSourceCodeValidate(
                compiledContract,
                job.data.contract,
              );

              this.contractService.findByIdAndUpdate(job.data._id, {
                isCompiled: true,
                compiledContract: compiledContract,
                isSourceCodeVerified,
                completedAt: new Date(),
              });
            }
          }
        },
      );
    }

    if (job.data.contractType === ContractType.Aiken) {
      //just to test
      /*  job.data.gitRepo = {
        gitRepo: 'https://github.com/aiken-lang/aiken',
        sourceCodeFolder: 'examples/hello_world',
        buildCommand: 'aiken build',
        outputJsonFile: 'plutus.json',
      }; */

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
              const isSourceCodeVerified = aikenSourceCodeValidate(
                job.data.contract,
                compiledContract,
              );
              this.contractService.findByIdAndUpdate(job.data._id, {
                isCompiled: true,
                compiledContract: compiledContract,
                isSourceCodeVerified,
                completedAt: new Date(),
              });
            }
          }
        },
      );
    }
    if (job.data.contractType === ContractType.Marlowe) {
      //just to test
      /*    job.data.gitRepo = {
        gitRepo: 'https://github.com/jackchuong/test-smart-contract',
        sourceCodeFolder: 'contract.marlowe',
        buildCommand: '',
        outputJsonFile: '',
      }; */
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
              const isSourceCodeVerified = marloweSourceCodeValidate(
                compiledContract,
                job.data.contract,
              );
              this.contractService.findByIdAndUpdate(job.data._id, {
                isCompiled: true,
                compiledContract: compiledContract,
                isSourceCodeVerified,
                completedAt: new Date(),
              });
            }
          }
        },
      );
    }
  }
}
