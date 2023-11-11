// https://storybook.js.org/docs/react/writing-stories/parameters#global-parameters
import { RouterContext } from 'next/dist/shared/lib/router-context' // next 12

import App from '../src/App'
import '../src/styles/index.scss'

export const parameters = {
  // https://storybook.js.org/docs/react/essentials/actions#automatically-matching-args
  actions: { argTypesRegex: '^on.*' },
  nextRouter: {
    Provider: RouterContext.Provider,
  },
  layout: 'fullscreen',
}

const preview = {
  decorators: [
    Story => (
      <App>
        <div className='h-screen p-4 component-wrapper bg-base-300'>
          <Story />
        </div>
      </App>
    ),
  ],
}

export default preview
