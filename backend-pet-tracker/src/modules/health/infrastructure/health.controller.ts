import { Controller, Get, ServiceUnavailableException } from '@nestjs/common';
import { CheckHealthUseCase } from '../application/use-cases/check-health.use-case';

// GET /v1/health (el prefijo /v1 lo agrega app.setGlobalPrefix en main.ts,
// sirve a R9). Público: esta feature no registra ningún guard global
// todavía (@Public()/AuthGuard llegan con auth-login-me, id 4), así que el
// endpoint queda accesible sin Authorization simplemente porque nada lo
// bloquea.
@Controller('health')
export class HealthController {
  constructor(private readonly checkHealthUseCase: CheckHealthUseCase) {}

  @Get()
  async check() {
    const result = await this.checkHealthUseCase.execute();

    if (result.postgres === 'error') {
      // Nunca se deja escapar la excepción cruda del driver/pg (R8) — el
      // use case ya la absorbió y devolvió un resultado de dominio; acá
      // solo se mapea a HTTP.
      throw new ServiceUnavailableException(result);
    }

    return result;
  }
}
