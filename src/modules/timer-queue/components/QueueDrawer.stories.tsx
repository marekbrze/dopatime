import type { Meta, StoryObj } from '@storybook/react';
import { withApp } from '@/stories/decorators';
import { QueueDrawer } from './QueueDrawer';

const meta: Meta<typeof QueueDrawer> = { title: 'Timer Queue/QueueDrawer', component: QueueDrawer };
export default meta;

type Story = StoryObj<typeof QueueDrawer>;

export const EmptyState: Story = { decorators: [withApp('empty')] };
export const WithItems: Story = { decorators: [withApp('full')] };
