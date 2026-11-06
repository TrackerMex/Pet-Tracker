import { App } from 'aws-cdk-lib';
import { join } from 'path';
import { PetTrackerProdStack } from '../lib/pet-tracker-prod-stack';

const FIXTURE_IMAGE_DIRECTORY = join(__dirname, 'fixtures', 'backend-image');
const PROPS = {
  apiDomain: 'api.example.com',
  hostedZoneId: 'Z0EXAMPLE123',
  hostedZoneName: 'example.com',
  alarmEmail: 'alerts@example.com',
  resendFrom: 'no-reply@example.com',
  resetLinkHost: 'app.example.com',
  imageDirectory: FIXTURE_IMAGE_DIRECTORY,
};

function buildStack(region: string, apiDomain: string = PROPS.apiDomain): PetTrackerProdStack {
  return new PetTrackerProdStack(new App(), `PetTrackerProd-${region}`, { env: { region }, ...PROPS, apiDomain });
}

describe('#246 R3: apiDomain tiene que estar dentro de la zona', () => {
  it('#246 R3: lanza fuera de la zona y no lanza dentro', () => {
    expect(() => buildStack('mx-central-1', 'api.other.com')).toThrow(
      new Error('apiDomain "api.other.com" is not inside hosted zone "example.com"'),
    );
    expect(() => buildStack('mx-central-1', 'apiexample.com')).toThrow(
      new Error('apiDomain "apiexample.com" is not inside hosted zone "example.com"'),
    );
    expect(() => buildStack('mx-central-1', 'example.com')).not.toThrow();
    expect(() => buildStack('mx-central-1', 'api.example.com')).not.toThrow();
  }, 60_000);
});
