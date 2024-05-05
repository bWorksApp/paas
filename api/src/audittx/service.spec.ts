import { Test, TestingModule } from '@nestjs/testing';
import { AuditTxService } from './service';

describe('AuditTxService', () => {
  let service: AuditTxService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [AuditTxService],
    }).compile();

    service = module.get<AuditTxService>(AuditTxService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
