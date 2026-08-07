import {
  BadRequestException,
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  Post,
  Req,
} from '@nestjs/common';
import type { AuthenticatedRequest } from '@/modules/auth/infrastructure/guards/auth.guard';
import { CurrentUser } from '@/modules/auth/infrastructure/decorators/current-user.decorator';
import type { CurrentUserPayload } from '@/modules/auth/infrastructure/decorators/current-user.decorator';
import {
  ListAlertsQueryDto,
  ListAlertsQuerySchema,
} from '@/modules/alerts/application/dto/list-alerts.dto';
import { AckAlertUseCase } from '@/modules/alerts/application/use-cases/ack-alert.use-case';
import { ListAlertsUseCase } from '@/modules/alerts/application/use-cases/list-alerts.use-case';
import { mapAlertError } from './mappers/alert-error.mapper';
import {
  AlertResponse,
  ListAlertsResponse,
  toAlertResponse,
} from './mappers/alert-response.mapper';

/**
 * Centro de alertas (R16-R22). Sin PetAccessGuard a proposito: ese guard lee
 * `request.params.petId`, que en `GET /v1/alerts` no existe y en
 * `POST /v1/alerts/:id/ack` es el id de la **alerta** — devolveria 404 a todo
 * el mundo. La autorizacion vive dentro de la consulta y del caso de uso.
 * Ninguna ruta lleva @Public(): el AuthGuard global de #4 las cubre.
 */
@Controller('alerts')
export class AlertsController {
  constructor(
    private readonly listAlerts: ListAlertsUseCase,
    private readonly ackAlert: AckAlertUseCase,
  ) {}

  @Get()
  async list(
    @CurrentUser() user: CurrentUserPayload,
    @Req() request: AuthenticatedRequest,
  ): Promise<ListAlertsResponse> {
    // R17: la query string se valida entera antes de invocar el caso de uso.
    const query = parseQuery(request.query);

    try {
      const result = await this.listAlerts.execute({
        userId: user.id,
        ...query,
      });

      return {
        items: result.items.map(toAlertResponse),
        nextCursor: result.nextCursor,
      };
    } catch (error) {
      throw mapAlertError(error);
    }
  }

  @Post(':id/ack')
  @HttpCode(HttpStatus.OK)
  async ack(
    @CurrentUser() user: CurrentUserPayload,
    @Param('id') id: string,
  ): Promise<AlertResponse> {
    try {
      return toAlertResponse(await this.ackAlert.execute(id, user.id));
    } catch (error) {
      throw mapAlertError(error);
    }
  }
}

/** Mismo patron que positions.controller.ts: ZodError -> 400 en el borde HTTP. */
function parseQuery(query: unknown): ListAlertsQueryDto {
  const result = ListAlertsQuerySchema.safeParse(query);

  if (!result.success) {
    throw new BadRequestException({
      statusCode: HttpStatus.BAD_REQUEST,
      message: 'Validation failed',
      errors: result.error.issues.map((issue) => ({
        path: issue.path.join('.'),
        message: issue.message,
      })),
    });
  }

  return result.data;
}
