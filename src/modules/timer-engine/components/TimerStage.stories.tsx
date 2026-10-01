import type { Meta, StoryObj } from '@storybook/react';
import { withApp } from '@/stories/decorators';
import { TimerStage } from './TimerStage';

const meta: Meta<typeof TimerStage> = {
  title: 'Timer Engine/TimerStage',
  component: TimerStage,
  decorators: [withApp('empty')],
  parameters: { layout: 'centered' },
};
export default meta;

type Story = StoryObj<typeof TimerStage>;

export const Idle: Story = {};
