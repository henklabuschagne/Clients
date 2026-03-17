import * as auth from './auth';
import * as clients from './clients';
import * as vpns from './vpns';
import * as connections from './connections';
import * as servers from './servers';
import * as contacts from './contacts';
import * as licenses from './licenses';
import * as statistics from './statistics';
import * as tickets from './tickets';
import * as updates from './updates';
import * as customizations from './customizations';
import * as notes from './notes';
import * as responsiblePersons from './responsiblePersons';
import * as preferences from './preferences';

export const api = {
  auth,
  clients,
  vpns,
  connections,
  servers,
  contacts,
  licenses,
  statistics,
  tickets,
  updates,
  customizations,
  notes,
  responsiblePersons,
  preferences,
};

export type { ApiResult, ApiError, PaginatedResult } from './types';
