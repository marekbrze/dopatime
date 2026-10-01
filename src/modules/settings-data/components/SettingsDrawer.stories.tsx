import type { Meta, StoryObj } from '@storybook/react';
import { withApp } from '@/stories/decorators';
import { SettingsDrawer } from './SettingsDrawer';

const meta: Meta<typeof SettingsDrawer> = { title: 'Settings/SettingsDrawer', component: SettingsDrawer };
export default meta;

type Story = StoryObj<typeof SettingsDrawer>;

export const Defaults: Story = { decorators: [withApp('empty')] };
export const Customized: Story = { decorators: [withApp('full')] };
