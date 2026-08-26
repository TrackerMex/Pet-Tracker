import { ConfigService } from '@nestjs/config';
import { Test } from '@nestjs/testing';
import { AWS_RESOURCE_NAMES } from './aws.constants';
import { AwsModule } from './aws.module';
import {
  AwsResourceNames,
  resolveResourceNamesFromConfigService,
  resolveResourceNamesFromEnv,
} from './resource-names';

const REAL_MEDIA_BUCKET = 'pet-tracker-media-dev-123456789012';

const AWS_RESOURCE_NAMES_WITH_REAL_MEDIA_BUCKET: AwsResourceNames = {
  positionsRaw: 'positions-raw',
  positionsRawDlq: 'positions-raw-dlq',
  notifications: 'notifications',
  notificationsDlq: 'notifications-dlq',
  geofenceEvents: 'geofence-events',
  geofenceEventsDlq: 'geofence-events-dlq',
  geofenceEventsRule: 'geofence-events',
  positionsTable: 'positions',
  mediaBucket: REAL_MEDIA_BUCKET,
  eventBus: 'pet-tracker',
};

function buildConfigService(
  values: Record<string, string | undefined>,
): ConfigService {
  return {
    get: (key: string) => values[key],
  } as ConfigService;
}

describe('R1: modo aws resuelve mediaBucket desde MEDIA_BUCKET_NAME', () => {
  it('resuelve el override recortado desde process.env', () => {
    expect(
      resolveResourceNamesFromEnv({
        AWS_MODE: ' AWS ',
        NODE_ENV: 'test',
        MEDIA_BUCKET_NAME: `  ${REAL_MEDIA_BUCKET}  `,
      }),
    ).toEqual(AWS_RESOURCE_NAMES_WITH_REAL_MEDIA_BUCKET);
  });

  it('resuelve el override recortado desde ConfigService', () => {
    const config = buildConfigService({
      AWS_MODE: 'aws',
      NODE_ENV: 'test',
      MEDIA_BUCKET_NAME: `  ${REAL_MEDIA_BUCKET}  `,
    });

    expect(resolveResourceNamesFromConfigService(config)).toEqual(
      AWS_RESOURCE_NAMES_WITH_REAL_MEDIA_BUCKET,
    );
  });

  it('expone el override mediante el provider AWS_RESOURCE_NAMES', async () => {
    const config = buildConfigService({
      AWS_MODE: 'aws',
      MEDIA_BUCKET_NAME: REAL_MEDIA_BUCKET,
    });
    const moduleRef = await Test.createTestingModule({
      imports: [AwsModule],
    })
      .overrideProvider(ConfigService)
      .useValue(config)
      .compile();

    expect(moduleRef.get<AwsResourceNames>(AWS_RESOURCE_NAMES).mediaBucket).toBe(
      REAL_MEDIA_BUCKET,
    );

    await moduleRef.close();
  });
});
