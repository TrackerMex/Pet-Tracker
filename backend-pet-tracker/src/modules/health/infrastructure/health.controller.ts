import { Controller, Get, ServiceUnavailableException } from '@nestjs/common';
import { CheckHealthUseCase } from '../application/use-cases/check-health.use-case';

@Controller('health')
export class HealthController {
  constructor(private readonly checkHealthUseCase: CheckHealthUseCase) {}

  @Get()
  async check() {
    const result = await this.checkHealthUseCase.execute();

    if (result.postgres === 'error') {
      throw new ServiceUnavailableException(result);
    }

    return result;
  }
}
