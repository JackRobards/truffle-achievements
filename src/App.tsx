import './App.css';
import {
  getSrcByImageObj,
  org as orgClient,
  user as userClient,
} from '@trufflehq/sdk';
import { observer } from '@legendapp/state/react';
import { initThinBackend } from 'thin-backend';
import { ThinBackend } from 'thin-backend-react';
import { fromSpecObservable } from './from-spec-observable';

// here we're creating observables using the legend state library
// https://legendapp.com/open-source/state/
const user = fromSpecObservable(userClient.observable);
const orgUser = fromSpecObservable(userClient.orgUser.observable);
const org = fromSpecObservable(orgClient.observable);

// This needs to be run before any calls to `query`, `createRecord`, etc.
initThinBackend({
  // This url is different for each backend, you can find the backend url in the project documentation
  host: 'https://truffle-achievements.thinbackend.app',
});

function App() {
  return (
    <ThinBackend requireLogin>
      <div className="App h-8 w-8">
        <div>Org: {org.name.get()}</div>
        <div>Org ID: {org.id.get()}</div>
        <h2>Welcome, {orgUser.name.get()}</h2>
        <p>{user.name.get()}</p>
        <img
          src={getSrcByImageObj(user.avatarImage.get(), { size: 'small' })}
        />
      </div>
    </ThinBackend>
  );
}

// we wrap the app component so that it listens to changes on the legend observables
export default observer(App);
