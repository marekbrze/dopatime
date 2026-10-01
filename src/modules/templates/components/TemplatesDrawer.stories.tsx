import type { Meta, StoryObj } from '@storybook/react';
import { withApp } from '@/stories/decorators';
import { TemplatesDrawer } from './TemplatesDrawer';

const meta: Meta<typeof TemplatesDrawer> = { title: 'Templates/TemplatesDrawer', component: TemplatesDrawer };
export default meta;

type Story = StoryObj<typeof TemplatesDrawer>;

export const EmptyState: Story = { decorators: [withApp('empty')] };
export const WithTemplates: Story = { decorators: [withApp('full')] };
