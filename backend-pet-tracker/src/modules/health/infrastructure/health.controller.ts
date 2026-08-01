import { Controller, Get, ServiceUnavailableException } from '@nestjs/common';
import { Public } from '@/modules/auth/infrastructure/decorators/public.decorator';
import { CheckHealthUseCase } from '../application/use-cases/check-health.use-case';

@Controller('health')
export class HealthController {
  constructor(private readonly checkHealthUseCase: CheckHealthUseCase) {}

  @Public()
  @Get()
  async check() {
    const result = await this.checkHealthUseCase.execute();

    if (result.postgres === 'error') {
      throw new ServiceUnavailableException(result);
    }

    return result;
  }
}
