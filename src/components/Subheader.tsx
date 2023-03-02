import { org as orgClient, user as userClient } from '@trufflehq/sdk';
import { useCurrentUser } from 'thin-backend-react';
import { fromSpecObservable } from '../from-spec-observable';

const truffleUser = fromSpecObservable(userClient.observable);
const org = fromSpecObservable(orgClient.observable);

export function Subheader() {
  const user = useCurrentUser();

  return (
    <div className="flex whitespace-normal text-xs text-gray-100">
      <div>Truffle Org: {org.name.get()},</div>
      <p className="ml-1">Truffle User: {truffleUser.name.get()}</p>
      <p className="ml-auto">Logged in as: {user?.email}</p>
    </div>
  );
}

export default Subheader;
