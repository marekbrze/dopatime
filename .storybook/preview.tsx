import type { Preview } from '@storybook/react-vite'
import '../src/index.css'

const preview: Preview = {
  // Dark is the designed-first theme (docs/DESIGN.md).
  decorators: [
    (Story) => {
      document.documentElement.classList.add('dark')
      return Story()
    },
  ],
  parameters: {
    controls: {
      matchers: {
       color: /(background|color)$/i,
       date: /Date$/i,
      },
    },
    a11y: {
      test: 'todo'
    }
  },
};

export default preview;
