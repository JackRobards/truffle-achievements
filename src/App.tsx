import './App.css';
import { useState } from 'react';
import { observer } from '@legendapp/state/react';
import { initThinBackend, logout } from 'thin-backend';
import { ThinBackend } from 'thin-backend-react';
import truffleLogo from './assets/truffle.svg';
import { AllAchievementsList } from './components/AllAchievementsList';
import CompletedUserAchievementList from './components/CompletedUserAchievementList';
import Draggable from './components/Draggable';
import Subheader from './components/Subheader';

// This needs to be run before any calls to `query`, `createRecord`, etc.
initThinBackend({
  // This url is different for each backend, you can find the backend url in the project documentation
  host: 'https://truffle-achievements.thinbackend.app',
});

const draggableProps = {
  dimensions: {
    // A bit of extra padding on the base x/y (corresponds to width/height of open menu)
    // Helps prevent clip-path edge stuttering when dragging it while the menu is open (when dragging it quickly)
    // This creates a small piece of space directly below and to the right of the open menu where you can't interact with the underlying web-page
    base: { x: 730, y: 530 },
    modifiers: { top: 0, right: 0, bottom: 0, left: 0, transition: 'none' },
  },
  defaultPosition: { x: 100, y: 100 },
};

const menuClosedSize = { width: 32, height: 32 };
const menuOpenSize = { width: 700, height: 500 };

function App() {
  // This is initialized to true for now so that the thin-backend login page renders inside of the menu
  const [isMenuOpen, setIsMenuOpen] = useState(true);

  return (
    <Draggable
      dimensions={{
        ...draggableProps.dimensions,
        size: isMenuOpen ? menuOpenSize : menuClosedSize,
      }}
      defaultPosition={draggableProps.defaultPosition}
      ignoreClassName="no-drag"
    >
      <div className="App">
        <div
          className={`box-content p-1 transition-height duration-500 ease-in-out
              ${
                isMenuOpen
                  ? 'h-[500px] w-[700px] rounded border-2 border-gray-600 bg-gray-500 shadow-md'
                  : 'h-8 w-8'
              }
                `}
        >
          <ThinBackend requireLogin>
            <div className="flex flex-col text-left ">
              <div className="flex w-full justify-between">
                <img
                  src={truffleLogo}
                  className=" h-8 w-8 transition duration-100 ease-in-out hover:scale-110"
                  alt="Truffle logo"
                  onClick={() => setIsMenuOpen((isOpen) => !isOpen)}
                />
                {isMenuOpen ? (
                  <>
                    <p className=" self-center text-2xl">
                      Truffle Achievements
                    </p>
                    <button
                      type="button"
                      onClick={() => {
                        void logout();
                      }}
                      className="rounded-lg border border-gray-200 bg-white py-2.5 px-5 text-sm font-medium text-gray-900 hover:bg-gray-100 hover:text-blue-700 focus:z-10 focus:outline-none focus:ring-4 focus:ring-gray-200"
                    >
                      Logout
                    </button>
                  </>
                ) : null}
              </div>
              {isMenuOpen ? (
                <>
                  <Subheader />
                  <div className="overflow-y-auto">
                    <h2 className="mt-3 text-3xl font-extrabold">
                      Your Achievements
                    </h2>
                    <CompletedUserAchievementList />

                    <h2 className="mt-3 text-3xl font-extrabold">
                      All Achievements
                    </h2>
                    <AllAchievementsList />
                  </div>
                </>
              ) : null}
            </div>
          </ThinBackend>
        </div>
      </div>
    </Draggable>
  );
}

// we wrap the app component so that it listens to changes on the legend observables
export default observer(App);
