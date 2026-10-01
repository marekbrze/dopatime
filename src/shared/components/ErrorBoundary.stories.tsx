import type { Meta, StoryObj } from '@storybook/react';
import { ErrorFallback } from './ErrorBoundary';

const meta: Meta<typeof ErrorFallback> = {
  title: 'Shared/ErrorFallback',
  component: ErrorFallback,
  args: { onReload: () => undefined, onReset: () => undefined },
};
export default meta;

export const Default: StoryObj<typeof ErrorFallback> = {};
