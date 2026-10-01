import type { Meta, StoryObj } from '@storybook/react';
import { DurationButtons } from './DurationButtons';

const meta: Meta<typeof DurationButtons> = {
  title: 'Timer Engine/DurationButtons',
  component: DurationButtons,
  args: { onAdd: () => undefined },
};
export default meta;

export const Default: StoryObj<typeof DurationButtons> = {};
export const Small: StoryObj<typeof DurationButtons> = { args: { size: 'sm' } };
